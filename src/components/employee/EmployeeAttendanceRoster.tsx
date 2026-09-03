import React, { useState } from 'react';
import {
  Search,
  CheckCircle2,
  XCircle,
  User,
  Users,
  Crown,
  Filter,
  Sparkles,
  Building,
} from 'lucide-react';
import { MockDatabaseService } from '../../data/mockDatabase';
import { AttendanceRecord, Registration, StaffUser } from '../../types';

interface EmployeeAttendanceRosterProps {
  staffUser: StaffUser;
  registrations: Registration[];
  attendanceList: AttendanceRecord[];
  onAttendanceChanged: () => void;
}

export const EmployeeAttendanceRoster: React.FC<EmployeeAttendanceRosterProps> = ({
  staffUser,
  registrations,
  attendanceList,
  onAttendanceChanged,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PRESENT' | 'ABSENT'>('ALL');

  // Filter registrations assigned to this staff user
  const assignedRegistrations = registrations.filter((r) =>
    staffUser.assignedEventIds.length === 0 || staffUser.assignedEventIds.includes(r.eventId)
  );

  const filteredRegistrations = assignedRegistrations.filter((r) => {
    const isPresent = attendanceList.some((a) => a.registrationId === r.id && a.status === 'PRESENT');
    if (statusFilter === 'PRESENT' && !isPresent) return false;
    if (statusFilter === 'ABSENT' && isPresent) return false;

    const term = searchTerm.toLowerCase();
    return (
      r.leaderName.toLowerCase().includes(term) ||
      r.leaderRollNumber.toLowerCase().includes(term) ||
      (r.teamName && r.teamName.toLowerCase().includes(term)) ||
      r.eventTitle.toLowerCase().includes(term)
    );
  });

  const handleToggleAttendance = (reg: Registration, currentIsPresent: boolean) => {
    const nextStatus = currentIsPresent ? 'ABSENT' : 'PRESENT';
    MockDatabaseService.recordAttendance(
      reg.id,
      staffUser,
      nextStatus,
      `Manual attendance roster toggle by ${staffUser.name}`
    );
    onAttendanceChanged();
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
      {/* Search & Filter Header */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by Roll No, Candidate Name, or Team..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 placeholder-slate-400 font-semibold focus:bg-white focus:ring-2 focus:ring-teal-600 focus:border-teal-600 focus:outline-none"
          />
        </div>

        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5">
            {(['ALL', 'PRESENT', 'ABSENT'] as const).map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-xl font-bold text-[11px] transition-colors cursor-pointer ${
                  statusFilter === st
                    ? 'bg-teal-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          <span className="text-[11px] text-slate-500 font-bold">
            Showing {filteredRegistrations.length} of {assignedRegistrations.length}
          </span>
        </div>
      </div>

      {/* Roster Cards List */}
      <div className="space-y-3">
        {filteredRegistrations.map((reg) => {
          const isPresent = attendanceList.some((a) => a.registrationId === reg.id && a.status === 'PRESENT');

          return (
            <div
              key={reg.id}
              className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[9px] uppercase font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                    {reg.eventTitle}
                  </span>
                  {reg.teamName && (
                    <span className="text-[11px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 flex items-center gap-1">
                      <Crown className="w-3 h-3 text-amber-500" />
                      <span>{reg.teamName}</span>
                    </span>
                  )}
                </div>

                <h4 className="text-sm font-bold text-slate-900">{reg.leaderName}</h4>
                <div className="flex items-center gap-2 text-[11px] text-slate-600">
                  <span className="font-mono font-bold text-teal-700">{reg.leaderRollNumber}</span>
                  <span>•</span>
                  <span>{reg.department}</span>
                </div>
              </div>

              {/* Status Toggle Action */}
              <button
                type="button"
                onClick={() => handleToggleAttendance(reg, isPresent)}
                className={`py-2 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm cursor-pointer ${
                  isPresent
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
                }`}
              >
                {isPresent ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Present (Tap to Mark Absent)</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4" />
                    <span>Absent (Tap to Mark Present)</span>
                  </>
                )}
              </button>
            </div>
          );
        })}

        {filteredRegistrations.length === 0 && (
          <div className="text-center py-10 bg-white rounded-3xl border border-slate-200 p-6 space-y-2">
            <p className="text-xs font-bold text-slate-900">No Participants Match Search Filter</p>
            <p className="text-[11px] text-slate-500">Try adjusting your query or filter criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};
