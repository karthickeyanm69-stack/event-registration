import React, { useState } from 'react';
import {
  Lock,
  Mail,
  Key,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  UserCheck,
  AlertCircle,
  Building2,
  QrCode,
  ShieldAlert,
} from 'lucide-react';
import { MockDatabaseService } from '../../data/mockDatabase';
import { supabase } from '../../lib/supabaseClient';
import { PortalRole, StaffUser } from '../../types';
import { CollegeLogo } from '../common/CollegeLogo';

interface StaffConsoleLoginProps {
  onLoginSuccess: (user: StaffUser, redirectRole: PortalRole) => void;
  redirectNotice?: string | null;
}

export const StaffConsoleLogin: React.FC<StaffConsoleLoginProps> = ({
  onLoginSuccess,
  redirectNotice,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const staffPresets = [
    {
      label: 'Super Admin (Dr. Senthil Nathan)',
      email: 'superadmin@spiher.edu.in',
      passwordPreset: 'superadmin123',
      role: 'SUPER_ADMIN',
      target: 'superadmin' as PortalRole,
      badge: 'Convenor',
      icon: ShieldAlert,
    },
    {
      label: 'Event Admin (All 11 Events)',
      email: 'admin@spiher.edu.in',
      passwordPreset: 'admin123',
      role: 'ADMIN',
      target: 'admin' as PortalRole,
      badge: 'All Events Admin',
      icon: Building2,
    },
    {
      label: 'Staff Evaluator (Code-A-Thon Lead)',
      email: 'employee@spiher.edu.in',
      passwordPreset: 'staff123',
      role: 'EMPLOYEE',
      target: 'employee' as PortalRole,
      badge: 'PWA Scanner',
      icon: QrCode,
    },
  ];

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    if (!cleanEmail || !cleanPassword) {
      setErrorMessage('Please provide your staff email and password.');
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Try Live Supabase Authentication
      if (supabase) {
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password: cleanPassword,
        });

        if (authData && authData.user) {
          // Fetch corresponding staff user record
          const { data: staffRow } = await supabase
            .from('staff_users')
            .select('*')
            .eq('email', cleanEmail)
            .maybeSingle();

          const staffRole = staffRow?.role || authData.user.user_metadata?.role || 'EMPLOYEE';
          const staffUser: StaffUser = {
            id: staffRow?.id || authData.user.id,
            email: cleanEmail,
            name: staffRow?.name || authData.user.user_metadata?.name || cleanEmail.split('@')[0],
            role: staffRole,
            department: staffRow?.department || authData.user.user_metadata?.department || 'Department',
            assignedEventIds: staffRow?.assigned_event_ids || [],
            isActive: true,
          };

          let targetRole: PortalRole = 'employee';
          if (staffRole === 'SUPER_ADMIN') targetRole = 'superadmin';
          else if (staffRole === 'ADMIN') targetRole = 'admin';

          setIsSubmitting(false);
          onLoginSuccess(staffUser, targetRole);
          return;
        }
      }

      // 2. Fallback / Local Database Authentication
      const res = MockDatabaseService.authenticateStaff(cleanEmail, cleanPassword);
      setIsSubmitting(false);

      if (res.success && res.user) {
        let targetRole: PortalRole = 'employee';
        if (res.user.role === 'SUPER_ADMIN') targetRole = 'superadmin';
        else if (res.user.role === 'ADMIN') targetRole = 'admin';

        onLoginSuccess(res.user, targetRole);
      } else {
        setErrorMessage(res.error || 'Invalid staff email or password.');
      }
    } catch (err: any) {
      setIsSubmitting(false);
      // Fallback
      const res = MockDatabaseService.authenticateStaff(cleanEmail, cleanPassword);
      if (res.success && res.user) {
        let targetRole: PortalRole = 'employee';
        if (res.user.role === 'SUPER_ADMIN') targetRole = 'superadmin';
        else if (res.user.role === 'ADMIN') targetRole = 'admin';
        onLoginSuccess(res.user, targetRole);
      } else {
        setErrorMessage(err.message || 'Authentication error.');
      }
    }
  };

  const handleSelectPreset = (preset: typeof staffPresets[0]) => {
    setEmail(preset.email);
    setPassword(preset.passwordPreset);
    setErrorMessage(null);
  };

  return (
    <div className="w-full min-h-screen spiher-pattern-bg px-4 py-8 flex flex-col justify-center items-center">
      <div className="w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-[#d4e8f5] space-y-6">
        {/* Header with Official College Logo */}
        <div className="flex justify-center border-b border-[#e8f5fb] pb-5">
          <CollegeLogo size="md" />
        </div>

        <div className="text-center space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#e8f5fb] text-[#0077c8] border border-[#d4e8f5]">
            Staff Console Gateway
          </span>
          <h3 className="text-base font-bold text-[#002b66]">
            Authorized Staff Sign-In
          </h3>
          <p className="text-xs text-slate-500 max-w-xs mx-auto">
            Unified access portal for Super Admins, Event Admins, and Evaluator Staff.
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          {redirectNotice && !errorMessage && (
            <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-300 text-amber-900 text-xs font-semibold flex items-center gap-2.5 animate-in fade-in">
              <ShieldAlert className="w-4 h-4 shrink-0 text-amber-600" />
              <span>{redirectNotice}</span>
            </div>
          )}

          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium flex items-center gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div className="space-y-3">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#002b66] uppercase tracking-wider">
                Official Staff Email *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="staff@spiher.edu.in"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#d4e8f5] bg-slate-50 text-[#002b66] text-sm focus:border-[#0077c8] focus:bg-white focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#002b66] uppercase tracking-wider">
                Password *
              </label>
              <div className="relative">
                <Key className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#d4e8f5] bg-slate-50 text-[#002b66] text-sm focus:border-[#0077c8] focus:bg-white focus:outline-none"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 px-4 rounded-xl bg-[#0077c8] hover:bg-[#0066ad] text-white font-bold text-sm shadow-lg shadow-[#0077c8]/25 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>Sign In to Console</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Quick Staff Presets for Instant Demo */}
        <div className="pt-2 border-t border-[#e8f5fb] space-y-2">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block text-center">
            One-Click Role Authentication
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {staffPresets.map((preset) => {
              const Icon = preset.icon;
              return (
                <button
                  key={preset.email}
                  type="button"
                  onClick={() => handleSelectPreset(preset)}
                  className="p-2.5 rounded-xl border border-[#d4e8f5] bg-[#f8fafc] hover:bg-[#e8f5fb] text-left transition-colors flex items-center justify-between text-xs group"
                >
                  <div className="flex items-center gap-2 overflow-hidden">
                    <Icon className="w-4 h-4 text-[#0077c8] shrink-0" />
                    <div className="truncate">
                      <p className="font-bold text-[#002b66] truncate">{preset.label.split('(')[0]}</p>
                      <p className="text-[10px] text-slate-500 font-mono truncate">{preset.email}</p>
                    </div>
                  </div>
                  <span className="text-[9px] font-bold text-[#0077c8] bg-white px-1.5 py-0.5 rounded shadow-sm border border-[#d4e8f5] shrink-0 ml-1">
                    {preset.badge}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
