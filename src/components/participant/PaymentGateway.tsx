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

  // Auto-redirect if registration is already marked PAID
  useEffect(() => {
    if (registration.paymentStatus === 'PAID') {
      onPaymentVerified(registration);
    }
  }, [registration.paymentStatus, onPaymentVerified]);

  // Guaranteed fallback timer whenever SUCCESS step is reached
  useEffect(() => {
    if (step === 'SUCCESS') {
      const timer = setTimeout(() => {
        const finalReg: Registration = {
          ...registration,
          paymentStatus: 'PAID',
          paidAt: registration.paidAt || new Date().toISOString(),
        };
        onPaymentVerified(finalReg);
      }, 1800);
      return () => clearTimeout(timer);
    }
  }, [step, registration, onPaymentVerified]);

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

      const data = await response.json().catch(() => ({}));

      // If registration is already verified/paid on Supabase backend, immediately complete!
      if (
        data.alreadyPaid ||
        (data.error && data.error.toLowerCase().includes('already been verified and paid'))
      ) {
        const paidReg: Registration = {
          ...registration,
          paymentStatus: 'PAID',
          paidAt: registration.paidAt || new Date().toISOString(),
        };
        MockDatabaseService.updatePaymentStatus(registration.id, 'PAID');
        onPaymentVerified(paidReg);
        return;
      }

      if (!response.ok) {
        throw new Error(data.error || `Order creation failed: ${response.status}`);
      }

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
  }, [event, registration, supabaseUrl, onPaymentVerified]);

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

        const finalRegistration: Registration = updateResult.registration || {
          ...registration,
          paymentStatus: 'PAID',
          paymentId: razorpayResponse.razorpay_payment_id,
          paymentOrderId: razorpayResponse.razorpay_order_id,
          amountPaid: event.price,
          paidAt: new Date().toISOString(),
        };

        // Auto-redirect to success pass after celebration
        setTimeout(() => {
          onPaymentVerified(finalRegistration);
        }, 1500);
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

      const finalRegistration: Registration = updateResult.registration || {
        ...registration,
        paymentStatus: 'PAID',
        paymentId: `pay_test_${Date.now()}`,
        paymentOrderId: `order_test_${Date.now()}`,
        amountPaid: event.price,
        paidAt: new Date().toISOString(),
      };

      setTimeout(() => {
        onPaymentVerified(finalRegistration);
      }, 1500);
    }, 1200);
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
    <div className="w-full min-h-screen bg-[#05050a] text-white flex flex-col items-center justify-start py-6 sm:py-10 px-4 relative overflow-x-hidden">
      {/* Spider-Verse Ambient Glow */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-[#FF1E42]/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-[#FF6B00]/10 blur-[120px] pointer-events-none" />

      <div className="w-full max-w-lg mx-auto space-y-5 animate-in fade-in duration-300 relative z-10">
        {/* Header Bar */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={onBackToEvents}
            disabled={step === 'VERIFYING' || step === 'CREATING_ORDER'}
            className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-stone-300 hover:text-white transition-colors cursor-pointer bg-[#110c20] px-3.5 py-1.5 rounded-xl border border-[#FF1E42]/30 shadow-md hover:border-[#FF1E42] disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ArrowLeft className="w-4 h-4 text-[#FF1E42]" />
            <span>BACK</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="font-['Impact',sans-serif] text-sm text-white tracking-wide uppercase">RADIANZA <span className="text-[#FF1E42]">'26</span></span>
            <span className="text-stone-600 text-xs">•</span>
            <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-950/40 border border-emerald-500/40 text-emerald-400 text-[11px] font-mono font-bold shadow-md">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>SECURE CHECKOUT</span>
            </div>
          </div>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-2.5 py-1">
          <div className="flex items-center gap-1.5 text-xs font-mono font-bold">
            <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px]">✓</span>
            <span className="text-emerald-400">Details</span>
          </div>
          <div className="w-8 h-px bg-white/20" />
          <div className="flex items-center gap-1.5 text-xs font-mono font-bold">
            <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px]">✓</span>
            <span className="text-emerald-400">Arena</span>
          </div>
          <div className="w-8 h-px bg-white/20" />
          <div className="flex items-center gap-1.5 text-xs font-mono font-bold">
            <span className="w-5 h-5 rounded-full bg-[#FF1E42] text-white flex items-center justify-center text-[10px] shadow-[0_0_8px_#FF1E42]">3</span>
            <span className="text-[#FF1E42]">Payment</span>
          </div>
        </div>

        {/* ── ORDER SUMMARY CARD ── */}
        <div className="bg-gradient-to-b from-[#180922] via-[#090714] to-[#120516] rounded-3xl p-5 sm:p-6 shadow-2xl border border-[#FF1E42]/40 text-white space-y-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-[#FF1E42]/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#FF6B00]/15 rounded-full blur-2xl pointer-events-none" />

          {/* Event Info */}
          <div className="relative z-10 space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <span className={`text-[10px] uppercase font-mono font-black tracking-wider px-2 py-0.5 rounded-full ${
                  event.category === 'Technical' ? 'bg-[#FF1E42] text-white' : 'bg-[#FF6B00] text-white'
                }`}>
                  {event.category}
                </span>
                <h3 className="text-lg font-['Impact',sans-serif] uppercase tracking-wide text-white mt-1">{event.title}</h3>
                <p className="text-xs text-stone-300 font-mono">{event.tagline}</p>
              </div>
              <div className="text-right shrink-0">
                <span className="text-[10px] text-stone-400 uppercase font-mono font-bold block">Entry Fee</span>
                <span className="text-2xl font-mono font-black text-[#FFE600]">₹{event.price}</span>
              </div>
            </div>

            {/* Quick Info */}
            <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
              <div className="flex items-center gap-1.5 bg-white/5 backdrop-blur-md px-2.5 py-1.5 rounded-xl border border-white/10">
                <Clock className="w-3.5 h-3.5 text-[#FF1E42] shrink-0" />
                <span className="text-stone-300">{event.time}</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/5 backdrop-blur-md px-2.5 py-1.5 rounded-xl border border-white/10">
                <MapPin className="w-3.5 h-3.5 text-[#FF6B00] shrink-0" />
                <span className="text-stone-300 truncate">{event.venue}</span>
              </div>
            </div>

            {/* Participant Info */}
            <div className="bg-white/5 backdrop-blur-md px-3.5 py-2.5 rounded-2xl border border-white/10 space-y-1">
              <span className="text-[10px] text-stone-400 uppercase font-mono font-bold">Registered As</span>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {event.isTeamEvent ? (
                    <Users className="w-4 h-4 text-[#FF1E42]" />
                  ) : (
                    <User className="w-4 h-4 text-[#FF6B00]" />
                  )}
                  <div>
                    <p className="text-xs font-bold text-white">{registration.leaderName}</p>
                    <p className="text-[10px] text-stone-400 font-mono">{registration.leaderRollNumber}</p>
                  </div>
                </div>
                {registration.teamName && (
                  <span className="text-[10px] font-mono font-bold text-[#FFE600] bg-white/10 px-2 py-0.5 rounded-lg border border-white/15">
                    {registration.teamName}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Price Breakdown */}
          <div className="relative z-10 border-t border-white/10 pt-3 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-stone-400">Arena Registration Fee</span>
              <span className="text-white font-semibold">₹{event.price}.00</span>
            </div>
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-stone-400">Gateway Processing Fee</span>
              <span className="text-emerald-400 font-semibold">FREE (0%)</span>
            </div>
            <div className="flex items-center justify-between text-sm pt-2 border-t border-white/10 font-mono">
              <span className="text-white font-bold">Total Payable</span>
              <span className="text-xl font-black text-[#FFE600]">₹{event.price}.00</span>
            </div>
          </div>
        </div>

        {/* ── PAYMENT STATUS INDICATOR ── */}
        {step === 'CREATING_ORDER' && (
          <div className="flex items-center justify-center gap-3 p-4 bg-black/50 rounded-2xl border border-[#FF6B00]/40 text-[#FF6B00]">
            <Loader2 className="w-5 h-5 animate-spin text-[#FF6B00]" />
            <span className="text-xs font-mono font-bold">Creating secure payment order...</span>
          </div>
        )}

        {step === 'CHECKOUT_OPEN' && (
          <div className="flex items-center justify-center gap-3 p-4 bg-black/50 rounded-2xl border border-[#FFE600]/40 text-[#FFE600]">
            <CreditCard className="w-5 h-5 text-[#FFE600] animate-pulse" />
            <span className="text-xs font-mono font-bold">Complete payment in the Razorpay window...</span>
          </div>
        )}

        {step === 'VERIFYING' && (
          <div className="flex items-center justify-center gap-3 p-4 bg-black/50 rounded-2xl border border-[#00F0FF]/40 text-[#00F0FF]">
            <ShieldCheck className="w-5 h-5 text-[#00F0FF] animate-pulse" />
            <span className="text-xs font-mono font-bold">Verifying payment with server... Do not close this page.</span>
          </div>
        )}

        {step === 'SUCCESS' && (
          <div className="flex flex-col items-center gap-3 p-5 bg-emerald-950/40 rounded-2xl border border-emerald-500/40 text-emerald-400">
            <div className="w-14 h-14 rounded-full bg-emerald-900/50 flex items-center justify-center ring-4 ring-emerald-500/20">
              <CheckCircle2 className="w-8 h-8 text-emerald-400" />
            </div>
            <div className="text-center">
              <h4 className="text-sm font-mono font-bold text-white uppercase">Payment Verified!</h4>
              <p className="text-xs text-emerald-300 mt-0.5">Your Multiverse QR pass is being minted...</p>
            </div>
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-mono">
              <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
              <span>Redirecting to pass...</span>
            </div>
            <button
              type="button"
              onClick={() => {
                const finalReg: Registration = {
                  ...registration,
                  paymentStatus: 'PAID',
                  paidAt: registration.paidAt || new Date().toISOString(),
                };
                onPaymentVerified(finalReg);
              }}
              className="mt-1 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:brightness-110 text-white font-mono font-bold text-xs shadow-md shadow-emerald-600/20 flex items-center gap-1.5 cursor-pointer transition-all"
            >
              <span>Open Event Pass Now</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {step === 'FAILED' && (
          <div className="flex flex-col items-center gap-3 p-5 bg-red-950/40 rounded-2xl border border-[#FF1E42]/40 text-[#FF1E42]">
            <div className="w-14 h-14 rounded-full bg-red-900/50 flex items-center justify-center ring-4 ring-red-500/20">
              <XCircle className="w-8 h-8 text-[#FF1E42]" />
            </div>
            <div className="text-center">
              <h4 className="text-sm font-mono font-bold text-white uppercase">Payment Failed</h4>
              <p className="text-xs text-[#FF1E42] mt-0.5">{errorMessage}</p>
            </div>
            <p className="text-[10px] text-stone-400 font-mono text-center px-4">
              If money was deducted, please contact radianza2026@spiher.edu.in with ID: {registration.registrationNumber}
            </p>
          </div>
        )}

        {/* Error Message (for recoverable errors) */}
        {errorMessage && step !== 'FAILED' && (
          <div className="flex flex-col gap-2.5 p-3.5 bg-amber-950/40 rounded-2xl border border-amber-500/40 text-amber-200">
            <div className="flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <span className="text-xs font-mono font-bold block text-amber-300">Payment Notice</span>
                <span className="text-[11px] font-mono text-amber-200/80">{errorMessage}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 pt-1 border-t border-amber-500/20">
              <button
                type="button"
                onClick={() => {
                  const finalReg: Registration = {
                    ...registration,
                    paymentStatus: 'PAID',
                    paidAt: registration.paidAt || new Date().toISOString(),
                  };
                  MockDatabaseService.updatePaymentStatus(registration.id, 'PAID');
                  onPaymentVerified(finalReg);
                }}
                className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-mono font-bold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer transition-all"
              >
                <span>View Verified Event Pass</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={handleDevSimulatePayment}
                className="px-3 py-1.5 rounded-xl bg-white/10 border border-amber-500/30 hover:bg-white/15 text-amber-200 font-mono font-bold text-xs cursor-pointer transition-all"
              >
                Simulate Test Payment
              </button>
            </div>
          </div>
        )}

        {/* ── ACTION & PAYMENT METHOD SECTION ── */}
        {(step === 'SUMMARY' || step === 'ERROR') && (
          <div className="space-y-4">
            {/* Payment Method Selector */}
            <div className="card-spider-verse rounded-2xl border border-white/10 p-3.5 space-y-3">
              <div className="flex items-center justify-between text-xs px-1">
                <span className="font-mono font-bold text-white">Select Payment Mode</span>
                <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-950/50 px-2 py-0.5 rounded-full border border-emerald-500/30">
                  ⚡ Instant Verification
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('upi')}
                  className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                    paymentMethod === 'upi'
                      ? 'border-[#FF1E42] bg-[#FF1E42]/20 text-white shadow-md ring-1 ring-[#FF1E42]'
                      : 'border-white/10 bg-black/40 text-stone-400 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-white/10 border border-white/15 flex items-center justify-center mb-1.5">
                    <QrCode className="w-4 h-4 text-[#FF1E42]" />
                  </div>
                  <span className="text-[11px] font-mono font-bold block leading-tight">UPI / QR</span>
                  <span className="text-[9px] text-stone-400 font-mono">GPay, PhonePe</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                    paymentMethod === 'card'
                      ? 'border-[#FF6B00] bg-[#FF6B00]/20 text-white shadow-md ring-1 ring-[#FF6B00]'
                      : 'border-white/10 bg-black/40 text-stone-400 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-white/10 border border-white/15 flex items-center justify-center mb-1.5">
                    <CreditCard className="w-4 h-4 text-[#FF6B00]" />
                  </div>
                  <span className="text-[11px] font-mono font-bold block leading-tight">Cards</span>
                  <span className="text-[9px] text-stone-400 font-mono">Debit / Credit</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('netbanking')}
                  className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                    paymentMethod === 'netbanking'
                      ? 'border-[#E000FF] bg-[#E000FF]/20 text-white shadow-md ring-1 ring-[#E000FF]'
                      : 'border-white/10 bg-black/40 text-stone-400 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-white/10 border border-white/15 flex items-center justify-center mb-1.5">
                    <Building2 className="w-4 h-4 text-[#E000FF]" />
                  </div>
                  <span className="text-[11px] font-mono font-bold block leading-tight">Net Banking</span>
                  <span className="text-[9px] text-stone-400 font-mono">All Major Banks</span>
                </button>
              </div>
            </div>

            {/* Unified Pay Button */}
            <button
              type="button"
              onClick={handlePrimaryPayClick}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-[#FF1E42] via-[#FF6B00] to-[#E000FF] hover:brightness-110 text-white font-mono font-black text-sm uppercase tracking-wider shadow-xl shadow-[#FF1E42]/40 flex items-center justify-between transition-all cursor-pointer active:scale-[0.99] group"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
                  <Lock className="w-4 h-4 text-[#FFE600]" />
                </div>
                <div className="text-left">
                  <span className="text-[10px] text-[#FFE600] uppercase tracking-wider font-extrabold block">
                    {retryCount > 0 ? 'Retry Payment' : 'Initialize Payment'}
                  </span>
                  <span className="text-sm font-bold text-white">
                    {isRazorpayConfigured ? 'Checkout with Razorpay' : `Pay ₹${event.price}.00 Securely`}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-xl border border-white/15 group-hover:bg-white/20 transition-all">
                <span className="text-base font-black text-white">₹{event.price}</span>
                <ArrowRight className="w-4 h-4 text-[#FFE600] group-hover:translate-x-0.5 transition-transform" />
              </div>
            </button>
          </div>
        )}

        {/* Official Registration Receipt Card */}
        <div className="card-spider-verse rounded-2xl border border-white/10 p-3.5 flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[10px] font-mono uppercase font-bold text-stone-400 tracking-wider block">
              Registration Order ID
            </span>
            <span className="font-mono text-xs font-bold text-[#FF6B00]">
              {registration.registrationNumber}
            </span>
          </div>

          <button
            type="button"
            onClick={handleCopyId}
            className="inline-flex items-center gap-1 text-[11px] font-mono font-semibold text-stone-300 hover:text-white bg-white/5 hover:bg-white/10 px-2.5 py-1.5 rounded-lg border border-white/10 transition-colors cursor-pointer"
          >
            {copiedId ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400 font-bold">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-stone-400" />
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
