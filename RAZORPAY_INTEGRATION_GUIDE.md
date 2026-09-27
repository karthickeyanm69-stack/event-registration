# 💳 RADIANZA '26 — Razorpay Payment Gateway Integration Guide

## 1. System Architecture Overview

```
Participant selects Event (₹200)
            │
            ▼
Registration saved as PENDING in Supabase & Local Cache
            │
            ▼
[Edge Function: create-razorpay-order] ──► Generates Razorpay Order (Paise: 20000)
            │
            ▼
Frontend opens official Razorpay Checkout Modal
            │
      ┌─────┴────────────────┐
      │                      │
   Success                 Cancelled / Dismissed
      │                      │
      ▼                      ▼
[Edge Function:            Status stays PENDING
 verify-razorpay-payment]  Student can click "Retry"
      │
      ▼
HMAC SHA-256 Signature Verification
      │
   ┌──┴──────────────────────┐
   │                         │
Signature Valid         Signature Mismatch
   │                         │
   ▼                         ▼
Status = PAID           Status = FAILED (Flagged)
QR Entry Pass Issued    Admin Review Required
```

---

## 2. File Map in Your Working Directory

| Purpose | File Path |
| :--- | :--- |
| **Frontend Checkout Component** | [`src/components/participant/PaymentGateway.tsx`](file:///c:/Users/DELL/Desktop/RADIANZA/main/src/components/participant/PaymentGateway.tsx) |
| **Pass & Transaction Receipt** | [`src/components/participant/RegistrationSuccessPass.tsx`](file:///c:/Users/DELL/Desktop/RADIANZA/main/src/components/participant/RegistrationSuccessPass.tsx) |
| **Admin Rosters & Cash Approval** | [`src/components/admin/AdminPortal.tsx`](file:///c:/Users/DELL/Desktop/RADIANZA/main/src/components/admin/AdminPortal.tsx) |
| **Super Admin Revenue Telemetry** | [`src/components/superadmin/SuperAdminPortal.tsx`](file:///c:/Users/DELL/Desktop/RADIANZA/main/src/components/superadmin/SuperAdminPortal.tsx) |
| **Participant Dashboard Receipt** | [`src/components/participant/ParticipantDashboard.tsx`](file:///c:/Users/DELL/Desktop/RADIANZA/main/src/components/participant/ParticipantDashboard.tsx) |
| **Edge Function 1: Order Creation** | [`supabase/functions/create-razorpay-order/index.ts`](file:///c:/Users/DELL/Desktop/RADIANZA/main/supabase/functions/create-razorpay-order/index.ts) |
| **Edge Function 2: Signature Verify**| [`supabase/functions/verify-razorpay-payment/index.ts`](file:///c:/Users/DELL/Desktop/RADIANZA/main/supabase/functions/verify-razorpay-payment/index.ts) |
| **Edge Function 3: Webhook Fallback** | [`supabase/functions/razorpay-webhook/index.ts`](file:///c:/Users/DELL/Desktop/RADIANZA/main/supabase/functions/razorpay-webhook/index.ts) |
| **Database Schema** | [`supabase_schema.sql`](file:///c:/Users/DELL/Desktop/RADIANZA/main/supabase_schema.sql) |

---

## 3. Required Environment Variables

### In Local `.env` (Frontend Only):
```env
VITE_SUPABASE_URL=https://oguskreksqxtmipgvnai.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_RAZORPAY_KEY_ID=rzp_test_YOUR_KEY_ID
```

### In Vercel Project Settings (Production):
Navigate to **Vercel Dashboard → Your Project → Settings → Environment Variables**:
- `VITE_SUPABASE_URL` = `https://oguskreksqxtmipgvnai.supabase.co`
- `VITE_SUPABASE_ANON_KEY` = `your_anon_key`
- `VITE_RAZORPAY_KEY_ID` = `rzp_test_YOUR_KEY_ID` (or `rzp_live_...` on symposium day)

### In Supabase Function Secrets (Server-Side):
Navigate to **Supabase Dashboard → Project Settings → Edge Functions → Function Secrets**:
- `RAZORPAY_KEY_ID` = `rzp_test_YOUR_KEY_ID`
- `RAZORPAY_KEY_SECRET` = `your_razorpay_secret`

---

## 4. Key Security & Free-Tier Protections
1. **Never exposes Secret**: `RAZORPAY_KEY_SECRET` lives solely in Supabase secrets, never shipped to the frontend.
2. **In-Memory Rate Limiting**: Max 10 requests/minute per IP prevents API flooding and keeps function calls well below Supabase's 500,000 monthly quota.
3. **Idempotency**: Reuses existing `payment_order_id` if a student closes and reopens the checkout modal.
4. **Offline / Spot Registration**: Admins can approve in-person cash payments at the desk by clicking **`Approve Cash`** in the Admin Portal (Tab 2).
