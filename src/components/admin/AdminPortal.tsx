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
  const [empDept, setEmpDept] = useState(adminUser.department || 'Dept. of Computer Science');
  const [empEventId, setEmpEventId] = useState(assignedEvents[0]?.id || '');
  const [appointSuccess, setAppointSuccess] = useState<string | null>(null);

  // Search & Filters for Registrations Table
  const [regSearch, setRegSearch] = useState('');
  const [regFilterEvent, setRegFilterEvent] = useState<string>('ALL');

  const filteredRegistrations = assignedRegistrations.filter((r) => {
    if (regFilterEvent !== 'ALL' && r.eventId !== regFilterEvent) return false;
    const term = regSearch.toLowerCase();
    return (
      r.leaderName.toLowerCase().includes(term) ||
      r.leaderRollNumber.toLowerCase().includes(term) ||
      (r.teamName && r.teamName.toLowerCase().includes(term)) ||
      r.registrationNumber.toLowerCase().includes(term)
    );
  });

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
    setIsAppointingEmployee(false);
    onRefreshData();
  };

  const handleExportCSV = (type: 'registrations' | 'attendance' | 'scores') => {
    let headers = '';
    let rows = '';

    if (type === 'registrations') {
      headers = 'Reg_ID,Event,Category,Leader_Name,Roll_No,Email,College,Dept,Team_Name,Status\n';
      rows = assignedRegistrations
        .map(
          (r) =>
            `"${r.registrationNumber}","${r.eventTitle}","${r.category}","${r.leaderName}","${r.leaderRollNumber}","${r.leaderEmail}","${r.collegeName}","${r.department}","${r.teamName || 'Solo'}","${r.status}"`
        )
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
    { id: 'events', label: 'Assigned Competitions', icon: Layers, count: assignedEvents.length },
    { id: 'registrations', label: 'Participant Rosters', icon: Users, count: assignedRegistrations.length },
    { id: 'attendance', label: 'Gate Attendance', icon: CheckCircle2, count: presentCount },
    { id: 'leaderboard', label: 'Score Leaderboards', icon: Trophy },
    { id: 'employees', label: 'Staff Appointment', icon: UserPlus, count: appointedEmployees.length },
    { id: 'exports', label: 'Data Exports', icon: Download },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Top Header with Official College Logo */}
      <header className="h-16 bg-white border-b border-[#d4e8f5] px-6 flex items-center justify-between sticky top-0 z-40 shadow-sm">
        <div className="flex items-center gap-4">
          <CollegeLogo variant="compact" size="sm" showSubtitle={false} />
          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#e8f5fb] text-[#0077c8] border border-[#d4e8f5] uppercase tracking-wider hidden sm:inline-block">
            Event Admin Portal
          </span>
        </div>

        {/* Center Telemetry Pill */}
        <div className="hidden lg:flex items-center gap-4 bg-slate-100/90 px-4 py-1.5 rounded-full border border-slate-200 text-xs">
          <span className="text-slate-700 font-semibold">{assignedEvents.length} Assigned Events</span>
          <span className="text-slate-300">|</span>
          <span className="text-cyan-700 font-mono font-bold">{assignedRegistrations.length} Registrations</span>
          <span className="text-slate-300">|</span>
          <span className="text-emerald-700 font-bold">{presentCount} Checked In</span>
        </div>

        {/* Right User Bar */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-3 bg-slate-100/80 py-1 px-3 rounded-xl border border-slate-200">
            <div className="w-7 h-7 rounded-lg bg-cyan-100 text-cyan-800 font-bold flex items-center justify-center text-xs">
              {adminUser.name.charAt(0)}
            </div>
            <div className="hidden sm:block text-left text-xs">
              <p className="font-bold text-slate-900 leading-tight">{adminUser.name}</p>
              <p className="text-[10px] text-slate-500">Event Administrator</p>
            </div>
          </div>

          <button
            onClick={onStaffLogout}
            title="Sign Out"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-semibold transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </header>

      {/* Main Desktop Container */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar Navigation */}
        <aside className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between p-4 shrink-0 hidden md:flex shadow-sm">
          <div className="space-y-1">
            <div className="px-3 py-2 text-[10px] uppercase font-bold tracking-widest text-slate-400">
              Admin Operations
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
                        ? 'bg-cyan-600 text-white font-bold shadow-md shadow-cyan-600/20'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                      <span>{item.label}</span>
                    </div>
                    {item.count !== undefined && (
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ${
                          isActive ? 'bg-white text-cyan-800' : 'bg-slate-100 text-slate-600'
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

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1">
            <div className="flex items-center gap-1.5 text-cyan-700 font-bold">
              <ShieldCheck className="w-4 h-4" />
              <span>Event-Scoped Access</span>
            </div>
            <p className="text-[11px] text-slate-500">
              You are authorized to manage only your assigned competitions.
            </p>
          </div>
        </aside>

        {/* Mobile Horizontal Bar */}
        <div className="md:hidden w-full overflow-x-auto bg-white border-b border-slate-200 p-2 flex gap-1.5 scrollbar-hide">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                  isActive ? 'bg-cyan-600 text-white' : 'text-slate-600 bg-slate-100'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Main Content Area */}
        <main className="flex-1 bg-slate-50 overflow-y-auto p-6 lg:p-8 space-y-6">
          {/* Executive Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-7xl mx-auto">
            <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Assigned Events</span>
                <div className="p-2 rounded-xl bg-cyan-50 text-cyan-700">
                  <Layers className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-3xl font-bold font-mono text-slate-900">{assignedEvents.length}</span>
                <p className="text-[11px] text-slate-500 mt-1">Under your governance</p>
              </div>
            </div>

            <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Registrations</span>
                <div className="p-2 rounded-xl bg-blue-50 text-blue-700">
                  <Users className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-3xl font-bold font-mono text-cyan-700">{assignedRegistrations.length}</span>
                <p className="text-[11px] text-slate-500 mt-1">Total registered candidates</p>
              </div>
            </div>

            <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Attendance Rate</span>
                <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-3xl font-bold font-mono text-emerald-700">
                  {assignedRegistrations.length > 0
                    ? `${Math.round((presentCount / assignedRegistrations.length) * 100)}%`
                    : '0%'}
                </span>
                <p className="text-[11px] text-slate-500 mt-1">{presentCount} checked-in at gates</p>
              </div>
            </div>

            <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Staff Appointed</span>
                <div className="p-2 rounded-xl bg-amber-50 text-amber-700">
                  <UserPlus className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-3xl font-bold font-mono text-amber-700">{appointedEmployees.length}</span>
                <p className="text-[11px] text-slate-500 mt-1">Evaluators & Judges</p>
              </div>
            </div>
          </div>

          {appointSuccess && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 max-w-7xl mx-auto">
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
                        <span className="text-xs font-bold font-mono text-cyan-700">{evt.slotsLeft} slots free</span>
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
                      <span className="text-[10px] uppercase text-slate-500 block font-bold">Prize Pool</span>
                      <span className="text-lg font-bold text-amber-600 font-mono">{selectedEvent.prizePool}</span>
                    </div>
                  </div>

                  {/* Metadata Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-0.5">
                      <span className="text-[10px] text-slate-500 uppercase">Format</span>
                      <p className="font-bold text-slate-900">
                        {selectedEvent.isTeamEvent ? `Team (${selectedEvent.minTeamSize}-${selectedEvent.maxTeamSize})` : 'Individual'}
                      </p>
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

          {/* TAB 2: PARTICIPANT ROSTERS */}
          {activeTab === 'registrations' && (
            <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-4 max-w-7xl mx-auto">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="relative flex-1 max-w-md">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={regSearch}
                    onChange={(e) => setRegSearch(e.target.value)}
                    placeholder="Search candidate, roll no, team..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 focus:border-cyan-600 focus:outline-none"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <select
                    value={regFilterEvent}
                    onChange={(e) => setRegFilterEvent(e.target.value)}
                    className="px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 font-semibold"
                  >
                    <option value="ALL">All Assigned Competitions</option>
                    {assignedEvents.map((e) => (
                      <option key={e.id} value={e.id}>
                        {e.title}
                      </option>
                    ))}
                  </select>

                  <button
                    type="button"
                    onClick={() => handleExportCSV('registrations')}
                    className="py-2.5 px-4 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs flex items-center gap-2 shadow"
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
                      <th className="py-3.5 px-4">College & Dept</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4">Gate Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredRegistrations.map((r) => {
                      const isPresent = attendanceList.some((a) => a.registrationId === r.id && a.status === 'PRESENT');
                      return (
                        <tr key={r.id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="py-3.5 px-4 font-mono font-bold text-cyan-700">{r.registrationNumber}</td>
                          <td className="py-3.5 px-4 font-semibold text-slate-900">{r.eventTitle}</td>
                          <td className="py-3.5 px-4">
                            <div className="font-bold text-slate-900">{r.leaderName}</div>
                            <div className="font-mono text-[10px] text-slate-500">
                              {r.leaderRollNumber} {r.teamName ? `(${r.teamName})` : ''}
                            </div>
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="text-slate-700 truncate max-w-[200px]">{r.collegeName}</div>
                            <div className="text-[10px] text-slate-500">{r.department}</div>
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                              {r.status}
                            </span>
                          </td>
                          <td className="py-3.5 px-4">
                            {isPresent ? (
                              <span className="text-emerald-700 font-bold flex items-center gap-1">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>Present</span>
                              </span>
                            ) : (
                              <span className="text-slate-400">Not Checked-in</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
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

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="space-y-1.5">
                      <label className="font-semibold text-slate-700">Staff Full Name *</label>
                      <input
                        type="text"
                        required
                        value={empName}
                        onChange={(e) => setEmpName(e.target.value)}
                        placeholder="e.g. Praveen Chandran"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="font-semibold text-slate-700">Official Email ID *</label>
                      <input
                        type="email"
                        required
                        value={empEmail}
                        onChange={(e) => setEmpEmail(e.target.value)}
                        placeholder="judge@spiher.edu.in"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="space-y-1.5">
                      <label className="font-semibold text-slate-700">Department</label>
                      <input
                        type="text"
                        value={empDept}
                        onChange={(e) => setEmpDept(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="font-semibold text-slate-700">Assigned Competition *</label>
                      <select
                        value={empEventId}
                        onChange={(e) => setEmpEventId(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 font-bold"
                      >
                        {assignedEvents.map((e) => (
                          <option key={e.id} value={e.id}>
                            {e.title}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="py-3 px-6 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs shadow-md"
                  >
                    Issue Staff Credentials
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

                    <div className="text-right">
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-cyan-100 text-cyan-800 border border-cyan-200">
                        {emp.role}
                      </span>
                      <p className="text-[10px] text-slate-500 mt-1">
                        Assigned: {assignedEvents.find((e) => emp.assignedEventIds.includes(e.id))?.title || 'Assigned Event'}
                      </p>
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
    </div>
  );
};
