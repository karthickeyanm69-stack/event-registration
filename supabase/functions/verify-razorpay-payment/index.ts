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
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 15;     // Max 15 verification attempts per minute

function checkRateLimit(clientKey: string): { allowed: boolean; retryAfter?: number } {
  const now = Date.now();
  const entry = rateLimitMap.get(clientKey);

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

function stringToUint8Array(str: string): Uint8Array {
  return new TextEncoder().encode(str);
}

function bufferToHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

// Constant-time string comparison to prevent timing attacks
function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

serve(async (req: Request) => {
  // CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const clientIp = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || 
                     req.headers.get("cf-connecting-ip") || 
                     "unknown-ip";

    const {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      registrationId,
    } = await req.json();

    const rateKey = `${clientIp}_${registrationId || "guest"}`;
    const rateCheck = checkRateLimit(rateKey);

    if (!rateCheck.allowed) {
      return new Response(
        JSON.stringify({
          verified: false,
          error: `Too many verification requests. Please wait ${rateCheck.retryAfter} seconds.`,
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

    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
      return new Response(
        JSON.stringify({
          verified: false,
          error: "Missing required payment verification parameters.",
        }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const keySecret = Deno.env.get("RAZORPAY_KEY_SECRET");
    if (!keySecret) {
      return new Response(
        JSON.stringify({
          verified: false,
          error: "Server payment configuration missing secret key.",
        }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    let supabase = null;

    if (supabaseUrl && supabaseServiceKey) {
      supabase = createClient(supabaseUrl, supabaseServiceKey);
    }

    // IDEMPOTENT CHECK: If already marked PAID, return success immediately
    if (supabase && registrationId) {
      const { data: reg } = await supabase
        .from("registrations")
        .select("id, payment_status, payment_id, payment_order_id, paid_at")
        .eq("id", registrationId)
        .maybeSingle();

      if (reg && reg.payment_status === "PAID") {
        return new Response(
          JSON.stringify({
            verified: true,
            alreadyVerified: true,
            paymentId: reg.payment_id || razorpay_payment_id,
            orderId: reg.payment_order_id || razorpay_order_id,
            paidAt: reg.paid_at || new Date().toISOString(),
          }),
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    // Cryptographic HMAC SHA-256 calculation
    const textToSign = `${razorpay_order_id}|${razorpay_payment_id}`;
    const key = await crypto.subtle.importKey(
      "raw",
      stringToUint8Array(keySecret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );

    const signatureBuffer = await crypto.subtle.sign(
      "HMAC",
      key,
      stringToUint8Array(textToSign)
    );

    const expectedSignature = bufferToHex(signatureBuffer);
    const isSignatureValid = timingSafeEqual(expectedSignature, razorpay_signature);

    if (isSignatureValid) {
      // Authentic signature -> update DB to PAID
      const paidAt = new Date().toISOString();

      if (supabase && registrationId) {
        try {
          await supabase
            .from("registrations")
            .update({
              payment_status: "PAID",
              payment_id: razorpay_payment_id,
              payment_order_id: razorpay_order_id,
              paid_at: paidAt,
            })
            .eq("id", registrationId);
        } catch (dbErr) {
          console.warn("DB update failed during payment verification:", dbErr);
        }
      }

      return new Response(
        JSON.stringify({
          verified: true,
          paymentId: razorpay_payment_id,
          orderId: razorpay_order_id,
          paidAt,
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    } else {
      // Signature mismatch -> mark FAILED
      console.error(
        `Payment signature verification failed for registration ${registrationId}. Expected: ${expectedSignature}, Received: ${razorpay_signature}`
      );

      if (supabase && registrationId) {
        try {
          await supabase
            .from("registrations")
            .update({
              payment_status: "FAILED",
            })
            .eq("id", registrationId);
        } catch (dbErr) {
          console.warn("DB update failed during marking failed payment:", dbErr);
        }
      }

      return new Response(
        JSON.stringify({
          verified: false,
          error: "Digital signature verification failed. Transaction cannot be validated.",
        }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
  } catch (err: any) {
    console.error("Unexpected error in verify-razorpay-payment:", err);
    return new Response(
      JSON.stringify({ verified: false, error: err.message || "Internal server error." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
