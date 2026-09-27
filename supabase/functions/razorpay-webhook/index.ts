// @ts-nocheck
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Helper: Convert string to Uint8Array
function stringToUint8Array(str: string): Uint8Array {
  return new TextEncoder().encode(str);
}

// Helper: Convert ArrayBuffer to Hex string
function bufferToHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

// Constant-time string comparison
function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

serve(async (req: Request) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    const signatureHeader = req.headers.get("x-razorpay-signature");
    const webhookSecret = Deno.env.get("RAZORPAY_WEBHOOK_SECRET");

    const rawBody = await req.text();

    // Verify webhook signature if webhook secret is configured
    if (webhookSecret) {
      if (!signatureHeader) {
        return new Response("Missing signature header", { status: 400 });
      }

      const key = await crypto.subtle.importKey(
        "raw",
        stringToUint8Array(webhookSecret),
        { name: "HMAC", hash: "SHA-256" },
        false,
        ["sign"]
      );

      const signatureBuffer = await crypto.subtle.sign(
        "HMAC",
        key,
        stringToUint8Array(rawBody)
      );

      const expectedSignature = bufferToHex(signatureBuffer);
      if (!timingSafeEqual(expectedSignature, signatureHeader)) {
        console.error("Webhook signature mismatch!");
        return new Response("Invalid signature", { status: 401 });
      }
    }

    const payload = JSON.parse(rawBody);
    const eventType = payload.event;
    console.log(`Razorpay webhook received: ${eventType}`);

    // Authoritative payment success events: payment.captured or order.paid
    if (eventType === "payment.captured" || eventType === "order.paid") {
      const paymentEntity = payload.payload?.payment?.entity;
      const orderId = paymentEntity?.order_id || payload.payload?.order?.entity?.id;
      const paymentId = paymentEntity?.id;
      const amount = paymentEntity?.amount ? paymentEntity.amount / 100 : undefined;

      const supabaseUrl = Deno.env.get("SUPABASE_URL");
      const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

      if (supabaseUrl && supabaseServiceKey && orderId) {
        const supabase = createClient(supabaseUrl, supabaseServiceKey);

        // Find registration by payment_order_id
        const { data: reg, error: fetchErr } = await supabase
          .from("registrations")
          .select("id, payment_status")
          .eq("payment_order_id", orderId)
          .maybeSingle();

        if (fetchErr) {
          console.error("Webhook registration lookup error:", fetchErr);
        } else if (reg) {
          // Idempotent update: only update if not already PAID
          if (reg.payment_status === "PAID") {
            console.log(`Registration ${reg.id} already marked PAID. Idempotent skip.`);
          } else {
            const { error: updateErr } = await supabase
              .from("registrations")
              .update({
                payment_status: "PAID",
                payment_id: paymentId,
                paid_at: new Date().toISOString(),
                ...(amount ? { amount_paid: amount } : {}),
              })
              .eq("id", reg.id);

            if (updateErr) {
              console.error("Webhook registration update error:", updateErr);
            } else {
              console.log(`Successfully verified and marked PAID for registration ${reg.id} via webhook.`);
            }
          }
        }
      }
    }

    return new Response(JSON.stringify({ status: "ok" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: any) {
    console.error("Unexpected error in razorpay-webhook:", err);
    return new Response(JSON.stringify({ error: err.message || "Internal server error." }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
