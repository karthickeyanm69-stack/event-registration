import React, { useState } from 'react';
import {
  QrCode,
  Users,
  Trophy,
  CheckCircle2,
  Clock,
  DownloadCloud,
  LogOut,
  Sparkles,
  Shield,
  Layers,
  HelpCircle,
  Camera,
  Activity,
  Award,
} from 'lucide-react';
import {
  AttendanceRecord,
  CollegeEvent,
  Registration,
  ScoreRecord,
  StaffUser,
} from '../../types';
import { QRVerificationScanner } from './QRVerificationScanner';
import { EmployeeAttendanceRoster } from './EmployeeAttendanceRoster';
import { EmployeeScoreManagement } from './EmployeeScoreManagement';
import { CollegeLogo, CollegeEmblem } from '../common/CollegeLogo';

interface EmployeeDashboardProps {
  staffUser: StaffUser;
  events: CollegeEvent[];
  registrations: Registration[];
  attendanceList: AttendanceRecord[];
  scores: ScoreRecord[];
  onStaffLogout: () => void;
  onRefreshData: () => void;
}

export type EmployeeTab = 'scanner' | 'attendance' | 'scoring';

export const EmployeeDashboard: React.FC<EmployeeDashboardProps> = ({
  staffUser,
  events,
  registrations,
  attendanceList,
  scores,
  onStaffLogout,
  onRefreshData,
}) => {
  const [activeTab, setActiveTab] = useState<EmployeeTab>('scanner');

  // Filter registrations for this staff user's assigned events
  const assignedRegistrations = registrations.filter((r) =>
    staffUser.assignedEventIds.length === 0 || staffUser.assignedEventIds.includes(r.eventId)
  );

  const totalAssigned = assignedRegistrations.length;
  const presentCount = attendanceList.filter((a) =>
    assignedRegistrations.some((r) => r.id === a.registrationId && a.status === 'PRESENT')
  ).length;
  const scoredCount = scores.filter((s) =>
    assignedRegistrations.some((r) => r.id === s.registrationId)
  ).length;

  const assignedEvents = events.filter((e) =>
    staffUser.assignedEventIds.length === 0 || staffUser.assignedEventIds.includes(e.id)
  );

  const navItems: {
    id: EmployeeTab;
    label: string;
    shortLabel: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string;
  }[] = [
    {
      id: 'scanner',
      label: 'QR Scanner Viewfinder',
      shortLabel: 'QR Scanner',
      icon: Camera,
      badge: 'Live',
    },
    {
      id: 'attendance',
      label: `Attendance Checklist (${presentCount}/${totalAssigned})`,
      shortLabel: `Attendance (${presentCount}/${totalAssigned})`,
      icon: Users,
    },
    {
      id: 'scoring',
      label: `Evaluation & Scoring (${scoredCount})`,
      shortLabel: `Scoring (${scoredCount})`,
      icon: Trophy,
      badge: `${scoredCount} Done`,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Top Header with Official College Branding */}
      <header className="h-16 bg-white border-b border-[#d4e8f5] px-4 sm:px-6 flex items-center justify-between sticky top-0 z-40 shadow-xs">
        <div className="flex items-center gap-3">
          <CollegeLogo variant="compact" size="sm" showSubtitle={false} />
          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#e8f5fb] text-[#0077c8] border border-[#d4e8f5] uppercase tracking-wider hidden sm:inline-block">
            Staff &amp; Judge Portal
          </span>
        </div>

        {/* Center Live Pill for Desktop */}
        <div className="hidden lg:flex items-center gap-3.5 bg-slate-100/90 px-4 py-1.5 rounded-full border border-slate-200 text-xs">
          <span className="text-slate-700 font-semibold">{totalAssigned} Assigned</span>
          <span className="text-slate-300">|</span>
          <span className="text-emerald-700 font-bold">{presentCount} Verified</span>
          <span className="text-slate-300">|</span>
          <span className="text-amber-700 font-bold">{scoredCount} Scored</span>
        </div>

        {/* Right User Status & Sign Out */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden sm:block text-right">
            <p className="text-xs font-bold text-[#002b66] leading-tight truncate max-w-[140px]">{staffUser.name}</p>
            <p className="text-[10px] text-slate-400 font-mono">{staffUser.role}</p>
          </div>

          <button
            onClick={onStaffLogout}
            title="Sign Out"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-semibold transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </header>

      {/* Mobile Top Segmented Tab Navigation Bar (Under Header) */}
      <div className="md:hidden bg-white border-b border-[#d4e8f5] px-3 py-2 sticky top-16 z-30 shadow-xs">
        <div className="grid grid-cols-3 gap-1.5 p-1 bg-[#f0f8fc] rounded-2xl border border-[#d4e8f5]">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id)}
                className={`flex flex-col sm:flex-row items-center justify-center gap-1 py-2 px-1 rounded-xl text-[11px] font-bold transition-all ${
                  isActive
                    ? 'bg-[#0077c8] text-white shadow-md'
                    : 'text-[#002b66] hover:bg-white/60'
                }`}
              >
                <Icon className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate text-center">{item.shortLabel}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Container: Column on Mobile, Row on Desktop */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Left Sidebar (Visible on Desktop md+) */}
        <aside className="w-64 bg-white border-r border-[#d4e8f5] flex-col justify-between p-4 shrink-0 hidden md:flex shadow-xs">
          <div className="space-y-3">
            <div className="px-3 py-1 text-[10px] uppercase font-bold tracking-widest text-[#0077c8]">
              Staff Operations
            </div>

            <nav className="space-y-1.5">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-semibold transition-all duration-200 cursor-pointer ${
                      isActive
                        ? 'bg-[#0077c8] text-white font-bold shadow-md shadow-[#0077c8]/20'
                        : 'text-[#002b66] hover:bg-[#f0f8fc]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-[#0077c8]'}`} />
                      <span className="truncate">{item.label}</span>
                    </div>
                    {item.badge && (
                      <span
                        className={`text-[9px] px-2 py-0.5 rounded-full font-mono font-bold shrink-0 ${
                          isActive ? 'bg-white text-[#0077c8]' : 'bg-[#e8f5fb] text-[#0077c8]'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#f0f8fc] border border-[#d4e8f5] text-xs space-y-1.5">
            <p className="font-bold text-[#002b66]">Assigned Competitions:</p>
            <div className="space-y-1 pt-1 max-h-36 overflow-y-auto">
              {assignedEvents.map((e) => (
                <div key={e.id} className="text-[11px] text-slate-700 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0077c8] shrink-0" />
                  <span className="truncate">{e.title}</span>
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* Main Content Pane */}
        <main className="flex-1 bg-slate-50 overflow-y-auto p-3.5 sm:p-6 lg:p-8 space-y-5 sm:space-y-6">
          {/* Executive Stat Cards (Responsive Grid on Mobile & Desktop) */}
          <div className="grid grid-cols-3 gap-2.5 sm:gap-4 max-w-5xl mx-auto">
            <div className="bg-white border border-[#d4e8f5] rounded-2xl p-3 sm:p-5 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider truncate">
                  Assigned
                </span>
                <div className="p-1.5 sm:p-2 rounded-xl bg-[#e8f5fb] text-[#0077c8] hidden sm:block">
                  <Users className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-2 sm:mt-4">
                <span className="text-xl sm:text-3xl font-bold font-mono text-[#002b66]">{totalAssigned}</span>
                <p className="text-[10px] sm:text-[11px] text-slate-500 mt-0.5 truncate hidden sm:block">
                  Total candidates
                </p>
              </div>
            </div>

            <div className="bg-white border border-[#d4e8f5] rounded-2xl p-3 sm:p-5 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider truncate">
                  Present
                </span>
                <div className="p-1.5 sm:p-2 rounded-xl bg-emerald-50 text-emerald-700 hidden sm:block">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-2 sm:mt-4">
                <span className="text-xl sm:text-3xl font-bold font-mono text-emerald-600">{presentCount}</span>
                <p className="text-[10px] sm:text-[11px] text-slate-500 mt-0.5 truncate hidden sm:block">
                  Verified check-in
                </p>
              </div>
            </div>

            <div className="bg-white border border-[#d4e8f5] rounded-2xl p-3 sm:p-5 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider truncate">
                  Scored
                </span>
                <div className="p-1.5 sm:p-2 rounded-xl bg-amber-50 text-amber-700 hidden sm:block">
                  <Trophy className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-2 sm:mt-4">
                <span className="text-xl sm:text-3xl font-bold font-mono text-amber-600">{scoredCount}</span>
                <p className="text-[10px] sm:text-[11px] text-slate-500 mt-0.5 truncate hidden sm:block">
                  Evaluations done
                </p>
              </div>
            </div>
          </div>

          {/* Operational View Tab Routing */}
          <div className="max-w-5xl mx-auto">
            {activeTab === 'scanner' && (
              <QRVerificationScanner
                staffUser={staffUser}
                onAttendanceRecorded={(reg) => {
                  onRefreshData();
                }}
              />
            )}

            {activeTab === 'attendance' && (
              <EmployeeAttendanceRoster
                staffUser={staffUser}
                registrations={assignedRegistrations}
                attendanceList={attendanceList}
                events={events}
                onRefresh={onRefreshData}
              />
            )}

            {activeTab === 'scoring' && (
              <EmployeeScoreManagement
                staffUser={staffUser}
                events={events}
                registrations={assignedRegistrations}
                attendanceList={attendanceList}
                scores={scores}
                onRefresh={onRefreshData}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
