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
import { PortalRole, StaffUser } from '../../types';

interface StaffConsoleLoginProps {
  onLoginSuccess: (user: StaffUser, redirectRole: PortalRole) => void;
}

export const StaffConsoleLogin: React.FC<StaffConsoleLoginProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const staffPresets = [
    {
      label: 'Super Admin (Dr. Sivasankaran)',
      email: 'superadmin@spiher.edu.in',
      role: 'SUPER_ADMIN',
      target: 'superadmin' as PortalRole,
      badge: 'Full Access',
      icon: ShieldAlert,
    },
    {
      label: 'Admin (Technical Events)',
      email: 'admin.tech@spiher.edu.in',
      role: 'ADMIN',
      target: 'admin' as PortalRole,
      badge: 'Tech Admin',
      icon: Building2,
    },
    {
      label: 'Admin (Non-Technical Events)',
      email: 'admin.nontech@spiher.edu.in',
      role: 'ADMIN',
      target: 'admin' as PortalRole,
      badge: 'Non-Tech Admin',
      icon: Building2,
    },
    {
      label: 'Staff Evaluator (Code-A-Thon)',
      email: 'judge.codeathon@spiher.edu.in',
      role: 'EMPLOYEE',
      target: 'employee' as PortalRole,
      badge: 'PWA Scanner',
      icon: QrCode,
    },
  ];

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim() || !password.trim()) {
      setErrorMessage('Please provide your staff email and password.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const res = MockDatabaseService.authenticateStaff(email);
      setIsSubmitting(false);

      if (res.success && res.user) {
        let targetRole: PortalRole = 'employee';
        if (res.user.role === 'SUPER_ADMIN') targetRole = 'superadmin';
        else if (res.user.role === 'ADMIN') targetRole = 'admin';

        onLoginSuccess(res.user, targetRole);
      } else {
        setErrorMessage(res.error || 'Authentication failed.');
      }
    }, 500);
  };

  const handleSelectPreset = (presetEmail: string) => {
    setEmail(presetEmail);
    setPassword('••••••••••••');
    setErrorMessage(null);
  };

  return (
    <div className="w-full max-w-md mx-auto px-4 py-8 flex flex-col justify-center min-h-[calc(100vh-4rem)]">
      {/* Header */}
      <div className="text-center mb-6 space-y-2">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-primary to-primary-container text-white shadow-xl border border-white/20 mb-2">
          <Lock className="w-7 h-7 text-secondary-fixed" />
        </div>
        <h2 className="text-2xl font-serif font-bold text-primary dark:text-white">
          Shared Staff Console
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
          Unified authentication gateway for Employees, Event Admins, and Super Administrators.
        </p>
      </div>

      {/* Login Card */}
      <div className="bg-white dark:bg-primary-container rounded-3xl p-6 sm:p-7 border border-slate-200/80 dark:border-white/10 shadow-xl space-y-5">
        <div className="space-y-1">
          <h3 className="text-base font-bold text-primary dark:text-white flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-secondary" />
            <span>Staff Authentication</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Role-based redirection enforces event-level access upon successful sign-in.
          </p>
        </div>

        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/50 text-red-800 dark:text-red-300 text-xs font-medium flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-secondary" />
              <span>Official Institutional Email</span>
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="staff@spiher.edu.in"
              className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-primary/60 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-secondary focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-secondary" />
              <span>Password</span>
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-primary/60 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-secondary focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-primary to-primary-container hover:from-primary-container hover:to-primary text-white font-bold text-sm shadow-lg shadow-primary/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Authenticating & Routing...</span>
              </>
            ) : (
              <>
                <span>Sign In to Console</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Rapid Testing Role Presets */}
        <div className="pt-3 border-t border-slate-100 dark:border-white/10 space-y-2">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
            Demo Staff Accounts (Click to Autofill)
          </span>
          <div className="grid grid-cols-1 gap-1.5">
            {staffPresets.map((p, idx) => {
              const Icon = p.icon;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectPreset(p.email)}
                  className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-white/5 hover:bg-secondary/10 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 text-left transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Icon className="w-3.5 h-3.5 text-secondary shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white">{p.label}</p>
                      <p className="text-[10px] text-slate-400 font-mono">{p.email}</p>
                    </div>
                  </div>
                  <span className="text-[9px] uppercase font-bold px-1.5 py-0.5 rounded bg-secondary/15 text-secondary border border-secondary/30">
                    {p.badge}
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
