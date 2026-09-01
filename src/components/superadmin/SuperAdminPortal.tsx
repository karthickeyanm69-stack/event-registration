import React, { useState } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  Layers,
  Users,
  Trophy,
  CheckCircle2,
  Settings,
  History,
  Plus,
  Trash2,
  Edit,
  Download,
  Search,
  Sparkles,
  LogOut,
  Building,
  Key,
  Eye,
  AlertTriangle,
  RotateCcw,
  Check,
  X,
  Mail,
  UserCheck,
  Shield,
  Save,
  LayoutDashboard,
  Activity,
  Calendar,
  Clock,
  MapPin,
  FileSpreadsheet,
  Filter,
  ChevronRight,
  TrendingUp,
  Award,
  Bell,
  RefreshCw,
} from 'lucide-react';
import {
  AttendanceRecord,
  AuditLog,
  CollegeEvent,
  EventCategory,
  EventChangeAudit,
  Participant,
  Registration,
  ScoreRecord,
  StaffUser,
  SystemSettings,
} from '../../types';
import { MockDatabaseService } from '../../data/mockDatabase';

interface SuperAdminPortalProps {
  superAdminUser: StaffUser;
  events: CollegeEvent[];
  participants: Participant[];
  registrations: Registration[];
  attendanceList: AttendanceRecord[];
  scores: ScoreRecord[];
  staffList: StaffUser[];
  eventChanges: EventChangeAudit[];
  auditLogs: AuditLog[];
  settings: SystemSettings;
  onStaffLogout: () => void;
  onRefreshData: () => void;
}

export type SuperAdminTab =
  | 'dashboard'
  | 'events-crud'
  | 'user-mgmt'
  | 'matrix'
  | 'change-history'
  | 'audit-logs'
  | 'system-settings';

