// @ts-nocheck
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

// -------------------------------------------------------------
// IN-MEMORY RATE LIMITER (Guards Free Quota against abuse/spam)
// -------------------------------------------------------------
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1-minute window
const MAX_REQUESTS_PER_WINDOW = 10;     // Max 10 calls/minute per IP/ID

function checkRateLimit(clientKey: string): { allowed: boolean; retryAfter?: number } {
  const now = Date.now();
  const entry = rateLimitMap.get(clientKey);

  // Evict stale entries if cache grows
  if (rateLimitMap.size > 2000) {
    for (const [key, val] of rateLimitMap.entries()) {
      if (now > val.resetTime) rateLimitMap.delete(key);
    }
  }

  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(clientKey, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return { allowed: true };
  }

  if (entry.count >= MAX_REQUESTS_PER_WINDOW) {
    return { allowed: false, retryAfter: Math.ceil((entry.resetTime - now) / 1000) };
  }

  entry.count++;
  return { allowed: true };
}

serve(async (req: Request) => {
  // 1. Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // 2. Identify client for rate-limiting (IP + Registration ID)
    const clientIp = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || 
                     req.headers.get("cf-connecting-ip") || 
                     "unknown-ip";

    const { amount, currency = "INR", registrationId, eventId, eventTitle, receipt } = await req.json();

    const rateLimitKey = `${clientIp}_${registrationId || "guest"}`;
    const rateCheck = checkRateLimit(rateLimitKey);

    if (!rateCheck.allowed) {
      return new Response(
        JSON.stringify({
          error: `Too many payment requests. Please wait ${rateCheck.retryAfter} seconds before trying again.`,
        }),
        {
          status: 429,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
            "Retry-After": String(rateCheck.retryAfter || 60),
          },
        }
      );
    }

    // 3. Validation
    if (!amount || Number(amount) <= 0) {
      return new Response(
        JSON.stringify({ error: "Invalid amount specified. Must be greater than 0." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const keyId = Deno.env.get("RAZORPAY_KEY_ID");
    const keySecret = Deno.env.get("RAZORPAY_KEY_SECRET");

    if (!keyId || !keySecret) {
      return new Response(
        JSON.stringify({ error: "Payment gateway credentials are not configured on the server." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    let supabase = null;

    if (supabaseUrl && supabaseServiceKey) {
      supabase = createClient(supabaseUrl, supabaseServiceKey);
    }

    // 4. IDEMPOTENCY / ORDER REUSE CHECK
    // If registration exists, check if already PAID or already has a valid active order
    if (supabase && registrationId) {
      const { data: existingReg, error: regErr } = await supabase
        .from("registrations")
        .select("id, payment_order_id, payment_status, amount_paid")
        .eq("id", registrationId)
        .maybeSingle();

      if (!regErr && existingReg) {
        // Guard A: Already marked as PAID -> Block order creation
        if (existingReg.payment_status === "PAID") {
          return new Response(
            JSON.stringify({
              error: "This registration has already been verified and paid.",
              alreadyPaid: true,
              registrationId,
            }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        // Guard B: Already has an active order ID & still PENDING -> Reuse it!
        // Prevents consuming extra calls or generating multiple Razorpay orders
        if (existingReg.payment_order_id && existingReg.payment_status === "PENDING") {
          return new Response(
            JSON.stringify({
              id: existingReg.payment_order_id,
              amount: Math.round(Number(amount) * 100),
              currency: currency || "INR",
              receipt: receipt || `rec_${registrationId}`,
              reused: true,
            }),
            { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
      }
    }

    // 5. Create new Razorpay order only when needed
    const amountInPaise = Math.round(Number(amount) * 100);
    const authHeader = btoa(`${keyId}:${keySecret}`);

    const rzpResponse = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${authHeader}`,
      },
      body: JSON.stringify({
        amount: amountInPaise,
        currency: currency || "INR",
        receipt: receipt || `rec_${registrationId || Date.now()}`,
        notes: {
          registrationId: registrationId || "",
          eventId: eventId || "",
          eventTitle: eventTitle || "",
        },
      }),
    });

    if (!rzpResponse.ok) {
      const errData = await rzpResponse.json();
      console.error("Razorpay order creation error:", errData);
      return new Response(
        JSON.stringify({ error: errData.error?.description || "Failed to create payment order." }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const orderData = await rzpResponse.json();

    // 6. Save newly generated order ID to registrations table
    if (supabase && registrationId) {
      try {
        await supabase
          .from("registrations")
          .update({
            payment_order_id: orderData.id,
            payment_status: "PENDING",
            amount_paid: amount,
          })
          .eq("id", registrationId);
      } catch (dbErr) {
        console.warn("DB update failed during order creation:", dbErr);
      }
    }

    return new Response(
      JSON.stringify({
        id: orderData.id,
        amount: orderData.amount,
        currency: orderData.currency,
        receipt: orderData.receipt,
        reused: false,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err: any) {
    console.error("Unexpected error in create-razorpay-order:", err);
    return new Response(
      JSON.stringify({ error: err.message || "Internal server error." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
