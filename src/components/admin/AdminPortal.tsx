import React, { useState } from 'react';
import {
  Building2,
  Layers,
  Trophy,
  Users,
  CheckCircle2,
  Clock,
  Download,
  Plus,
  Search,
  Filter,
  ShieldCheck,
  Crown,
  MapPin,
  Mail,
  UserPlus,
  BookOpen,
  QrCode,
  FileSpreadsheet,
  LogOut,
  Sparkles,
  ChevronRight,
  RefreshCw,
  AlertTriangle,
  LayoutDashboard,
  Activity,
  Award,
  Key,
  CreditCard,
  IndianRupee,
} from 'lucide-react';
import {
  AttendanceRecord,
  CollegeEvent,
  EventCategory,
  Registration,
  ScoreRecord,
  StaffUser,
} from '../../types';
import { MockDatabaseService } from '../../data/mockDatabase';
import { CollegeLogo, CollegeEmblem } from '../common/CollegeLogo';
import { AdminCredentialPassModal } from '../common/AdminCredentialPassModal';

interface AdminPortalProps {
  adminUser: StaffUser;
  events: CollegeEvent[];
  registrations: Registration[];
  attendanceList: AttendanceRecord[];
  scores: ScoreRecord[];
  staffList: StaffUser[];
  onStaffLogout: () => void;
  onRefreshData: () => void;
}

export type AdminTab = 'events' | 'registrations' | 'attendance' | 'leaderboard' | 'employees' | 'exports';

