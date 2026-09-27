import React, { useState, useEffect, useCallback } from 'react';
import {
  CreditCard,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Loader2,
  ArrowLeft,
  RefreshCw,
  IndianRupee,
  Clock,
  MapPin,
  Users,
  User,
  Sparkles,
  XCircle,
  Ticket,
  Lock,
  Zap,
  QrCode,
  Building2,
  Copy,
  Check,
  ArrowRight,
} from 'lucide-react';
import { CollegeEvent, Participant, Registration, TeamMember } from '../../types';
import { supabase } from '../../lib/supabaseClient';
import { MockDatabaseService } from '../../data/mockDatabase';

// Razorpay global types
declare global {
  interface Window {
    Razorpay: any;
  }
}

interface PaymentGatewayProps {
  event: CollegeEvent;
  registration: Registration;
  participantData: Partial<Participant>;
  onPaymentVerified: (updatedRegistration: Registration) => void;
  onBackToEvents: () => void;
}

type PaymentStep =
  | 'SUMMARY'       // Showing order summary, ready to pay
  | 'CREATING_ORDER' // Creating Razorpay order via Edge Function
  | 'CHECKOUT_OPEN'  // Razorpay modal is open
  | 'VERIFYING'      // Verifying payment with backend
  | 'SUCCESS'        // Payment verified ✅
  | 'FAILED'         // Signature verification failed ❌
  | 'ERROR';         // Network/system error