export const SuperAdminPortal: React.FC<SuperAdminPortalProps> = ({
  superAdminUser,
  events,
  participants,
  registrations,
  attendanceList,
  scores,
  staffList,
  eventChanges,
  auditLogs,
  settings,
  onStaffLogout,
  onRefreshData,
}) => {
  const [activeTab, setActiveTab] = useState<SuperAdminTab>('dashboard');

  // Search & Filters
  const [globalSearch, setGlobalSearch] = useState('');
  const [logFilterRole, setLogFilterRole] = useState('ALL');
  const [logSearch, setLogSearch] = useState('');
  const [eventCategoryFilter, setEventCategoryFilter] = useState<'ALL' | 'Technical' | 'Non-Technical'>('ALL');

  // New Event Modal State
  const [isCreatingEvent, setIsCreatingEvent] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventCategory, setNewEventCategory] = useState<EventCategory>('Technical');
  const [newEventTagline, setNewEventTagline] = useState('');
  const [newEventVenue, setNewEventVenue] = useState('Computing Annex Lab 1');
  const [newEventTime, setNewEventTime] = useState('10:00 AM - 01:00 PM');
  const [newEventPrize, setNewEventPrize] = useState('₹25,000');
  const [newEventSlots, setNewEventSlots] = useState(40);
  const [newEventIsTeam, setNewEventIsTeam] = useState(true);
  const [newEventMinTeam, setNewEventMinTeam] = useState(2);
  const [newEventMaxTeam, setNewEventMaxTeam] = useState(3);

  // New Admin Modal State
  const [isCreatingAdmin, setIsCreatingAdmin] = useState(false);
  const [adminName, setAdminName] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminDept, setAdminDept] = useState('Dept. of Computer Science & Engineering');
  const [adminAssignedEvents, setAdminAssignedEvents] = useState<string[]>([]);

  // Settings State
  const [localSettings, setLocalSettings] = useState<SystemSettings>(settings);
  const [settingsSuccess, setSettingsSuccess] = useState(false);

  // Handlers
  const handleSaveNewEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEventTitle.trim()) return;

    const id = `evt-${newEventTitle.toLowerCase().replace(/[^a-z0-9]/g, '')}-${Date.now().toString().slice(-4)}`;
    const newEvent: CollegeEvent = {
      id,
      title: newEventTitle.trim(),
      category: newEventCategory,
      tagline: newEventTagline.trim() || 'Exciting National Level Competition at IGNITE 2024',
      description: 'Official tournament competition hosted by the Department.',
      isTeamEvent: newEventIsTeam,
      minTeamSize: newEventIsTeam ? newEventMinTeam : 1,
      maxTeamSize: newEventIsTeam ? newEventMaxTeam : 1,
      price: 0,
      date: 'Oct 24, 2024',
      time: newEventTime,
      startTime: newEventTime.split('-')[0]?.trim() || '10:00 AM',
      endTime: newEventTime.split('-')[1]?.trim() || '01:00 PM',
      venue: newEventVenue,
      totalSlots: newEventSlots,
      slotsLeft: newEventSlots,
      imageUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80',
      prizePool: newEventPrize,
      firstPrize: 'Trophy + Cash Award',
      secondPrize: 'Certificate + Cash Award',
      rules: [
        'Standard fair play and institutional code of conduct apply.',
        'Jury panel evaluation decision is final and binding.',
      ],
      coordinators: [
        {
          id: `coord-${Date.now()}`,
          name: superAdminUser.name,
          role: 'Convenor',
          phone: '+91 94440 12345',
          email: superAdminUser.email,
          photoUrl: superAdminUser.avatarUrl || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80',
        },
      ],
      status: 'OPEN',
    };

    MockDatabaseService.saveEvent(newEvent);
    setIsCreatingEvent(false);
    setNewEventTitle('');
    onRefreshData();
  };

  const handleDeleteEvent = (id: string) => {
    if (window.confirm('Archive and delete this event? Existing participant registrations will remain in the audit log.')) {
      MockDatabaseService.deleteEvent(id);
      onRefreshData();
    }
  };

  const handleCreateAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminName.trim() || !adminEmail.trim()) return;

    const newAdmin: StaffUser = {
      id: `staff-admin-${Date.now()}`,
      email: adminEmail.trim().toLowerCase(),
      name: adminName.trim(),
      role: 'ADMIN',
      department: adminDept,
      assignedEventIds: adminAssignedEvents,
      isActive: true,
      mustChangePassword: true,
    };

    MockDatabaseService.saveStaffUser(newAdmin);
    setIsCreatingAdmin(false);
    setAdminName('');
    setAdminEmail('');
    setAdminAssignedEvents([]);
    onRefreshData();
  };

  const handleToggleUserActive = (user: StaffUser) => {
    const updated = { ...user, isActive: !user.isActive };
    MockDatabaseService.saveStaffUser(updated);
    onRefreshData();
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    MockDatabaseService.updateSettings(localSettings);
    setSettingsSuccess(true);
    setTimeout(() => setSettingsSuccess(false), 2500);
    onRefreshData();
  };

  const navItems: { id: SuperAdminTab; label: string; icon: React.ComponentType<{ className?: string }>; count?: number }[] = [
    { id: 'dashboard', label: 'Master Telemetry', icon: LayoutDashboard },
    { id: 'events-crud', label: 'Competitions & Events', icon: Layers, count: events.length },
    { id: 'user-mgmt', label: 'Admins & Staff Directory', icon: Users, count: staffList.length },
    { id: 'matrix', label: 'Permission Matrix', icon: Shield },
    { id: 'change-history', label: 'Event Change Audits', icon: History, count: eventChanges.length },
    { id: 'audit-logs', label: 'System Audit Logs', icon: Activity, count: auditLogs.length },
    { id: 'system-settings', label: 'Platform Configuration', icon: Settings },
  ];

  const presentCount = attendanceList.filter((a) => a.status === 'PRESENT').length;
  const attendanceRate = registrations.length > 0 ? Math.round((presentCount / registrations.length) * 100) : 0;

  const filteredEvents = events.filter((e) => {
    if (eventCategoryFilter !== 'ALL' && e.category !== eventCategoryFilter) return false;
    if (globalSearch && !e.title.toLowerCase().includes(globalSearch.toLowerCase()) && !e.venue.toLowerCase().includes(globalSearch.toLowerCase())) {
      return false;
    }
    return true;
  });

  const filteredLogs = auditLogs.filter((l) => {
    if (logFilterRole !== 'ALL' && l.actorRole !== logFilterRole) return false;
    const term = logSearch.toLowerCase();
    return (
      l.action.toLowerCase().includes(term) ||
      l.actorName.toLowerCase().includes(term) ||
      l.details.toLowerCase().includes(term)
    );
  });

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">
      {/* Top Executive Header Bar */}
      <header className="h-16 bg-slate-950 border-b border-slate-800 px-6 flex items-center justify-between sticky top-0 z-40 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-500 to-cyan-400 flex items-center justify-center text-slate-950 font-bold shadow-lg shadow-teal-500/20">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif font-bold text-base text-white tracking-tight">SPIHER</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 border border-teal-500/30 uppercase tracking-wider">
                  Super Admin Console
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
                National Level Technical & Non-Technical Symposium Governance
              </p>
            </div>
          </div>
        </div>

        {/* Center Live Telemetry Pill */}
        <div className="hidden lg:flex items-center gap-4 bg-slate-900/80 px-4 py-1.5 rounded-full border border-slate-800 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-slate-300 font-medium">System Status: Nominal</span>
          </div>
          <span className="text-slate-600">|</span>
          <span className="text-slate-400">{events.length} Competitions Active</span>
          <span className="text-slate-600">|</span>
          <span className="text-teal-400 font-mono font-bold">{registrations.length} Registrations</span>
        </div>

        {/* Right User & Actions */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-3 bg-slate-900 py-1 px-3 rounded-xl border border-slate-800">
            <div className="w-7 h-7 rounded-lg bg-teal-500/20 text-teal-300 font-bold flex items-center justify-center text-xs">
              {superAdminUser.name.charAt(0)}
            </div>
            <div className="hidden sm:block text-left text-xs">
              <p className="font-bold text-white leading-tight">{superAdminUser.name}</p>
              <p className="text-[10px] text-slate-400 truncate max-w-[140px]">Super Administrator</p>
            </div>
          </div>

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

      {/* Main Desktop Container with Left Sidebar & Full-Width Canvas */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Navigation Sidebar */}
        <aside className="w-64 bg-slate-950 border-r border-slate-800 flex flex-col justify-between p-4 shrink-0 hidden md:flex">
          <div className="space-y-1">
            <div className="px-3 py-2 text-[10px] uppercase font-bold tracking-widest text-slate-400">
              Management Modules
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
                        ? 'bg-gradient-to-r from-teal-500 to-teal-600 text-slate-950 font-bold shadow-lg shadow-teal-500/20'
                        : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-slate-950' : 'text-slate-400'}`} />
                      <span>{item.label}</span>
                    </div>
                    {item.count !== undefined && (
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ${
                          isActive ? 'bg-slate-950 text-teal-300' : 'bg-slate-800 text-slate-400'
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

          {/* Sidebar Footer Info */}
          <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-xs space-y-1">
            <div className="flex items-center gap-1.5 text-teal-400 font-bold">
              <ShieldCheck className="w-4 h-4" />
              <span>Strict 1-Participant Rule</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Database constraints enforce 1 event per student globally.
            </p>
          </div>
        </aside>

        {/* Mobile Horizontal Navigation Tabs */}
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

        {/* Main Content Viewport */}
        <main className="flex-1 bg-slate-900 overflow-y-auto p-6 lg:p-8 space-y-6">
          {/* ========================================================================= */}
          {/* 1. MASTER TELEMETRY DASHBOARD */}
          {/* ========================================================================= */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6 max-w-7xl mx-auto">
              {/* Executive Stat Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                {/* Stat 1 */}
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Events</span>
                    <div className="p-2 rounded-xl bg-teal-500/10 text-teal-400">
                      <Layers className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <span className="text-3xl font-bold font-mono text-white">{events.length}</span>
                    <p className="text-[11px] text-slate-400 mt-1">Tech & Non-Tech active</p>
                  </div>
                </div>

                {/* Stat 2 */}
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Registrations</span>
                    <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
                      <Users className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <span className="text-3xl font-bold font-mono text-cyan-300">{registrations.length}</span>
                    <p className="text-[11px] text-slate-400 mt-1">Verified participants</p>
                  </div>
                </div>

                {/* Stat 3 */}
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Gate Attendance</span>
                    <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <span className="text-3xl font-bold font-mono text-emerald-400">{presentCount}</span>
                    <p className="text-[11px] text-emerald-400/80 mt-1 font-semibold">{attendanceRate}% Turnout Rate</p>
                  </div>
                </div>

                {/* Stat 4 */}
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Admins & Staff</span>
                    <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
                      <Shield className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <span className="text-3xl font-bold font-mono text-amber-300">{staffList.length}</span>
                    <p className="text-[11px] text-slate-400 mt-1">Authorized personnel</p>
                  </div>
                </div>

                {/* Stat 5 */}
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Event Changes</span>
                    <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400">
                      <History className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <span className="text-3xl font-bold font-mono text-rose-300">{eventChanges.length}</span>
                    <p className="text-[11px] text-slate-400 mt-1">Audit audited switches</p>
                  </div>
                </div>
              </div>

              {/* Two-Column Telemetry Grids */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Category Registration Breakdown */}
                <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <Layers className="w-4 h-4 text-teal-400" />
                      <span>Category Distribution</span>
                    </h3>
                    <span className="text-xs text-slate-400">Total: {registrations.length}</span>
                  </div>

                  <div className="space-y-4">
                    {['Technical', 'Non-Technical'].map((cat) => {
                      const catEvents = events.filter((e) => e.category === cat);
                      const catRegs = registrations.filter((r) => r.category === cat);
                      const percent = registrations.length > 0 ? Math.round((catRegs.length / registrations.length) * 100) : 0;

                      return (
                        <div key={cat} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                          <div className="flex items-center justify-between text-xs font-bold">
                            <span className="text-white">{cat} Events ({catEvents.length} Competitions)</span>
                            <span className="text-teal-300 font-mono">{catRegs.length} Participants ({percent}%)</span>
                          </div>
                          <div className="h-2.5 w-full bg-slate-800 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-teal-500 to-cyan-400 rounded-full transition-all duration-500"
                              style={{ width: `${percent}%` }}
                            />
                          </div>
                          <div className="flex justify-between text-[11px] text-slate-400 pt-1">
                            <span>Slots Filled: {catEvents.reduce((sum, e) => sum + (e.totalSlots - e.slotsLeft), 0)}</span>
                            <span>Remaining Capacity: {catEvents.reduce((sum, e) => sum + e.slotsLeft, 0)}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Latest Check-in Stream */}
                <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <Activity className="w-4 h-4 text-emerald-400" />
                      <span>Live Gate Check-in Feed</span>
                    </h3>
                    <span className="text-xs text-emerald-400 font-mono font-bold">{presentCount} Present</span>
                  </div>

                  <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
                    {attendanceList.map((att) => (
                      <div
                        key={att.id}
                        className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-3 text-xs"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
                            <CheckCircle2 className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="font-bold text-white">{att.participantName}</p>
                            <p className="text-[11px] text-slate-400 font-mono">
                              {att.participantRollNumber} • {events.find((e) => e.id === att.eventId)?.title || att.eventId}
                            </p>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="text-[10px] text-slate-400 font-mono block">
                            {new Date(att.scannedAt || '').toLocaleTimeString()}
                          </span>
                          <span className="text-[10px] text-teal-400">Verified</span>
                        </div>
                      </div>
                    ))}

                    {attendanceList.length === 0 && (
                      <div className="text-center py-12 text-slate-500 text-xs">
                        No check-in scans recorded yet.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 2. COMPETITIONS & EVENTS CRUD */}
          {/* ========================================================================= */}
          {activeTab === 'events-crud' && (
            <div className="space-y-6 max-w-7xl mx-auto">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-950 p-6 rounded-3xl border border-slate-800">
                <div>
                  <h3 className="text-lg font-bold text-white">Event & Competition Directory</h3>
                  <p className="text-xs text-slate-400">
                    Create, edit, manage slots, configure rules, and manage prize pools for all symposium events.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
                    {(['ALL', 'Technical', 'Non-Technical'] as const).map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setEventCategoryFilter(cat)}
                        className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-colors ${
                          eventCategoryFilter === cat ? 'bg-teal-500 text-slate-950' : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsCreatingEvent(!isCreatingEvent)}
                    className="py-2 px-4 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs shadow-lg shadow-teal-500/20 flex items-center gap-2 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>{isCreatingEvent ? 'Close Form' : 'Add New Event'}</span>
                  </button>
                </div>
              </div>

              {/* Create New Event Modal / Drawer */}
              {isCreatingEvent && (
                <form onSubmit={handleSaveNewEvent} className="p-6 rounded-3xl bg-slate-950 border border-teal-500/30 space-y-5 animate-in fade-in shadow-2xl">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <h4 className="text-sm font-bold uppercase tracking-wider text-teal-400 flex items-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      <span>New Competition Creation</span>
                    </h4>
                    <span className="text-xs text-slate-400 font-mono">Status: Draft</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                    <div className="space-y-1.5">
                      <label className="font-semibold text-slate-300">Competition Title *</label>
                      <input
                        type="text"
                        required
                        value={newEventTitle}
                        onChange={(e) => setNewEventTitle(e.target.value)}
                        placeholder="e.g. Algorithmic Code Sprint"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white focus:border-teal-500 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="font-semibold text-slate-300">Category *</label>
                      <select
                        value={newEventCategory}
                        onChange={(e) => setNewEventCategory(e.target.value as EventCategory)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white font-bold focus:border-teal-500 focus:outline-none"
                      >
                        <option value="Technical">Technical</option>
                        <option value="Non-Technical">Non-Technical</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="font-semibold text-slate-300">Prize Pool</label>
                      <input
                        type="text"
                        value={newEventPrize}
                        onChange={(e) => setNewEventPrize(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white focus:border-teal-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
                    <div className="space-y-1.5">
                      <label className="font-semibold text-slate-300">Venue</label>
                      <input
                        type="text"
                        value={newEventVenue}
                        onChange={(e) => setNewEventVenue(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="font-semibold text-slate-300">Time & Schedule</label>
                      <input
                        type="text"
                        value={newEventTime}
                        onChange={(e) => setNewEventTime(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="font-semibold text-slate-300">Total Capacity Slots</label>
                      <input
                        type="number"
                        min={5}
                        max={300}
                        value={newEventSlots}
                        onChange={(e) => setNewEventSlots(parseInt(e.target.value) || 40)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="font-semibold text-slate-300">Participation Type</label>
                      <select
                        value={newEventIsTeam ? 'TEAM' : 'SOLO'}
                        onChange={(e) => setNewEventIsTeam(e.target.value === 'TEAM')}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white font-bold"
                      >
                        <option value="TEAM">Team Event</option>
                        <option value="SOLO">Individual (Solo)</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsCreatingEvent(false)}
                      className="px-4 py-2.5 rounded-xl bg-slate-900 text-slate-300 font-bold text-xs"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs shadow-lg shadow-teal-500/20"
                    >
                      Publish Event
                    </button>
                  </div>
                </form>
              )}

              {/* Events Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredEvents.map((evt) => (
                  <div
                    key={evt.id}
                    className="bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden shadow-xl flex flex-col justify-between hover:border-slate-700 transition-all group"
                  >
                    <div className="relative h-44 w-full overflow-hidden bg-slate-900">
                      <img
                        src={evt.imageUrl}
                        alt={evt.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

                      <div className="absolute top-3 left-3 flex items-center gap-2">
                        <span className="text-[10px] uppercase font-bold px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md text-teal-300 border border-teal-500/30">
                          {evt.category}
                        </span>
                      </div>

                      <div className="absolute top-3 right-3 bg-amber-500 text-slate-950 px-2.5 py-1 rounded-full text-xs font-bold shadow-md">
                        {evt.prizePool}
                      </div>

                      <div className="absolute bottom-3 left-3 right-3">
                        <h4 className="text-lg font-bold text-white leading-tight">{evt.title}</h4>
                        <p className="text-xs text-slate-300 opacity-90 truncate">{evt.tagline}</p>
                      </div>
                    </div>

                    <div className="p-5 space-y-4 flex-1 flex flex-col justify-between text-xs">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-slate-400">
                          <MapPin className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                          <span className="truncate">{evt.venue}</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-400">
                          <Clock className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                          <span className="truncate">{evt.time}</span>
                        </div>
                      </div>

                      {/* Slots Bar */}
                      <div className="space-y-1.5 pt-2 border-t border-slate-800">
                        <div className="flex justify-between text-[11px] font-mono">
                          <span className="text-slate-400">Availability</span>
                          <span className="text-teal-400 font-bold">{evt.slotsLeft} of {evt.totalSlots} Slots Free</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-teal-500 rounded-full"
                            style={{
                              width: `${((evt.totalSlots - evt.slotsLeft) / evt.totalSlots) * 100}%`,
                            }}
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                        <span className="text-[11px] text-slate-400">
                          {evt.isTeamEvent ? `Team (${evt.minTeamSize}-${evt.maxTeamSize})` : 'Solo'}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleDeleteEvent(evt.id)}
                          className="p-2 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                          title="Delete Event"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 3. ADMINS & STAFF GOVERNANCE */}
          {/* ========================================================================= */}
          {activeTab === 'user-mgmt' && (
            <div className="space-y-6 max-w-7xl mx-auto">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-950 p-6 rounded-3xl border border-slate-800">
                <div>
                  <h3 className="text-lg font-bold text-white">Staff & Admin Governance</h3>
                  <p className="text-xs text-slate-400">
                    Create event administrators, assign permitted competitions, and manage access controls.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setIsCreatingAdmin(!isCreatingAdmin)}
                  className="py-2.5 px-4 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs shadow-lg shadow-teal-500/20 flex items-center gap-2 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>{isCreatingAdmin ? 'Close Form' : 'Create Event Admin'}</span>
                </button>
              </div>

              {/* Create Admin Form */}
              {isCreatingAdmin && (
                <form onSubmit={handleCreateAdmin} className="p-6 rounded-3xl bg-slate-950 border border-teal-500/30 space-y-5 animate-in fade-in shadow-2xl">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-teal-400">
                    Admin Account Provisioning
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                    <div className="space-y-1.5">
                      <label className="font-semibold text-slate-300">Admin Name *</label>
                      <input
                        type="text"
                        required
                        value={adminName}
                        onChange={(e) => setAdminName(e.target.value)}
                        placeholder="e.g. Dr. K. Senthil Nathan"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="font-semibold text-slate-300">Official Email *</label>
                      <input
                        type="email"
                        required
                        value={adminEmail}
                        onChange={(e) => setAdminEmail(e.target.value)}
                        placeholder="admin.tech@spiher.edu.in"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="font-semibold text-slate-300">Department</label>
                      <input
                        type="text"
                        value={adminDept}
                        onChange={(e) => setAdminDept(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-2 text-xs">
                    <label className="font-semibold text-slate-300">
                      Assign Permitted Competitions to Admin:
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {events.map((evt) => {
                        const isChecked = adminAssignedEvents.includes(evt.id);
                        return (
                          <label
                            key={evt.id}
                            className={`p-3 rounded-2xl border cursor-pointer flex items-center gap-2.5 text-xs transition-colors ${
                              isChecked ? 'bg-teal-500/15 border-teal-500 text-white' : 'border-slate-800 bg-slate-900'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={(e) => {
                                if (e.target.checked) setAdminAssignedEvents([...adminAssignedEvents, evt.id]);
                                else setAdminAssignedEvents(adminAssignedEvents.filter((id) => id !== evt.id));
                              }}
                              className="rounded text-teal-500"
                            />
                            <span className="font-semibold truncate">{evt.title}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-2">
                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs shadow-lg"
                    >
                      Provision Admin Account
                    </button>
                  </div>
                </form>
              )}

              {/* Staff Table */}
              <div className="bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-900 border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[10px]">
                      <tr>
                        <th className="py-4 px-5">Staff Member</th>
                        <th className="py-4 px-5">Role</th>
                        <th className="py-4 px-5">Department</th>
                        <th className="py-4 px-5">Permitted Events</th>
                        <th className="py-4 px-5">Status</th>
                        <th className="py-4 px-5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {staffList.map((user) => (
                        <tr key={user.id} className="hover:bg-slate-900/50 transition-colors">
                          <td className="py-4 px-5">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-xl bg-slate-800 text-teal-400 font-bold flex items-center justify-center text-xs">
                                {user.name.charAt(0)}
                              </div>
                              <div>
                                <p className="font-bold text-white">{user.name}</p>
                                <p className="text-[11px] text-slate-400 font-mono">{user.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-5">
                            <span
                              className={`text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full ${
                                user.role === 'SUPER_ADMIN'
                                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                                  : user.role === 'ADMIN'
                                  ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30'
                                  : 'bg-slate-800 text-slate-300'
                              }`}
                            >
                              {user.role}
                            </span>
                          </td>
                          <td className="py-4 px-5 text-slate-300">{user.department}</td>
                          <td className="py-4 px-5">
                            {user.assignedEventIds.length === 0 ? (
                              <span className="text-teal-400 font-bold">All Events (Global)</span>
                            ) : (
                              <div className="flex flex-wrap gap-1">
                                {user.assignedEventIds.map((id) => (
                                  <span key={id} className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px]">
                                    {events.find((e) => e.id === id)?.title || id}
                                  </span>
                                ))}
                              </div>
                            )}
                          </td>
                          <td className="py-4 px-5">
                            <span
                              className={`text-[10px] font-bold ${
                                user.isActive ? 'text-emerald-400' : 'text-red-400'
                              }`}
                            >
                              {user.isActive ? '● Active' : '○ Deactivated'}
                            </span>
                          </td>
                          <td className="py-4 px-5 text-right">
                            {user.role !== 'SUPER_ADMIN' && (
                              <button
                                type="button"
                                onClick={() => handleToggleUserActive(user)}
                                className={`py-1 px-3 rounded-lg text-xs font-semibold ${
                                  user.isActive
                                    ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20'
                                    : 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'
                                }`}
                              >
                                {user.isActive ? 'Deactivate' : 'Activate'}
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 4. PERMISSION MATRIX */}
          {/* ========================================================================= */}
          {activeTab === 'matrix' && (
            <div className="space-y-6 max-w-7xl mx-auto">
              <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800">
                <h3 className="text-lg font-bold text-white">Event Assignment & Permission Matrix</h3>
                <p className="text-xs text-slate-400">
                  Visual mapping of all staff and admin authorization limits across technical and non-technical competitions.
                </p>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-900 border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[10px]">
                      <tr>
                        <th className="py-4 px-5">Staff / Admin</th>
                        <th className="py-4 px-5">Role</th>
                        {events.map((e) => (
                          <th key={e.id} className="py-4 px-5 truncate max-w-[140px]">
                            {e.title}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {staffList.map((user) => (
                        <tr key={user.id} className="hover:bg-slate-900/50">
                          <td className="py-4 px-5 font-bold text-white">{user.name}</td>
                          <td className="py-4 px-5 font-mono text-[11px] text-teal-400">{user.role}</td>
                          {events.map((e) => {
                            const isAssigned = user.assignedEventIds.length === 0 || user.assignedEventIds.includes(e.id);
                            return (
                              <td key={e.id} className="py-4 px-5 text-center">
                                {isAssigned ? (
                                  <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto text-xs font-bold">
                                    ✓
                                  </span>
                                ) : (
                                  <span className="text-slate-600">—</span>
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 5. EVENT CHANGE AUDITS */}
          {/* ========================================================================= */}
          {activeTab === 'change-history' && (
            <div className="space-y-6 max-w-7xl mx-auto">
              <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800">
                <h3 className="text-lg font-bold text-white">Participant Event Change Audits</h3>
                <p className="text-xs text-slate-400">
                  Permanent tamper-evident ledger recording all authorized 1-event switches and invalidated QR passes.
                </p>
              </div>

              <div className="space-y-3">
                {eventChanges.map((chg) => (
                  <div
                    key={chg.id}
                    className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white text-sm">
                        {chg.participantName} ({chg.rollNumber})
                      </span>
                      <span className="font-mono text-slate-400 text-[11px]">
                        {new Date(chg.changedAt).toLocaleString()}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-xs pt-1">
                      <span className="px-3 py-1 rounded-lg bg-rose-500/10 text-rose-300 border border-rose-500/20">
                        Revoked: {chg.oldEventTitle} (Pass: {chg.oldRegistrationId})
                      </span>
                      <span className="text-slate-500">→</span>
                      <span className="px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                        Minted: {chg.newEventTitle} (Pass: {chg.newRegistrationId})
                      </span>
                    </div>

                    <p className="text-xs text-slate-400 pt-1 italic">
                      Change Reason: "{chg.reason}"
                    </p>
                  </div>
                ))}

                {eventChanges.length === 0 && (
                  <div className="text-center py-16 bg-slate-950 rounded-3xl border border-slate-800 text-slate-500 text-xs">
                    No participant event changes recorded in the registry yet.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 6. SYSTEM AUDIT LOGS */}
          {/* ========================================================================= */}
          {activeTab === 'audit-logs' && (
            <div className="space-y-6 max-w-7xl mx-auto">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-950 p-6 rounded-3xl border border-slate-800">
                <div>
                  <h3 className="text-lg font-bold text-white">System Security & Activity Trail</h3>
                  <p className="text-xs text-slate-400">
                    Immutable event log of all administrative actions, logins, registrations, and scoring events.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <select
                    value={logFilterRole}
                    onChange={(e) => setLogFilterRole(e.target.value)}
                    className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-white"
                  >
                    <option value="ALL">All Roles</option>
                    <option value="SUPER_ADMIN">Super Admin</option>
                    <option value="ADMIN">Admin</option>
                    <option value="EMPLOYEE">Employee</option>
                    <option value="PARTICIPANT">Participant</option>
                    <option value="SYSTEM">System</option>
                  </select>
                </div>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden shadow-xl p-4 space-y-2">
                {filteredLogs.map((log) => (
                  <div
                    key={log.id}
                    className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-4 text-xs hover:border-slate-700 transition-colors"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-teal-400 text-xs">{log.action}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-bold">
                          {log.actorRole}
                        </span>
                      </div>
                      <p className="text-white font-medium">{log.details}</p>
                      <p className="text-[11px] text-slate-400">Actor: {log.actorName}</p>
                    </div>

                    <span className="text-[11px] text-slate-400 font-mono shrink-0">
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 7. SYSTEM CONFIG & SETTINGS */}
          {/* ========================================================================= */}
          {activeTab === 'system-settings' && (
            <div className="space-y-6 max-w-4xl mx-auto">
              <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800">
                <h3 className="text-lg font-bold text-white">Global Platform Configuration</h3>
                <p className="text-xs text-slate-400">
                  Configure symposium parameters, master registration kill switches, and theme banners.
                </p>
              </div>

              {settingsSuccess && (
                <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Platform configuration successfully saved!</span>
                </div>
              )}

              <form onSubmit={handleSaveSettings} className="bg-slate-950 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-xl text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-white text-sm">Master Registration Window</p>
                      <p className="text-[11px] text-slate-400">Enable or freeze new registrations</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={localSettings.isRegistrationOpen}
                      onChange={(e) =>
                        setLocalSettings({ ...localSettings, isRegistrationOpen: e.target.checked })
                      }
                      className="w-5 h-5 rounded text-teal-500"
                    />
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-white text-sm">Controlled Event Change</p>
                      <p className="text-[11px] text-slate-400">Permit 1-event switch in dashboard</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={localSettings.allowEventChange}
                      onChange={(e) =>
                        setLocalSettings({ ...localSettings, allowEventChange: e.target.checked })
                      }
                      className="w-5 h-5 rounded text-teal-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="font-semibold text-slate-300">College Name</label>
                    <input
                      type="text"
                      value={localSettings.collegeName}
                      onChange={(e) => setLocalSettings({ ...localSettings, collegeName: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-semibold text-slate-300">Symposium Name</label>
                    <input
                      type="text"
                      value={localSettings.symposiumName}
                      onChange={(e) => setLocalSettings({ ...localSettings, symposiumName: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-300">Theme Announcement Banner</label>
                  <textarea
                    rows={2}
                    value={localSettings.themeBannerText}
                    onChange={(e) => setLocalSettings({ ...localSettings, themeBannerText: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white"
                  />
                </div>

                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs shadow-lg shadow-teal-500/20 flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Global Configuration</span>
                </button>
              </form>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
