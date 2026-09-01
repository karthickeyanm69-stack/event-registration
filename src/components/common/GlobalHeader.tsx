import React, { useState } from 'react';
import {
  ShieldAlert,
  UserCheck,
  Building2,
  Lock,
  LayoutDashboard,
  Menu,
  X,
  Sparkles,
  RefreshCw,
  QrCode,
} from 'lucide-react';
import { PortalRole, StaffUser } from '../../types';

interface GlobalHeaderProps {
  currentRole: PortalRole;
  onNavigate: (role: PortalRole) => void;
  currentStaffUser?: StaffUser | null;
  onStaffLogout?: () => void;
  onResetDatabase?: () => void;
}

export const GlobalHeader: React.FC<GlobalHeaderProps> = ({
  currentRole,
  onNavigate,
  currentStaffUser,
  onStaffLogout,
  onResetDatabase,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const roles: { id: PortalRole; label: string; icon: React.ComponentType<{ className?: string }>; badge: string }[] = [
    { id: 'participant', label: 'Participant', icon: UserCheck, badge: 'Public' },
    { id: 'employee', label: 'Staff / Judge', icon: QrCode, badge: 'Mobile PWA' },
    { id: 'admin', label: 'Admin', icon: Building2, badge: 'Event Ops' },
    { id: 'superadmin', label: 'Super Admin', icon: ShieldAlert, badge: 'Full Access' },
    { id: 'console', label: 'Staff Console', icon: Lock, badge: 'Login' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-primary/95 backdrop-blur-md border-b border-white/10 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & College Identity */}
          <div
            onClick={() => onNavigate('participant')}
            className="flex items-center gap-3 cursor-pointer select-none group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-secondary to-secondary-container flex items-center justify-center shadow-md shadow-secondary/30 group-hover:scale-105 transition-transform duration-200">
              <Sparkles className="w-5 h-5 text-primary font-bold" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif text-lg font-bold tracking-tight text-white">SPIHER</span>
                <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-secondary/20 text-secondary-fixed border border-secondary/40">
                  IGNITE 2024
                </span>
              </div>
              <p className="text-[11px] text-slate-300 font-medium hidden sm:block">
                National Level Technical & Non-Technical Symposium
              </p>
            </div>
          </div>

          {/* Desktop Role Quick Switcher Pills */}
          <nav className="hidden md:flex items-center gap-1.5 bg-primary-container/80 p-1 rounded-xl border border-white/10">
            {roles.map((item) => {
              const Icon = item.icon;
              const isActive = currentRole === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-secondary text-white shadow-md shadow-secondary/40 scale-[1.02]'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Actions: Staff Info / Reset / Mobile Toggle */}
          <div className="flex items-center gap-2">
            {currentStaffUser && (
              <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-xs text-slate-300">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="truncate max-w-[120px] font-medium">{currentStaffUser.name}</span>
                <button
                  onClick={onStaffLogout}
                  className="text-red-300 hover:text-red-200 text-[11px] underline ml-1"
                >
                  Sign Out
                </button>
              </div>
            )}

            {onResetDatabase && (
              <button
                onClick={() => {
                  if (window.confirm('Reset demo data to initial defaults?')) {
                    onResetDatabase();
                  }
                }}
                title="Reset database to initial state"
                className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs border border-white/10 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reset Demo</span>
              </button>
            )}

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 focus:outline-none"
              aria-label="Toggle Portal Navigation"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-primary-container border-b border-white/10 px-4 pt-3 pb-5 space-y-2 animate-in slide-in-from-top-2 duration-200">
          <div className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold px-2">
            Select Portal View
          </div>
          <div className="grid grid-cols-1 gap-1.5">
            {roles.map((item) => {
              const Icon = item.icon;
              const isActive = currentRole === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onNavigate(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`flex items-center justify-between w-full px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-secondary text-white shadow-sm'
                      : 'text-slate-200 bg-white/5 hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                    isActive ? 'bg-white/20 text-white' : 'bg-black/30 text-slate-400'
                  }`}>
                    {item.badge}
                  </span>
                </button>
              );
            })}
          </div>

          {currentStaffUser && (
            <div className="pt-3 border-t border-white/10 flex items-center justify-between px-2">
              <span className="text-xs text-slate-300">Signed in as {currentStaffUser.name}</span>
              <button
                onClick={() => {
                  onStaffLogout?.();
                  setIsMobileMenuOpen(false);
                }}
                className="text-xs text-red-300 hover:text-red-200 font-semibold"
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