export const AdminPortal: React.FC<AdminPortalProps> = ({
  adminUser,
  events,
  registrations,
  attendanceList,
  scores,
  staffList,
  onStaffLogout,
  onRefreshData,
}) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('events');

  // Filter events assigned to this Admin
  const assignedEvents = events.filter((e) =>
    adminUser.assignedEventIds.length === 0 || adminUser.assignedEventIds.includes(e.id)
  );

  const [selectedEventId, setSelectedEventId] = useState<string>(
    assignedEvents[0]?.id || ''
  );

  const selectedEvent = assignedEvents.find((e) => e.id === selectedEventId) || assignedEvents[0];

  // Filter registrations for assigned events
  const assignedRegistrations = registrations.filter((r) =>
    assignedEvents.some((e) => e.id === r.eventId)
  );

  // Appoint Employee State
  const [isAppointingEmployee, setIsAppointingEmployee] = useState(false);
  const [empName, setEmpName] = useState('');
  const [empEmail, setEmpEmail] = useState('');
  const [empPassword, setEmpPassword] = useState('Judge@SPIHER2024');
  const [empDept, setEmpDept] = useState(adminUser.department || 'Dept. of Information Technology');
  const [empEventId, setEmpEventId] = useState(assignedEvents[0]?.id || '');
  const [appointSuccess, setAppointSuccess] = useState<string | null>(null);
  const [selectedPassUser, setSelectedPassUser] = useState<StaffUser | null>(null);

  const handleGenerateEmpPassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    const rand = Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
    setEmpPassword(`EVAL#${rand}`);
  };

  // Search & Filters for Registrations Table
  const [regSearch, setRegSearch] = useState('');
  const [regFilterEvent, setRegFilterEvent] = useState<string>('ALL');
  const [regFilterPayment, setRegFilterPayment] = useState<string>('ALL');

  const filteredRegistrations = assignedRegistrations.filter((r) => {
    if (regFilterEvent !== 'ALL' && r.eventId !== regFilterEvent) return false;
    if (regFilterPayment !== 'ALL' && (r.paymentStatus || 'PENDING') !== regFilterPayment) return false;
    const term = regSearch.toLowerCase();
    return (
      r.leaderName.toLowerCase().includes(term) ||
      r.leaderRollNumber.toLowerCase().includes(term) ||
      (r.teamName && r.teamName.toLowerCase().includes(term)) ||
      r.registrationNumber.toLowerCase().includes(term) ||
      (r.paymentId && r.paymentId.toLowerCase().includes(term))
    );
  });

  const totalAssignedRevenue = assignedRegistrations
    .filter((r) => r.paymentStatus === 'PAID')
    .reduce((sum, r) => sum + (r.amountPaid || 0), 0);
  const paidCount = assignedRegistrations.filter((r) => r.paymentStatus === 'PAID').length;
  const pendingCount = assignedRegistrations.filter((r) => (r.paymentStatus || 'PENDING') === 'PENDING').length;
  const failedCount = assignedRegistrations.filter((r) => r.paymentStatus === 'FAILED').length;

  const handleManualMarkPaid = (reg: Registration) => {
    const fee = reg.amountPaid || 200;
    if (
      window.confirm(
        `Confirm manual cash collection of ₹${fee} for ${reg.leaderName} (${reg.registrationNumber})?\n\nThis will instantly mark their registration as PAID and authorize their QR entry pass.`
      )
    ) {
      const res = MockDatabaseService.updatePaymentStatus(reg.id, 'PAID', {
        paymentId: `cash_${Date.now()}`,
        paymentOrderId: `desk_${Date.now()}`,
        amountPaid: fee,
        paidAt: new Date().toISOString(),
      });
      if (res.success) {
        onRefreshData();
      } else {
        alert(res.error || 'Failed to update payment status.');
      }
    }
  };

  const presentCount = attendanceList.filter((a) =>
    assignedRegistrations.some((r) => r.id === a.registrationId && a.status === 'PRESENT')
  ).length;

  const handleAppointEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!empName.trim() || !empEmail.trim()) return;

    const newEmp: StaffUser = {
      id: `staff-emp-${Date.now()}`,
      email: empEmail.trim().toLowerCase(),
      name: empName.trim(),
      role: 'EMPLOYEE',
      password: empPassword.trim() || 'judge123',
      department: empDept,
      assignedEventIds: [empEventId],
      createdByAdminId: adminUser.id,
      isActive: true,
      mustChangePassword: true,
      lastLoginAt: undefined,
    };

    MockDatabaseService.saveStaffUser(newEmp);
    setAppointSuccess(`Staff credentials created for ${newEmp.name} (${newEmp.email})!`);
    setEmpName('');
    setEmpEmail('');
    setEmpPassword('Judge@SPIHER2024');
    setIsAppointingEmployee(false);
    setSelectedPassUser(newEmp);
    onRefreshData();
  };

  const handleExportCSV = (type: 'registrations' | 'attendance' | 'scores') => {
    let headers = '';
    let rows = '';

    if (type === 'registrations') {
      headers = 'Reg_ID,Event,Category,Leader_Name,Roll_No,Email,College,Dept,Team_Name,Payment_Status,Amount_Paid,Payment_ID,Gate_Status\n';
      rows = assignedRegistrations
        .map((r) => {
          const isPresent = attendanceList.some((a) => a.registrationId === r.id && a.status === 'PRESENT');
          return `"${r.registrationNumber}","${r.eventTitle}","${r.category}","${r.leaderName}","${r.leaderRollNumber}","${r.leaderEmail}","${r.collegeName}","${r.department}","${r.teamName || 'Solo'}","${r.paymentStatus || 'PENDING'}","${r.amountPaid || 0}","${r.paymentId || 'N/A'}","${isPresent ? 'PRESENT' : 'NOT_CHECKED_IN'}"`;
        })
        .join('\n');
    } else if (type === 'attendance') {
      headers = 'Reg_ID,Event,Participant,Roll_No,Team,Status,Scanned_At,Scanned_By\n';
      rows = attendanceList
        .filter((a) => assignedEvents.some((e) => e.id === a.eventId))
        .map(
          (a) =>
            `"${a.registrationId}","${a.eventId}","${a.participantName}","${a.participantRollNumber}","${a.teamName || 'Solo'}","${a.status}","${a.scannedAt || ''}","${a.scannedByStaffName || ''}"`
        )
        .join('\n');
    } else {
      headers = 'Rank,Event,Candidate/Team,Leader_Roll_No,Total_Score,Round,Feedback,Submitted_By\n';
      rows = scores
        .filter((s) => assignedEvents.some((e) => e.id === s.eventId))
        .sort((a, b) => b.totalScore - a.totalScore)
        .map(
          (s, idx) =>
            `"${idx + 1}","${s.eventId}","${s.teamOrParticipantName}","${s.rollNumberOrTeamId}","${s.totalScore}","${s.round}","${s.feedback || ''}","${s.submittedByStaffName}"`
        )
        .join('\n');
    }

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `SPIHER_${type.toUpperCase()}_EXPORT.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const appointedEmployees = staffList.filter(
    (s) => s.role === 'EMPLOYEE' && (s.createdByAdminId === adminUser.id || assignedEvents.some((e) => s.assignedEventIds.includes(e.id)))
  );

  const navItems: { id: AdminTab; label: string; icon: React.ComponentType<{ className?: string }>; count?: number }[] = [
    { id: 'events', label: 'Events', icon: Layers, count: assignedEvents.length },
    { id: 'registrations', label: 'Participants', icon: Users, count: assignedRegistrations.length },
    { id: 'attendance', label: 'Attendance', icon: CheckCircle2, count: presentCount },
    { id: 'leaderboard', label: 'Leaderboards', icon: Trophy },
    { id: 'employees', label: 'Staff', icon: UserPlus, count: appointedEmployees.length },
    { id: 'exports', label: 'Exports', icon: Download },
  ];

  return (
    <div className="h-screen w-full bg-[#f8fafc] text-slate-900 flex flex-col overflow-hidden font-sans">
      {/* Top Header */}
      <header className="h-14 shrink-0 bg-white border-b border-slate-200/80 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-40 shadow-xs">
        <div className="flex items-center gap-3">
          <CollegeLogo variant="compact" size="sm" showSubtitle={false} />
          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-[#e8f5fb] text-[#0077c8] border border-[#d4e8f5] uppercase tracking-wider hidden sm:inline-block">
            Admin Console
          </span>
        </div>

        {/* Center Telemetry Pill */}
        <div className="hidden lg:flex items-center gap-3 bg-slate-50 px-3.5 py-1 rounded-full border border-slate-200 text-xs shadow-2xs">
          <div className="flex items-center gap-1.5 font-medium text-slate-600">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>{assignedEvents.length} Active Events</span>
          </div>
          <span className="text-slate-300">|</span>
          <span className="text-[#0077c8] font-mono font-bold">{assignedRegistrations.length} Registrations</span>
          <span className="text-slate-300">|</span>
          <span className="text-emerald-700 font-bold">{presentCount} Present</span>
        </div>

        {/* Right User Bar */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-2.5 bg-slate-50 py-1 px-2.5 rounded-xl border border-slate-200/80">
            <div className="w-6 h-6 rounded-lg bg-[#0077c8]/10 text-[#0077c8] font-bold flex items-center justify-center text-xs">
              {adminUser.name.charAt(0)}
            </div>
            <div className="hidden sm:block text-left text-xs leading-tight">
              <p className="font-bold text-slate-900 text-[11px] truncate max-w-[140px]">{adminUser.name}</p>
              <p className="text-[9px] text-slate-400">Admin</p>
            </div>
          </div>

          <button
            onClick={onStaffLogout}
            title="Sign Out"
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 text-xs font-semibold transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline text-[11px]">Sign Out</span>
          </button>
        </div>
      </header>

      {/* Main Container with Left Sidebar on Desktop & Top Segmented Bar on Mobile */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden min-h-0">
        {/* Left Sidebar Navigation (Desktop - Stationary & Fixed) */}
        <aside className="w-56 bg-white border-r border-slate-200/80 flex flex-col justify-between p-3 shrink-0 hidden md:flex h-full overflow-y-auto">
          <div className="space-y-1">
            <div className="px-2.5 py-1.5 text-[9px] uppercase font-mono font-bold tracking-wider text-slate-400">
              Operations
            </div>

            <nav className="space-y-0.5">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-150 cursor-pointer ${
                      isActive
                        ? 'bg-gradient-to-r from-[#002b66] to-[#0077c8] text-white font-bold shadow-xs'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#7af1fc]' : 'text-slate-400'}`} />
                      <span>{item.label}</span>
                    </div>
                    {item.count !== undefined && (
                      <span
                        className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                          isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        {item.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-50/80 border border-slate-200/70 text-xs space-y-0.5">
            <div className="flex items-center gap-1.5 text-[#0077c8] font-bold text-[11px]">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>Event-Scoped</span>
            </div>
            <p className="text-[10px] text-slate-400 leading-tight">
              Assigned events only
            </p>
          </div>
        </aside>

        {/* Mobile Horizontal Bar */}
        <div className="md:hidden w-full overflow-x-auto bg-white border-b border-slate-200 p-1.5 flex gap-1.5 shrink-0 scrollbar-none sticky top-14 z-30">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-[#002b66] to-[#0077c8] text-white shadow-xs'
                    : 'text-slate-600 bg-slate-50 border border-slate-200/70 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-3 h-3 ${isActive ? 'text-[#7af1fc]' : 'text-slate-400'}`} />
                <span>{item.label}</span>
                {item.count !== undefined && (
                  <span
                    className={`text-[9px] px-1 py-0.2 rounded-full font-mono ${
                      isActive ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Main Content Area (Independently Scrollable) */}
        <main className="flex-1 h-full bg-[#f8fafc] overflow-y-auto p-4 sm:p-5 lg:p-6 space-y-4 min-w-0">
          {/* Executive Stat Cards - Sleek & Compact */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 max-w-7xl mx-auto">
            {/* 1. Events */}
            <div className="bg-white border border-slate-200/80 rounded-xl p-3.5 shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">Events</span>
                <div className="w-6 h-6 rounded-md bg-cyan-50 text-cyan-600 flex items-center justify-center">
                  <Layers className="w-3.5 h-3.5" />
                </div>
              </div>
              <div className="mt-2 flex items-baseline justify-between">
                <span className="text-xl font-bold font-mono text-slate-900">{assignedEvents.length}</span>
                <span className="text-[10px] text-slate-400 font-medium">Under governance</span>
              </div>
            </div>

            {/* 2. Registrations */}
            <div className="bg-white border border-slate-200/80 rounded-xl p-3.5 shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">Registrations</span>
                <div className="w-6 h-6 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Users className="w-3.5 h-3.5" />
                </div>
              </div>
              <div className="mt-2 flex items-baseline justify-between">
                <span className="text-xl font-bold font-mono text-cyan-700">{assignedRegistrations.length}</span>
                <span className="text-[10px] text-slate-400 font-medium">Registered candidates</span>
              </div>
            </div>

            {/* 3. Attendance */}
            <div className="bg-white border border-slate-200/80 rounded-xl p-3.5 shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">Attendance</span>
                <div className="w-6 h-6 rounded-md bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
              </div>
              <div className="mt-2 flex items-baseline justify-between">
                <span className="text-xl font-bold font-mono text-emerald-700">
                  {assignedRegistrations.length > 0
                    ? `${Math.round((presentCount / assignedRegistrations.length) * 100)}%`
                    : '0%'}
                </span>
                <span className="text-[10px] text-emerald-600 font-medium">{presentCount} present</span>
              </div>
            </div>

            {/* 4. Staff Appointed */}
            <div className="bg-white border border-slate-200/80 rounded-xl p-3.5 shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">Staff</span>
                <div className="w-6 h-6 rounded-md bg-amber-50 text-amber-600 flex items-center justify-center">
                  <UserPlus className="w-3.5 h-3.5" />
                </div>
              </div>
              <div className="mt-2 flex items-baseline justify-between">
                <span className="text-xl font-bold font-mono text-amber-700">{appointedEmployees.length}</span>
                <span className="text-[10px] text-slate-400 font-medium">Judges & Evaluators</span>
              </div>
            </div>
          </div>

          {appointSuccess && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 max-w-7xl mx-auto">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{appointSuccess}</span>
            </div>
          )}

          {/* TAB 1: ASSIGNED COMPETITIONS */}
          {activeTab === 'events' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
              {/* Event Picker List */}
              <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm space-y-3">
                <div className="pb-2 border-b border-slate-200">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Assigned Competitions ({assignedEvents.length})
                  </h3>
                </div>

                <div className="space-y-2">
                  {assignedEvents.map((evt) => (
                    <div
                      key={evt.id}
                      onClick={() => setSelectedEventId(evt.id)}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                        selectedEventId === evt.id
                          ? 'border-cyan-600 bg-cyan-50/70 shadow-sm'
                          : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-white text-slate-700 border border-slate-200">
                          {evt.category}
                        </span>
                        <div className="flex items-center gap-1.5 font-mono text-xs">
                          <span className="font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">₹{evt.price}</span>
                          <span className="text-slate-500 font-semibold">{evt.slotsLeft} slots</span>
                        </div>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 mt-1.5">{evt.title}</h4>
                      <p className="text-xs text-slate-500 mt-0.5">{evt.venue}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Selected Event Details View */}
              {selectedEvent && (
                <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-5">
                  <div className="flex items-start justify-between pb-4 border-b border-slate-200">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-cyan-700">
                        {selectedEvent.category} Competition
                      </span>
                      <h3 className="text-2xl font-bold text-slate-900 mt-0.5">{selectedEvent.title}</h3>
                      <p className="text-xs text-slate-500">{selectedEvent.tagline}</p>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] uppercase text-slate-500 block font-bold">Participation</span>
                      <span className="text-sm font-bold text-cyan-700 font-mono">
                        {selectedEvent.isTeamEvent ? `Team (${selectedEvent.minTeamSize}-${selectedEvent.maxTeamSize})` : 'Individual'}
                      </span>
                    </div>
                  </div>

                  {/* Metadata Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-0.5">
                      <span className="text-[10px] text-slate-500 uppercase">Format</span>
                      <p className="font-bold text-slate-900">
                        {selectedEvent.isTeamEvent ? `Team (${selectedEvent.minTeamSize}-${selectedEvent.maxTeamSize})` : 'Individual'}
                      </p>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 space-y-0.5 flex flex-col justify-between">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-amber-800 uppercase font-bold">Registration Fee</span>
                        <button
                          type="button"
                          onClick={() => {
                            const input = window.prompt(`Update registration fee for "${selectedEvent.title}" (in ₹):`, selectedEvent.price?.toString() || '100');
                            if (input !== null) {
                              const parsed = parseInt(input.trim());
                              if (!isNaN(parsed) && parsed > 0) {
                                MockDatabaseService.saveEvent({ ...selectedEvent, price: parsed });
                                onRefreshData();
                              } else {
                                alert('Please enter a valid amount greater than 0.');
                              }
                            }
                          }}
                          className="text-[10px] font-bold text-amber-700 hover:text-amber-900 underline cursor-pointer"
                        >
                          Edit
                        </button>
                      </div>
                      <p className="font-mono font-bold text-amber-900 text-sm">₹{selectedEvent.price}</p>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-0.5">
                      <span className="text-[10px] text-slate-500 uppercase">Venue</span>
                      <p className="font-bold text-slate-900 truncate">{selectedEvent.venue}</p>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-0.5">
                      <span className="text-[10px] text-slate-500 uppercase">Timing</span>
                      <p className="font-bold text-slate-900 truncate">{selectedEvent.time}</p>
                    </div>
                  </div>

                  {/* Rules */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Competition Rules ({selectedEvent.rules.length})
                    </h4>
                    <ul className="space-y-1.5 text-xs text-slate-700">
                      {selectedEvent.rules.map((r, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                          <span className="w-5 h-5 rounded-full bg-cyan-100 text-cyan-800 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                            {idx + 1}
                          </span>
                          <span>{r}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Coordinators */}
                  <div className="space-y-2 pt-2 border-t border-slate-200">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Event Coordinators
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {selectedEvent.coordinators.map((c) => (
                        <div key={c.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-3 text-xs">
                          <img src={c.photoUrl} alt={c.name} className="w-10 h-10 rounded-full object-cover" />
                          <div>
                            <p className="font-bold text-slate-900">{c.name}</p>
                            <p className="text-[11px] text-cyan-700">{c.role}</p>
                            <p className="text-[10px] text-slate-500 font-mono">{c.phone}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: PARTICIPANT ROSTERS & PAYMENT GOVERNANCE */}
          {activeTab === 'registrations' && (
            <div className="space-y-5 max-w-7xl mx-auto">
              {/* Top Financial & Registration Telemetry KPI Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-xl bg-white border border-slate-200/80 shadow-2xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">Revenue</span>
                    <div className="w-6 h-6 rounded-md bg-emerald-50 text-emerald-600 flex items-center justify-center">
                      <IndianRupee className="w-3.5 h-3.5" />
                    </div>
                  </div>
                  <div className="mt-1 flex items-baseline justify-between">
                    <span className="text-xl font-bold font-mono text-emerald-700">₹{totalAssignedRevenue.toLocaleString()}</span>
                    <span className="text-[10px] text-slate-400 font-medium">Verified fees</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-white border border-slate-200/80 shadow-2xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">Paid</span>
                    <div className="w-6 h-6 rounded-md bg-teal-50 text-teal-600 flex items-center justify-center">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </div>
                  </div>
                  <div className="mt-1 flex items-baseline justify-between">
                    <span className="text-xl font-bold font-mono text-teal-700">{paidCount}</span>
                    <span className="text-[10px] text-teal-600 font-medium">
                      {assignedRegistrations.length > 0 ? Math.round((paidCount / assignedRegistrations.length) * 100) : 0}% of total
                    </span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-white border border-slate-200/80 shadow-2xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">Pending</span>
                    <div className="w-6 h-6 rounded-md bg-amber-50 text-amber-600 flex items-center justify-center">
                      <Clock className="w-3.5 h-3.5" />
                    </div>
                  </div>
                  <div className="mt-1 flex items-baseline justify-between">
                    <span className="text-xl font-bold font-mono text-amber-700">{pendingCount}</span>
                    <span className="text-[10px] text-amber-600 font-medium">Awaiting checkout</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-white border border-slate-200/80 shadow-2xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">Checked-In</span>
                    <div className="w-6 h-6 rounded-md bg-cyan-50 text-cyan-600 flex items-center justify-center">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </div>
                  </div>
                  <div className="mt-1 flex items-baseline justify-between">
                    <span className="text-xl font-bold font-mono text-cyan-700">{presentCount}</span>
                    <span className="text-[10px] text-cyan-600 font-medium">
                      {paidCount > 0 ? Math.round((presentCount / paidCount) * 100) : 0}% of paid
                    </span>
                  </div>
                </div>
              </div>

              {/* Data Management Box */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-4">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="relative flex-1 max-w-md">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      id="admin-reg-search"
                      name="regSearch"
                      type="text"
                      value={regSearch}
                      onChange={(e) => setRegSearch(e.target.value)}
                      placeholder="Search name, roll no, team, pass ID, Razorpay pay_id..."
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 focus:border-cyan-600 focus:outline-none"
                    />
                  </div>

                  <div className="flex flex-wrap items-center gap-2.5">
                    {/* Payment Status Segmented Filter */}
                    <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
                      {(['ALL', 'PAID', 'PENDING', 'FAILED'] as const).map((pStatus) => {
                        const count =
                          pStatus === 'ALL'
                            ? assignedRegistrations.length
                            : pStatus === 'PAID'
                            ? paidCount
                            : pStatus === 'PENDING'
                            ? pendingCount
                            : failedCount;
                        const isSelected = regFilterPayment === pStatus;
                        return (
                          <button
                            key={pStatus}
                            type="button"
                            onClick={() => setRegFilterPayment(pStatus)}
                            className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-colors cursor-pointer flex items-center gap-1.5 ${
                              isSelected
                                ? 'bg-cyan-600 text-white shadow-xs'
                                : 'text-slate-600 hover:text-slate-900'
                            }`}
                          >
                            <span>{pStatus === 'ALL' ? 'All' : pStatus}</span>
                            <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isSelected ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'}`}>
                              {count}
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    <select
                      id="admin-reg-filter-event"
                      name="regFilterEvent"
                      aria-label="Filter registrations by competition"
                      value={regFilterEvent}
                      onChange={(e) => setRegFilterEvent(e.target.value)}
                      className="px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 font-semibold"
                    >
                      <option value="ALL">All Competitions</option>
                      {assignedEvents.map((e) => (
                        <option key={e.id} value={e.id}>
                          {e.title}
                        </option>
                      ))}
                    </select>

                    <button
                      type="button"
                      onClick={() => handleExportCSV('registrations')}
                      className="py-2 px-3.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs flex items-center gap-2 shadow cursor-pointer transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Export CSV</span>
                    </button>
                  </div>
                </div>

                {/* Data Grid */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px]">
                      <tr>
                        <th className="py-3.5 px-4">Pass ID</th>
                        <th className="py-3.5 px-4">Event</th>
                        <th className="py-3.5 px-4">Candidate / Team</th>
                        <th className="py-3.5 px-4">Payment &amp; Gateway ID</th>
                        <th className="py-3.5 px-4">Gate Status</th>
                        <th className="py-3.5 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredRegistrations.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="py-8 text-center text-slate-400">
                            No registrations match your search and filter criteria.
                          </td>
                        </tr>
                      ) : (
                        filteredRegistrations.map((r) => {
                          const isPresent = attendanceList.some(
                            (a) => a.registrationId === r.id && a.status === 'PRESENT'
                          );
                          const isPaid = r.paymentStatus === 'PAID';
                          const isPending = (r.paymentStatus || 'PENDING') === 'PENDING';
                          const isFailed = r.paymentStatus === 'FAILED';

                          return (
                            <tr key={r.id} className="hover:bg-slate-50/70 transition-colors">
                              <td className="py-3.5 px-4 font-mono font-bold text-cyan-700">
                                {r.registrationNumber}
                              </td>
                              <td className="py-3.5 px-4">
                                <div className="font-semibold text-slate-900">{r.eventTitle}</div>
                                <span className={`text-[9px] uppercase font-bold px-1.5 py-0.5 rounded ${
                                  r.category === 'Technical' ? 'bg-cyan-50 text-cyan-700' : 'bg-teal-50 text-teal-700'
                                }`}>
                                  {r.category}
                                </span>
                              </td>
                              <td className="py-3.5 px-4">
                                <div className="font-bold text-slate-900">{r.leaderName}</div>
                                <div className="font-mono text-[10px] text-slate-500">
                                  {r.leaderRollNumber} {r.teamName ? `(${r.teamName})` : ''}
                                </div>
                                <div className="text-[10px] text-slate-400 truncate max-w-[180px]">
                                  {r.collegeName}
                                </div>
                              </td>
                              <td className="py-3.5 px-4">
                                {isPaid && (
                                  <div>
                                    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                      <span>₹{r.amountPaid || 200} PAID</span>
                                    </span>
                                    {r.paymentId && (
                                      <div className="font-mono text-[9px] text-slate-400 mt-0.5 truncate max-w-[130px]" title={r.paymentId}>
                                        {r.paymentId}
                                      </div>
                                    )}
                                  </div>
                                )}
                                {isPending && (
                                  <div>
                                    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300">
                                      <Clock className="w-3 h-3 text-amber-600" />
                                      <span>₹{r.amountPaid || 200} PENDING</span>
                                    </span>
                                    <p className="text-[9px] text-amber-600 mt-0.5">Unpaid registration</p>
                                  </div>
                                )}
                                {isFailed && (
                                  <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-300">
                                    <AlertTriangle className="w-3 h-3 text-rose-600" />
                                    <span>FAILED / REVIEW</span>
                                  </span>
                                )}
                              </td>
                              <td className="py-3.5 px-4">
                                {isPresent ? (
                                  <span className="text-emerald-700 font-bold flex items-center gap-1 text-xs">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                    <span>Present</span>
                                  </span>
                                ) : (
                                  <span className="text-slate-400 text-xs">Not Checked-in</span>
                                )}
                              </td>
                              <td className="py-3.5 px-4 text-right">
                                {isPending ? (
                                  <button
                                    type="button"
                                    onClick={() => handleManualMarkPaid(r)}
                                    title="Mark Paid via On-Spot Cash collection"
                                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-300 font-bold text-[10px] transition-colors cursor-pointer shadow-2xs"
                                  >
                                    <CreditCard className="w-3 h-3" />
                                    <span>Approve Cash</span>
                                  </button>
                                ) : (
                                  <span className="text-[10px] font-mono text-emerald-600 font-semibold flex items-center justify-end gap-1">
                                    <ShieldCheck className="w-3.5 h-3.5" />
                                    <span>Pass Ready</span>
                                  </span>
                                )}
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: GATE ATTENDANCE */}
          {activeTab === 'attendance' && (
            <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-4 max-w-7xl mx-auto">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Live Gate Attendance Stream</h3>
                  <p className="text-xs text-slate-500">Participants verified at the entrance gates in real-time.</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleExportCSV('attendance')}
                  className="py-2.5 px-4 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs flex items-center gap-2 shadow"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export Attendance CSV</span>
                </button>
              </div>

              <div className="space-y-2">
                {attendanceList
                  .filter((a) => assignedEvents.some((e) => e.id === a.eventId))
                  .map((att) => (
                    <div
                      key={att.id}
                      className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                          <CheckCircle2 className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900">{att.participantName}</h4>
                          <p className="text-[11px] text-slate-500 font-mono">
                            {att.participantRollNumber} • {att.teamName || 'Solo'}
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-[10px] text-slate-500 font-mono block">
                          {new Date(att.scannedAt || '').toLocaleTimeString()}
                        </span>
                        <span className="text-[10px] text-cyan-700 font-semibold">
                          Verified by {att.scannedByStaffName || 'Staff'}
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* TAB 4: SCORE LEADERBOARDS */}
          {activeTab === 'leaderboard' && (
            <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-4 max-w-7xl mx-auto">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Ranked Competition Leaderboards</h3>
                  <p className="text-xs text-slate-500">Total marks tabulated across all evaluation criteria.</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleExportCSV('scores')}
                  className="py-2.5 px-4 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs flex items-center gap-2 shadow"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export Leaderboard CSV</span>
                </button>
              </div>

              <div className="space-y-3">
                {scores
                  .filter((s) => assignedEvents.some((e) => e.id === s.eventId))
                  .sort((a, b) => b.totalScore - a.totalScore)
                  .map((scr, idx) => (
                    <div
                      key={scr.id}
                      className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-9 rounded-xl font-bold flex items-center justify-center shrink-0 ${
                            idx === 0
                              ? 'bg-amber-500 text-slate-950 shadow-sm'
                              : idx === 1
                              ? 'bg-slate-300 text-slate-900 shadow-sm'
                              : idx === 2
                              ? 'bg-amber-700 text-white shadow-sm'
                              : 'bg-slate-200 text-slate-700'
                          }`}
                        >
                          #{idx + 1}
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900 text-sm">{scr.teamOrParticipantName}</h4>
                          <p className="text-[11px] text-slate-500 font-mono">
                            {scr.rollNumberOrTeamId} • {scr.round}
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-xl font-bold font-mono text-cyan-700">{scr.totalScore}</span>
                        <span className="text-[10px] text-slate-500 block">/ 100 Marks</span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* TAB 5: STAFF APPOINTMENT */}
          {activeTab === 'employees' && (
            <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-6 max-w-7xl mx-auto">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Appoint Staff & Judges for Assigned Events</h3>
                  <p className="text-xs text-slate-500">
                    Create employee accounts restricted only to your assigned competitions.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setIsAppointingEmployee(!isAppointingEmployee)}
                  className="py-2.5 px-4 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs flex items-center gap-2 shadow"
                >
                  <Plus className="w-4 h-4" />
                  <span>{isAppointingEmployee ? 'Close Form' : 'Appoint New Staff'}</span>
                </button>
              </div>

              {isAppointingEmployee && (
                <form onSubmit={handleAppointEmployee} className="p-6 rounded-3xl bg-slate-50 border border-cyan-300 space-y-4 animate-in fade-in">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-700">
                    Staff Credentials & Event Assignment
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                    <div className="space-y-1.5">
                      <label htmlFor="admin-emp-name" className="font-semibold text-slate-700">Staff Full Name *</label>
                      <input
                        id="admin-emp-name"
                        name="empName"
                        type="text"
                        autoComplete="name"
                        required
                        value={empName}
                        onChange={(e) => setEmpName(e.target.value)}
                        placeholder="e.g. Praveen Chandran"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 focus:border-cyan-600 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label htmlFor="admin-emp-email" className="font-semibold text-slate-700">Official Email ID *</label>
                      <input
                        id="admin-emp-email"
                        name="empEmail"
                        type="email"
                        autoComplete="email"
                        required
                        value={empEmail}
                        onChange={(e) => setEmpEmail(e.target.value)}
                        placeholder="judge@spiher.edu.in"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 focus:border-cyan-600 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label htmlFor="admin-emp-password" className="font-semibold text-slate-700">Password / Pass *</label>
                        <button
                          type="button"
                          onClick={handleGenerateEmpPassword}
                          className="text-[10px] text-[#0077c8] hover:underline font-bold"
                        >
                          ⚡ Auto-Generate
                        </button>
                      </div>
                      <div className="relative">
                        <Key className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          id="admin-emp-password"
                          name="empPassword"
                          type="text"
                          required
                          value={empPassword}
                          onChange={(e) => setEmpPassword(e.target.value)}
                          placeholder="Judge@SPIHER2024"
                          className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 font-mono font-bold focus:border-cyan-600 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label htmlFor="admin-emp-dept" className="font-semibold text-slate-700">Department</label>
                      <input
                        id="admin-emp-dept"
                        name="empDept"
                        type="text"
                        value={empDept}
                        onChange={(e) => setEmpDept(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 focus:border-cyan-600 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5 text-xs max-w-md">
                    <label htmlFor="admin-emp-event" className="font-semibold text-slate-700">Assigned Competition *</label>
                    <select
                      id="admin-emp-event"
                      name="empEventId"
                      aria-label="Assigned Competition"
                      value={empEventId}
                      onChange={(e) => setEmpEventId(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 font-bold focus:border-cyan-600 focus:outline-none"
                    >
                      {assignedEvents.map((e) => (
                        <option key={e.id} value={e.id}>
                          {e.title} ({e.category})
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="py-3 px-6 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs shadow-md cursor-pointer"
                  >
                    Issue Staff Credentials &amp; Pass
                  </button>
                </form>
              )}

              <div className="space-y-2">
                {appointedEmployees.map((emp) => (
                  <div
                    key={emp.id}
                    className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-cyan-100 text-cyan-800 font-bold flex items-center justify-center shrink-0">
                        {emp.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900">{emp.name}</h4>
                        <p className="text-[11px] text-slate-500 font-mono">{emp.email}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right hidden sm:block">
                        <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-cyan-100 text-cyan-800 border border-cyan-200">
                          {emp.role}
                        </span>
                        <p className="text-[10px] text-slate-500 mt-1">
                          Assigned: {assignedEvents.find((e) => emp.assignedEventIds.includes(e.id))?.title || 'Assigned Event'}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setSelectedPassUser(emp)}
                        className="py-1.5 px-3 rounded-xl bg-white border border-[#d4e8f5] text-[#0077c8] hover:bg-[#e8f5fb] font-bold text-xs shadow-sm transition-colors"
                      >
                        🔑 View Pass
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: DATA EXPORTS */}
          {activeTab === 'exports' && (
            <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-4 max-w-7xl mx-auto">
              <div>
                <h3 className="text-base font-bold text-slate-900">Structured Data Export Engine</h3>
                <p className="text-xs text-slate-500">
                  Export verified registration rosters, gate attendance logs, and scored leaderboards for your assigned events.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 pt-3">
                <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 space-y-4 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="w-10 h-10 rounded-2xl bg-cyan-100 text-cyan-700 flex items-center justify-center">
                      <Users className="w-5 h-5" />
                    </div>
                    <h4 className="text-sm font-bold text-slate-900">Registrations Dataset</h4>
                    <p className="text-xs text-slate-500">Complete participant names, roll numbers, college, and teams.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleExportCSV('registrations')}
                    className="w-full py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download CSV</span>
                  </button>
                </div>

                <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 space-y-4 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <h4 className="text-sm font-bold text-slate-900">Attendance Dataset</h4>
                    <p className="text-xs text-slate-500">Gate verification timestamps and verifying staff records.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleExportCSV('attendance')}
                    className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download CSV</span>
                  </button>
                </div>

                <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 space-y-4 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center">
                      <Trophy className="w-5 h-5" />
                    </div>
                    <h4 className="text-sm font-bold text-slate-900">Leaderboard Dataset</h4>
                    <p className="text-xs text-slate-500">Multi-criteria marks breakdown and final ranked standings.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleExportCSV('scores')}
                    className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download CSV</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Official Admin / Staff Credential Pass Modal */}
      {selectedPassUser && (
        <AdminCredentialPassModal
          user={selectedPassUser}
          events={events}
          onClose={() => setSelectedPassUser(null)}
        />
      )}
    </div>
  );
};
