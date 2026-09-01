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
import { EmployeeStateShowcase } from './EmployeeStateShowcase';

interface EmployeeDashboardProps {
  staffUser: StaffUser;
  events: CollegeEvent[];
  registrations: Registration[];
  attendanceList: AttendanceRecord[];
  scores: ScoreRecord[];
  onStaffLogout: () => void;
  onRefreshData: () => void;
}

export type EmployeeTab = 'scanner' | 'attendance' | 'scoring' | 'states';

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

  const navItems: { id: EmployeeTab; label: string; icon: React.ComponentType<{ className?: string }>; badge?: string }[] = [
    { id: 'scanner', label: 'QR Scanner Viewfinder', icon: Camera, badge: 'Live' },
    { id: 'attendance', label: `Attendance Checklist (${presentCount}/${totalAssigned})`, icon: Users },
    { id: 'scoring', label: 'Evaluation & Scoring', icon: Trophy, badge: `${scoredCount} Done` },
    { id: 'states', label: 'Staff Edge States', icon: HelpCircle },
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">
      {/* Top Header */}
      <header className="h-16 bg-slate-950 border-b border-slate-800 px-6 flex items-center justify-between sticky top-0 z-40 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-500 to-emerald-400 flex items-center justify-center text-slate-950 font-bold shadow-lg shadow-teal-500/20">
            <QrCode className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif font-bold text-base text-white tracking-tight">SPIHER</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 border border-teal-500/30 uppercase tracking-wider">
                Staff & Judge PWA
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
              {staffUser.name} • Assigned: {assignedEvents.map((e) => e.title).join(', ') || 'Assigned Events'}
            </p>
          </div>
        </div>

        {/* Center Live Pill */}
        <div className="hidden lg:flex items-center gap-4 bg-slate-900/80 px-4 py-1.5 rounded-full border border-slate-800 text-xs">
          <span className="text-slate-300 font-semibold">{totalAssigned} Assigned Participants</span>
          <span className="text-slate-600">|</span>
          <span className="text-emerald-400 font-bold">{presentCount} Verified</span>
          <span className="text-slate-600">|</span>
          <span className="text-amber-400 font-bold">{scoredCount} Scored</span>
        </div>

        {/* Right User Logout */}
        <div className="flex items-center gap-3">
          <button
            onClick={onStaffLogout}
            title="Sign Out"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-xs font-semibold transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </header>

      {/* Desktop Main Container with Left Sidebar */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <aside className="w-64 bg-slate-950 border-r border-slate-800 flex flex-col justify-between p-4 shrink-0 hidden md:flex">
          <div className="space-y-1">
            <div className="px-3 py-2 text-[10px] uppercase font-bold tracking-widest text-slate-400">
              Staff Operations
            </div>

            <nav className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                      isActive
                        ? 'bg-gradient-to-r from-teal-500 to-emerald-500 text-slate-950 font-bold shadow-lg shadow-teal-500/20'
                        : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-slate-950' : 'text-slate-400'}`} />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ${
                          isActive ? 'bg-slate-950 text-teal-300' : 'bg-slate-800 text-slate-400'
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

          <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-xs space-y-1">
            <p className="font-bold text-teal-400">Assigned Competitions:</p>
            <div className="space-y-1 pt-1">
              {assignedEvents.map((e) => (
                <div key={e.id} className="text-[11px] text-slate-300 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
                  <span className="truncate">{e.title}</span>
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* Mobile Horizontal Tabs */}
        <div className="md:hidden w-full overflow-x-auto bg-slate-950 border-b border-slate-800 p-2 flex gap-1.5 scrollbar-hide">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                  isActive ? 'bg-teal-500 text-slate-950' : 'text-slate-300 bg-slate-900'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Main Content Pane */}
        <main className="flex-1 bg-slate-900 overflow-y-auto p-6 lg:p-8 space-y-6">
          {/* Executive Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-5xl mx-auto">
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Assigned</span>
                <div className="p-2 rounded-xl bg-teal-500/10 text-teal-400">
                  <Users className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-3xl font-bold font-mono text-white">{totalAssigned}</span>
                <p className="text-[11px] text-slate-400 mt-1">Participants to evaluate</p>
              </div>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Checked In</span>
                <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-3xl font-bold font-mono text-emerald-400">{presentCount}</span>
                <p className="text-[11px] text-slate-400 mt-1">{totalAssigned - presentCount} pending verification</p>
              </div>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Evaluated & Scored</span>
                <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
                  <Trophy className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-3xl font-bold font-mono text-amber-300">{scoredCount}</span>
                <p className="text-[11px] text-slate-400 mt-1">Scores submitted & locked</p>
              </div>
            </div>
          </div>

          <div className="max-w-5xl mx-auto">
            {activeTab === 'scanner' && (
              <QRVerificationScanner
                staffUser={staffUser}
                onAttendanceRecorded={onRefreshData}
              />
            )}

            {activeTab === 'attendance' && (
              <EmployeeAttendanceRoster
                staffUser={staffUser}
                registrations={registrations}
                attendanceList={attendanceList}
                onAttendanceChanged={onRefreshData}
              />
            )}

            {activeTab === 'scoring' && (
              <EmployeeScoreManagement
                staffUser={staffUser}
                registrations={registrations}
                scores={scores}
                onScoresUpdated={onRefreshData}
              />
            )}

            {activeTab === 'states' && <EmployeeStateShowcase />}
          </div>
        </main>
      </div>
    </div>
  );
};