export const PaymentGateway: React.FC<PaymentGatewayProps> = ({
  event,
  registration,
  participantData,
  onPaymentVerified,
  onBackToEvents,
}) => {
  const [step, setStep] = useState<PaymentStep>('SUMMARY');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [copiedId, setCopiedId] = useState(false);

  const handleCopyId = () => {
    try {
      navigator.clipboard.writeText(registration.registrationNumber);
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
    } catch {
      // ignore
    }
  };

  const razorpayKeyId = import.meta.env.VITE_RAZORPAY_KEY_ID || '';
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';

  // Create Razorpay order via Supabase Edge Function
  const createOrder = useCallback(async () => {
    setStep('CREATING_ORDER');
    setErrorMessage(null);

    try {
      const response = await fetch(`${supabaseUrl}/functions/v1/create-razorpay-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          amount: event.price,
          currency: 'INR',
          registrationId: registration.id,
          eventId: event.id,
          eventTitle: event.title,
          receipt: registration.registrationNumber,
        }),
      });

      if (!response.ok) {
        throw new Error(`Order creation failed: ${response.status}`);
      }

      const data = await response.json();
      if (data.id) {
        setOrderId(data.id);
        openRazorpayCheckout(data.id);
      } else {
        throw new Error(data.error || 'Failed to create payment order.');
      }
    } catch (err: any) {
      console.error('Order creation error:', err);
      setStep('ERROR');
      setErrorMessage(err.message || 'Failed to create payment order. Please try again.');
    }
  }, [event, registration, supabaseUrl]);

  // Open Razorpay Checkout Modal
  const openRazorpayCheckout = (rzpOrderId: string) => {
    if (!window.Razorpay) {
      setStep('ERROR');
      setErrorMessage('Payment gateway not loaded. Please refresh the page and try again.');
      return;
    }

    setStep('CHECKOUT_OPEN');

    const options = {
      key: razorpayKeyId,
      amount: event.price * 100, // Razorpay expects paise
      currency: 'INR',
      name: "RADIANZA '26",
      description: `Event Registration: ${event.title}`,
      order_id: rzpOrderId,
      prefill: {
        name: participantData.name || registration.leaderName,
        email: participantData.email || registration.leaderEmail,
        contact: participantData.phone || registration.leaderPhone || '',
      },
      notes: {
        registrationId: registration.id,
        registrationNumber: registration.registrationNumber,
        eventId: event.id,
        eventTitle: event.title,
      },
      theme: {
        color: '#002b66',
        backdrop_color: 'rgba(0, 43, 102, 0.85)',
      },
      modal: {
        ondismiss: () => {
          // User cancelled/closed Razorpay modal → stays PENDING (retryable)
          setStep('SUMMARY');
          setRetryCount((prev) => prev + 1);
        },
      },
      handler: async (response: {
        razorpay_payment_id: string;
        razorpay_order_id: string;
        razorpay_signature: string;
      }) => {
        // Payment completed — verify with backend
        await verifyPayment(response);
      },
    };

    try {
      const razorpay = new window.Razorpay(options);
      razorpay.on('payment.failed', (response: any) => {
        console.error('Razorpay payment.failed:', response.error);
        // Payment failed at Razorpay's end — stay PENDING for retry
        setStep('SUMMARY');
        setErrorMessage(
          `Payment was declined: ${response.error?.description || 'Please try again with a different payment method.'}`
        );
        setRetryCount((prev) => prev + 1);
      });
      razorpay.open();
    } catch (err: any) {
      console.error('Razorpay open error:', err);
      setStep('ERROR');
      setErrorMessage('Failed to open payment gateway. Please try again.');
    }
  };

  // Verify payment via Supabase Edge Function (backend-first verification)
  const verifyPayment = async (razorpayResponse: {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
  }) => {
    setStep('VERIFYING');
    setErrorMessage(null);

    try {
      const response = await fetch(`${supabaseUrl}/functions/v1/verify-razorpay-payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          razorpay_payment_id: razorpayResponse.razorpay_payment_id,
          razorpay_order_id: razorpayResponse.razorpay_order_id,
          razorpay_signature: razorpayResponse.razorpay_signature,
          registrationId: registration.id,
        }),
      });

      const data = await response.json();

      if (data.verified) {
        // Backend confirmed payment — update local state
        const updateResult = MockDatabaseService.updatePaymentStatus(
          registration.id,
          'PAID',
          {
            paymentId: razorpayResponse.razorpay_payment_id,
            paymentOrderId: razorpayResponse.razorpay_order_id,
            amountPaid: event.price,
            paidAt: new Date().toISOString(),
          }
        );

        setStep('SUCCESS');

        // Auto-redirect to success pass after celebration
        setTimeout(() => {
          if (updateResult.registration) {
            onPaymentVerified(updateResult.registration);
          }
        }, 2000);
      } else {
        // Signature verification failed — mark as FAILED (suspicious)
        MockDatabaseService.updatePaymentStatus(registration.id, 'FAILED');
        setStep('FAILED');
        setErrorMessage(
          data.error || 'Payment verification failed. This may indicate a tampered transaction. Please contact support.'
        );
      }
    } catch (err: any) {
      console.error('Verification error:', err);
      // Network error during verification — payment may have succeeded
      // The webhook will catch it. Show timeout message.
      setStep('ERROR');
      setErrorMessage(
        'Payment verification timed out. If money was deducted, the webhook will process it automatically. Please check your dashboard in a few minutes.'
      );
    }
  };

  // For development/testing: simulate payment flow without real Razorpay
  const handleDevSimulatePayment = () => {
    setStep('VERIFYING');
    setTimeout(() => {
      const updateResult = MockDatabaseService.updatePaymentStatus(
        registration.id,
        'PAID',
        {
          paymentId: `pay_test_${Date.now()}`,
          paymentOrderId: `order_test_${Date.now()}`,
          amountPaid: event.price,
          paidAt: new Date().toISOString(),
        }
      );
      setStep('SUCCESS');
      setTimeout(() => {
        if (updateResult.registration) {
          onPaymentVerified(updateResult.registration);
        }
      }, 2000);
    }, 1500);
  };

  const handlePrimaryPayClick = () => {
    if (isRazorpayConfigured) {
      createOrder();
    } else {
      handleDevSimulatePayment();
    }
  };

  const isRazorpayConfigured = razorpayKeyId && !razorpayKeyId.includes('REPLACE');

  return (
    <div className="w-full min-h-screen bg-slate-50 text-slate-900 flex flex-col items-center justify-start py-6 sm:py-10 px-4">
      <div className="w-full max-w-lg mx-auto space-y-5 animate-in fade-in duration-300">
        {/* Header Bar */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={onBackToEvents}
            disabled={step === 'VERIFYING' || step === 'CREATING_ORDER'}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-[#0077c8] transition-colors cursor-pointer bg-white px-3.5 py-1.5 rounded-xl border border-slate-200 shadow-xs hover:border-[#0077c8]/40 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ArrowLeft className="w-4 h-4 text-slate-600" />
            <span>Back</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="font-serif font-extrabold text-xs text-[#002b66] tracking-tight">RADIANZA '26</span>
            <span className="text-slate-300 text-xs">•</span>
            <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-bold shadow-2xs">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Secure Checkout</span>
            </div>
          </div>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-2.5 py-1">
          <div className="flex items-center gap-1.5 text-xs font-medium">
            <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-bold shadow-2xs">✓</span>
            <span className="text-emerald-700 font-semibold text-xs">Details</span>
          </div>
          <div className="w-8 h-px bg-slate-300" />
          <div className="flex items-center gap-1.5 text-xs font-medium">
            <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-bold shadow-2xs">✓</span>
            <span className="text-emerald-700 font-semibold text-xs">Event</span>
          </div>
          <div className="w-8 h-px bg-slate-300" />
          <div className="flex items-center gap-1.5 text-xs font-medium">
            <span className="w-5 h-5 rounded-full bg-[#002b66] text-white flex items-center justify-center text-[10px] font-bold shadow-xs ring-2 ring-[#0077c8]/30">3</span>
            <span className="text-[#002b66] font-extrabold text-xs">Payment</span>
          </div>
        </div>

        {/* ── ORDER SUMMARY CARD ── */}
        <div className="bg-gradient-to-b from-[#001f4d] via-[#002b66] to-[#001838] rounded-3xl p-5 sm:p-6 shadow-2xl border border-white/20 text-white space-y-4 relative overflow-hidden">
        {/* Background Glow Effects */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-[#0077c8]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#00a887]/15 rounded-full blur-2xl pointer-events-none" />

        {/* Event Info */}
        <div className="relative z-10 space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <span className={`text-[10px] uppercase font-extrabold tracking-wider px-2 py-0.5 rounded-full ${
                event.category === 'Technical' ? 'bg-[#0077c8] text-white' : 'bg-[#00a887] text-white'
              }`}>
                {event.category}
              </span>
              <h3 className="text-lg font-serif font-bold text-white mt-1">{event.title}</h3>
              <p className="text-xs text-slate-300 font-medium">{event.tagline}</p>
            </div>
            <div className="text-right shrink-0">
              <span className="text-[10px] text-white/60 uppercase font-bold block">Registration Fee</span>
              <span className="text-2xl font-black text-[#7af1fc]">₹{event.price}</span>
            </div>
          </div>

          {/* Quick Info */}
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-2.5 py-1.5 rounded-xl border border-white/15">
              <Clock className="w-3.5 h-3.5 text-[#7af1fc] shrink-0" />
              <span className="text-white/90">{event.time}</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-2.5 py-1.5 rounded-xl border border-white/15">
              <MapPin className="w-3.5 h-3.5 text-[#7af1fc] shrink-0" />
              <span className="text-white/90 truncate">{event.venue}</span>
            </div>
          </div>

          {/* Participant Info */}
          <div className="bg-white/10 backdrop-blur-md px-3.5 py-2.5 rounded-2xl border border-white/15 space-y-1">
            <span className="text-[10px] text-white/60 uppercase font-bold">Registered As</span>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {event.isTeamEvent ? (
                  <Users className="w-4 h-4 text-[#7af1fc]" />
                ) : (
                  <User className="w-4 h-4 text-[#7af1fc]" />
                )}
                <div>
                  <p className="text-xs font-bold text-white">{registration.leaderName}</p>
                  <p className="text-[10px] text-white/70 font-mono">{registration.leaderRollNumber}</p>
                </div>
              </div>
              {registration.teamName && (
                <span className="text-[10px] font-bold text-[#7af1fc] bg-white/10 px-2 py-0.5 rounded-lg border border-white/15">
                  {registration.teamName}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Price Breakdown */}
        <div className="relative z-10 border-t border-white/15 pt-3 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-white/70">Event Registration Fee</span>
            <span className="text-white font-semibold">₹{event.price}.00</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-white/70">Processing Fee</span>
            <span className="text-emerald-400 font-semibold">FREE</span>
          </div>
          <div className="flex items-center justify-between text-sm pt-2 border-t border-white/20">
            <span className="text-white font-bold">Total Payable</span>
            <span className="text-xl font-black text-[#7af1fc]">₹{event.price}.00</span>
          </div>
        </div>
      </div>

      {/* ── PAYMENT STATUS INDICATOR ── */}
      {step === 'CREATING_ORDER' && (
        <div className="flex items-center justify-center gap-3 p-4 bg-blue-50 rounded-2xl border border-blue-200 text-blue-800">
          <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
          <span className="text-xs font-bold">Creating secure payment order...</span>
        </div>
      )}

      {step === 'CHECKOUT_OPEN' && (
        <div className="flex items-center justify-center gap-3 p-4 bg-amber-50 rounded-2xl border border-amber-200 text-amber-800">
          <CreditCard className="w-5 h-5 text-amber-600 animate-pulse" />
          <span className="text-xs font-bold">Complete payment in the Razorpay window...</span>
        </div>
      )}

      {step === 'VERIFYING' && (
        <div className="flex items-center justify-center gap-3 p-4 bg-indigo-50 rounded-2xl border border-indigo-200 text-indigo-800">
          <ShieldCheck className="w-5 h-5 text-indigo-600 animate-pulse" />
          <span className="text-xs font-bold">Verifying payment with server... Do not close this page.</span>
        </div>
      )}

      {step === 'SUCCESS' && (
        <div className="flex flex-col items-center gap-3 p-5 bg-emerald-50 rounded-2xl border border-emerald-300 text-emerald-800">
          <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center ring-4 ring-emerald-500/20">
            <CheckCircle2 className="w-8 h-8 text-emerald-600" />
          </div>
          <div className="text-center">
            <h4 className="text-sm font-bold text-emerald-900">Payment Verified!</h4>
            <p className="text-xs text-emerald-700 mt-0.5">Your QR pass is being generated...</p>
          </div>
          <Loader2 className="w-4 h-4 animate-spin text-emerald-500" />
        </div>
      )}

      {step === 'FAILED' && (
        <div className="flex flex-col items-center gap-3 p-5 bg-red-50 rounded-2xl border border-red-300 text-red-800">
          <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center ring-4 ring-red-500/20">
            <XCircle className="w-8 h-8 text-red-600" />
          </div>
          <div className="text-center">
            <h4 className="text-sm font-bold text-red-900">Payment Verification Failed</h4>
            <p className="text-xs text-red-700 mt-0.5">{errorMessage}</p>
          </div>
          <p className="text-[10px] text-red-600 font-mono text-center px-4">
            If money was deducted, please contact support at radianza2026@spiher.edu.in with your registration number: {registration.registrationNumber}
          </p>
        </div>
      )}

      {/* Error Message (for recoverable errors) */}
      {errorMessage && step !== 'FAILED' && (
        <div className="flex items-start gap-2.5 p-3.5 bg-amber-50 rounded-2xl border border-amber-200 text-amber-800">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <span className="text-xs font-bold block">Payment Interrupted</span>
            <span className="text-[11px] text-amber-700">{errorMessage}</span>
          </div>
        </div>
      )}

      {/* ── ACTION & PAYMENT METHOD SECTION ── */}
      {(step === 'SUMMARY' || step === 'ERROR') && (
        <div className="space-y-4">
          {/* Payment Method Selector */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-3.5 space-y-3">
            <div className="flex items-center justify-between text-xs px-1">
              <span className="font-bold text-[#002b66]">Select Payment Mode</span>
              <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                ⚡ Instant Verification
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod('upi')}
                className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                  paymentMethod === 'upi'
                    ? 'border-[#0077c8] bg-[#f0f8fc] text-[#002b66] shadow-xs ring-1 ring-[#0077c8]'
                    : 'border-slate-200 bg-slate-50/60 text-slate-600 hover:bg-slate-100/80 hover:border-slate-300'
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center mb-1.5 shadow-2xs">
                  <QrCode className="w-4 h-4 text-[#0077c8]" />
                </div>
                <span className="text-[11px] font-bold block leading-tight">UPI / QR</span>
                <span className="text-[9px] text-slate-600 font-medium">GPay, PhonePe</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                  paymentMethod === 'card'
                    ? 'border-[#0077c8] bg-[#f0f8fc] text-[#002b66] shadow-xs ring-1 ring-[#0077c8]'
                    : 'border-slate-200 bg-slate-50/60 text-slate-600 hover:bg-slate-100/80 hover:border-slate-300'
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center mb-1.5 shadow-2xs">
                  <CreditCard className="w-4 h-4 text-[#002b66]" />
                </div>
                <span className="text-[11px] font-bold block leading-tight">Cards</span>
                <span className="text-[9px] text-slate-600 font-medium">Debit / Credit</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('netbanking')}
                className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                  paymentMethod === 'netbanking'
                    ? 'border-[#0077c8] bg-[#f0f8fc] text-[#002b66] shadow-xs ring-1 ring-[#0077c8]'
                    : 'border-slate-200 bg-slate-50/60 text-slate-600 hover:bg-slate-100/80 hover:border-slate-300'
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center mb-1.5 shadow-2xs">
                  <Building2 className="w-4 h-4 text-emerald-600" />
                </div>
                <span className="text-[11px] font-bold block leading-tight">Net Banking</span>
                <span className="text-[9px] text-slate-600 font-medium">All Major Banks</span>
              </button>
            </div>
          </div>

          {/* Unified Production-Grade Pay Button */}
          <button
            type="button"
            onClick={handlePrimaryPayClick}
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-[#001f4d] via-[#002b66] to-[#0077c8] hover:from-[#001838] hover:to-[#005fa3] text-white font-bold text-sm shadow-xl shadow-[#002b66]/25 flex items-center justify-between transition-all cursor-pointer active:scale-[0.99] hover:shadow-2xl hover:scale-[1.005] group"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
                <Lock className="w-4 h-4 text-[#7af1fc]" />
              </div>
              <div className="text-left">
                <span className="text-[10px] text-[#7af1fc] uppercase tracking-wider font-extrabold block">
                  {retryCount > 0 ? 'Retry Payment' : 'Pay Now'}
                </span>
                <span className="text-sm font-bold text-white">
                  {isRazorpayConfigured ? 'Checkout with Razorpay' : `Pay ₹${event.price}.00 Securely`}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-xl border border-white/15 group-hover:bg-white/20 transition-all">
              <span className="text-base font-black text-white">₹{event.price}</span>
              <ArrowRight className="w-4 h-4 text-[#7af1fc] group-hover:translate-x-0.5 transition-transform" />
            </div>
          </button>

          {retryCount > 0 && (
            <p className="text-center text-[10px] text-slate-500 font-medium">
              Payment pending • Attempt {retryCount + 1} • Your registration is saved and waiting for payment
            </p>
          )}
        </div>
      )}

      {/* Official Registration Receipt Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-3.5 flex items-center justify-between">
        <div className="space-y-0.5">
          <span className="text-[10px] uppercase font-bold text-slate-600 tracking-wider block">
            Registration Order ID
          </span>
          <span className="font-mono text-xs font-bold text-[#002b66]">
            {registration.registrationNumber}
          </span>
        </div>

        <button
          type="button"
          onClick={handleCopyId}
          className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-600 hover:text-[#0077c8] bg-slate-50 hover:bg-slate-100 px-2.5 py-1.5 rounded-lg border border-slate-200 transition-colors cursor-pointer"
        >
          {copiedId ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-emerald-700 font-bold">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-slate-500" />
              <span>Copy ID</span>
            </>
          )}
        </button>
      </div>
      </div>
    </div>
  );
};

export default PaymentGateway;
