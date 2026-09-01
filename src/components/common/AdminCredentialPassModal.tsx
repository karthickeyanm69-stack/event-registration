import React, { useState } from 'react';
import {
  ShieldCheck,
  Key,
  Mail,
  Copy,
  Check,
  Layers,
  ExternalLink,
  Download,
  Building2,
  Lock,
  Eye,
  EyeOff,
  Sparkles,
  X,
  Printer,
} from 'lucide-react';
import { CollegeEvent, StaffUser } from '../../types';
import { CollegeLogo, CollegeEmblem } from './CollegeLogo';

interface AdminCredentialPassModalProps {
  user: StaffUser;
  events: CollegeEvent[];
  onClose: () => void;
}

export const AdminCredentialPassModal: React.FC<AdminCredentialPassModalProps> = ({
  user,
  events,
  onClose,
}) => {
  const [showPassword, setShowPassword] = useState(true);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const assignedEventsList =
    user.assignedEventIds.length === 0
      ? events
      : events.filter((e) => user.assignedEventIds.includes(e.id));

  const portalUrl = `${window.location.origin}${window.location.pathname}?role=console`;

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleCopyFullSlip = () => {
    const slip = `=====================================================
ST. PETER'S INSTITUTE OF HIGHER EDUCATION & RESEARCH
IGNITE 2024 — OFFICIAL STAFF / ADMIN CREDENTIAL PASS
=====================================================
Name: ${user.name}
Role: ${user.role === 'SUPER_ADMIN' ? 'Super Administrator' : user.role === 'ADMIN' ? 'Event Administrator' : 'Staff Evaluator / Judge'}
Department: ${user.department || 'Academic Department'}

--- LOGIN CREDENTIALS ---
Portal URL: ${portalUrl}
Login Email: ${user.email}
Password: ${user.password || 'admin123'}

--- PERMITTED COMPETITIONS ---
${user.assignedEventIds.length === 0 ? '• All 11 Technical & Non-Technical Competitions' : assignedEventsList.map((e) => `• ${e.title} (${e.category})`).join('\n')}

Please keep this credential pass confidential.
=====================================================`;

    navigator.clipboard.writeText(slip);
    setCopiedField('fullSlip');
    setTimeout(() => setCopiedField(null), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white text-slate-900 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-[#d4e8f5] space-y-6 relative max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Institution Logo Lockup */}
        <div className="flex justify-center border-b border-[#e8f5fb] pb-4">
          <CollegeLogo variant="compact" size="md" />
        </div>

        {/* Badge & Title */}
        <div className="text-center space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Official Admin Access Pass Issued</span>
          </div>
          <h3 className="text-xl font-bold text-[#002b66]">
            {user.name}
          </h3>
          <p className="text-xs text-slate-500 font-medium">
            {user.role === 'ADMIN' ? 'Event Administrator' : user.role === 'SUPER_ADMIN' ? 'Super Administrator' : 'Staff Evaluator'} • {user.department}
          </p>
        </div>

        {/* Credentials Card (Pass Style) */}
        <div className="p-5 rounded-2xl bg-[#f8fafc] border border-[#d4e8f5] space-y-4 shadow-inner">
          <div className="flex items-center justify-between border-b border-[#e8f5fb] pb-3">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              Dashboard Login Credentials
            </span>
            <span className="text-[10px] font-mono font-bold text-[#0077c8] bg-[#e8f5fb] px-2 py-0.5 rounded border border-[#d4e8f5]">
              ACTIVE
            </span>
          </div>

          {/* Email Row */}
          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold text-slate-500 block">
              Official Email ID
            </label>
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-[#d4e8f5] text-xs">
              <div className="flex items-center gap-2 font-mono text-[#002b66] font-bold truncate">
                <Mail className="w-4 h-4 text-[#0077c8] shrink-0" />
                <span className="truncate">{user.email}</span>
              </div>
              <button
                type="button"
                onClick={() => handleCopy(user.email, 'email')}
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-[#0077c8] transition-colors shrink-0"
                title="Copy Email"
              >
                {copiedField === 'email' ? (
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          </div>

          {/* Password Row */}
          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold text-slate-500 block">
              Access Password Pass
            </label>
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-[#d4e8f5] text-xs">
              <div className="flex items-center gap-2 font-mono text-[#002b66] font-bold">
                <Key className="w-4 h-4 text-[#00a887] shrink-0" />
                <span>{showPassword ? user.password || 'admin123' : '••••••••••••'}</span>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition-colors"
                  title={showPassword ? 'Hide Password' : 'Show Password'}
                >
                  {showPassword ? (
                    <EyeOff className="w-3.5 h-3.5" />
                  ) : (
                    <Eye className="w-3.5 h-3.5" />
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => handleCopy(user.password || 'admin123', 'pass')}
                  className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-[#0077c8] transition-colors"
                  title="Copy Password"
                >
                  {copiedField === 'pass' ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Permitted Events Summary */}
          <div className="space-y-1.5 pt-1">
            <div className="flex items-center justify-between text-[10px] uppercase font-bold text-slate-500">
              <span>Authorized Events ({user.assignedEventIds.length === 0 ? 'All 11 Events' : assignedEventsList.length})</span>
            </div>
            <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto p-1.5 bg-white rounded-xl border border-[#d4e8f5]">
              {user.assignedEventIds.length === 0 ? (
                <span className="text-[11px] font-bold text-[#0077c8] px-2 py-0.5 rounded bg-[#e8f5fb]">
                  Full Overseer Access to All 11 Competitions
                </span>
              ) : (
                assignedEventsList.map((evt) => (
                  <span
                    key={evt.id}
                    className="text-[10px] font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded"
                  >
                    {evt.title}
                  </span>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 pt-1">
          <button
            type="button"
            onClick={handleCopyFullSlip}
            className="w-full py-3 px-4 rounded-xl bg-[#0077c8] hover:bg-[#0066ad] text-white font-bold text-xs shadow-md shadow-[#0077c8]/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            {copiedField === 'fullSlip' ? (
              <>
                <Check className="w-4 h-4" />
                <span>Copied Full Credential Pass!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copy Full Credentials Slip for Admin</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
