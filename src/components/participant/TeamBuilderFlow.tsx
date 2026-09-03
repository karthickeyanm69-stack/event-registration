import React, { useState } from 'react';
import {
  Users,
  User,
  Plus,
  Trash2,
  Check,
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Crown,
  Building,
  GraduationCap,
} from 'lucide-react';
import { MockDatabaseService } from '../../data/mockDatabase';
import { CollegeEvent, Participant, TeamMember } from '../../types';

interface TeamBuilderFlowProps {
  event: CollegeEvent;
  participantData: Partial<Participant>;
  onBackToEventSelection: () => void;
  onSubmitTeamAndRegister: (teamName: string, members: TeamMember[]) => void;
}

export const TeamBuilderFlow: React.FC<TeamBuilderFlowProps> = ({
  event,
  participantData,
  onBackToEventSelection,
  onSubmitTeamAndRegister,
}) => {
  const [teamName, setTeamName] = useState(
    event.isTeamEvent ? `Team ${participantData.name?.split(' ')[0] || 'Alpha'}` : ''
  );

  // Leader is always Member 1 by default
  const [members, setMembers] = useState<TeamMember[]>([
    {
      name: participantData.name || '',
      rollNumber: participantData.rollNumber || '',
      department: participantData.department || 'Dept. of Computer Science & Engineering',
      collegeName: participantData.collegeName || "St. Peter's Institute of Higher Education & Research",
      dateOfBirth: participantData.dateOfBirth,
      isLeader: true,
    },
  ]);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // State to track if member has same college/department as leader
  const [sameAsLeaderFlags, setSameAsLeaderFlags] = useState<{ [index: number]: { college: boolean; dept: boolean } }>({});

  const handleAddMember = () => {
    if (members.length >= event.maxTeamSize) {
      setErrorMessage(`Maximum team size for ${event.title} is ${event.maxTeamSize} members.`);
      return;
    }

    const newIdx = members.length;
    setSameAsLeaderFlags((prev) => ({
      ...prev,
      [newIdx]: { college: true, dept: true },
    }));

    setMembers((prev) => [
      ...prev,
      {
        name: '',
        rollNumber: '',
        department: participantData.department || '',
        collegeName: participantData.collegeName || '',
        isLeader: false,
      },
    ]);
    setErrorMessage(null);
  };

  const handleRemoveMember = (idx: number) => {
    if (members[idx].isLeader) return; // Cannot remove leader
    setMembers((prev) => prev.filter((_, i) => i !== idx));
    setErrorMessage(null);
  };

  const handleMemberChange = (idx: number, field: keyof TeamMember, val: any) => {
    setMembers((prev) => {
      const updated = [...prev];
      updated[idx] = { ...updated[idx], [field]: val };
      return updated;
    });
  };

  const handleToggleSameCollege = (idx: number, checked: boolean) => {
    setSameAsLeaderFlags((prev) => ({
      ...prev,
      [idx]: { ...(prev[idx] || { dept: true }), college: checked },
    }));
    if (checked) {
      handleMemberChange(idx, 'collegeName', participantData.collegeName);
    }
  };

  const handleToggleSameDept = (idx: number, checked: boolean) => {
    setSameAsLeaderFlags((prev) => ({
      ...prev,
      [idx]: { ...(prev[idx] || { college: true }), dept: checked },
    }));
    if (checked) {
      handleMemberChange(idx, 'department', participantData.department);
    }
  };

  const handleValidateAndProceed = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validate Team Name if team event
    if (event.isTeamEvent && !teamName.trim()) {
      setErrorMessage('Please enter a Team Name.');
      return;
    }

    // Validate Team Size
    if (event.isTeamEvent && members.length < event.minTeamSize) {
      setErrorMessage(
        `${event.title} requires at least ${event.minTeamSize} team members. Currently you have ${members.length}.`
      );
      return;
    }

    // Validate member fields
    for (let i = 0; i < members.length; i++) {
      const m = members[i];
      if (!m.name.trim() || !m.rollNumber.trim() || !m.collegeName.trim() || !m.department.trim()) {
        setErrorMessage(`Please complete all fields for ${m.isLeader ? 'Team Leader' : `Member ${i + 1}`}.`);
        return;
      }
    }

    // Check for internal duplicate roll numbers in the team
    const rollSet = new Set<string>();
    for (const m of members) {
      const norm = MockDatabaseService.normalizeRollNumber(m.rollNumber);
      if (rollSet.has(norm)) {
        setErrorMessage(`Duplicate Roll Number "${m.rollNumber}" found within your team. Each member must have a distinct Roll Number.`);
        return;
      }
      rollSet.add(norm);
    }

    // Strict 1-Participant-1-Event Check: Check each teammate's roll number in the database
    for (let i = 0; i < members.length; i++) {
      const m = members[i];
      const check = MockDatabaseService.checkIsParticipantRegistered(m.rollNumber);
      if (check.isRegistered && check.activeRegistration) {
        setErrorMessage(
          `${m.isLeader ? 'Leader' : `Teammate`} ${m.name} (${m.rollNumber}) is already registered for "${check.activeRegistration.eventTitle}". One participant can participate in only ONE event.`
        );
        return;
      }
    }

    // Proceed to Registration
    onSubmitTeamAndRegister(teamName.trim(), members);
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onBackToEventSelection}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-teal-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Change Event</span>
        </button>

        <div className="flex items-center gap-1 text-xs font-bold text-teal-800 bg-teal-50 px-3 py-1 rounded-full border border-teal-200 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-teal-600" />
          <span>Step 3 of 3: {event.isTeamEvent ? 'Team Details' : 'Confirmation'}</span>
        </div>
      </div>

      {/* Event Overview Banner */}
      <div className="p-5 rounded-2xl bg-[#002b66] text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
        <div>
          <span className="text-[10px] uppercase tracking-wider font-extrabold text-teal-300">
            {event.category} Event
          </span>
          <h3 className="text-lg font-bold text-white mt-0.5">{event.title}</h3>
          <p className="text-xs text-slate-200">
            {event.venue} • {event.time}
          </p>
        </div>
        <div className="text-xs font-bold bg-white/10 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/20 self-start sm:self-auto">
          {event.isTeamEvent ? (
            <span className="text-teal-200">
              Team Requirement: {event.minTeamSize} to {event.maxTeamSize} Members
            </span>
          ) : (
            <span className="text-emerald-300">Solo / Individual Participation</span>
          )}
        </div>
      </div>

      {errorMessage && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-300 text-red-900 text-xs font-medium flex items-start gap-2.5 shadow-sm">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleValidateAndProceed} className="space-y-6">
        {/* Team Name Input (If Team Event) */}
        {event.isTeamEvent && (
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-2">
            <label className="text-xs font-bold text-[#002b66] uppercase tracking-wider flex items-center gap-2">
              <Users className="w-4 h-4 text-teal-600" />
              <span>Team Name *</span>
            </label>
            <input
              type="text"
              required
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              placeholder="e.g. Cyber Ninjas"
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-sm font-semibold focus:bg-white focus:ring-2 focus:ring-teal-600 focus:border-teal-600 focus:outline-none"
            />
          </div>
        )}

        {/* Member Cards List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 uppercase tracking-wider">
              <span>{event.isTeamEvent ? 'Team Roster & Details' : 'Participant Details'}</span>
              <span className="text-xs font-normal text-slate-500">
                ({members.length} {event.isTeamEvent ? `/ ${event.maxTeamSize} max` : ''})
              </span>
            </h3>

            {event.isTeamEvent && members.length < event.maxTeamSize && (
              <button
                type="button"
                onClick={handleAddMember}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 text-xs font-bold border border-teal-200 transition-colors shadow-sm cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 text-teal-600" />
                <span>Add Teammate</span>
              </button>
            )}
          </div>

          {members.map((member, idx) => {
            const isSameCol = sameAsLeaderFlags[idx]?.college ?? true;
            const isSameDept = sameAsLeaderFlags[idx]?.dept ?? true;

            return (
              <div
                key={idx}
                className={`bg-white rounded-3xl p-5 sm:p-6 border transition-all ${
                  member.isLeader
                    ? 'border-teal-400 shadow-md ring-1 ring-teal-400/30'
                    : 'border-slate-200 shadow-sm'
                } space-y-4`}
              >
                {/* Member Header */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    {member.isLeader ? (
                      <span className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                        <Crown className="w-3.5 h-3.5 text-amber-500" />
                        <span>Team Leader (You)</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                        <User className="w-3.5 h-3.5 text-slate-500" />
                        <span>Teammate #{idx + 1}</span>
                      </span>
                    )}
                  </div>

                  {!member.isLeader && (
                    <button
                      type="button"
                      onClick={() => handleRemoveMember(idx)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                      title="Remove Member"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Name & Roll Number Input */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#002b66] uppercase tracking-wider">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={member.name}
                      disabled={member.isLeader}
                      onChange={(e) => handleMemberChange(idx, 'name', e.target.value)}
                      placeholder="e.g. Teammate Name"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs font-semibold focus:bg-white focus:ring-2 focus:ring-teal-600 focus:border-teal-600 focus:outline-none disabled:bg-slate-100 disabled:text-slate-600"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#002b66] uppercase tracking-wider">
                      Roll / Register Number *
                    </label>
                    <input
                      type="text"
                      required
                      value={member.rollNumber}
                      disabled={member.isLeader}
                      onChange={(e) => handleMemberChange(idx, 'rollNumber', e.target.value.toUpperCase())}
                      placeholder="e.g. 2021CS099"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs font-mono font-bold focus:bg-white focus:ring-2 focus:ring-teal-600 focus:border-teal-600 focus:outline-none disabled:bg-slate-100 disabled:text-slate-600"
                    />
                  </div>
                </div>

                {/* Quick Auto-Fill Helpers for Teammates */}
                {!member.isLeader && (
                  <div className="flex flex-wrap gap-4 pt-1 text-xs">
                    <label className="flex items-center gap-1.5 cursor-pointer text-slate-700 font-semibold">
                      <input
                        type="checkbox"
                        checked={isSameCol}
                        onChange={(e) => handleToggleSameCollege(idx, e.target.checked)}
                        className="rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                      />
                      <span>Same College as Leader</span>
                    </label>

                    <label className="flex items-center gap-1.5 cursor-pointer text-slate-700 font-semibold">
                      <input
                        type="checkbox"
                        checked={isSameDept}
                        onChange={(e) => handleToggleSameDept(idx, e.target.checked)}
                        className="rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                      />
                      <span>Same Department as Leader</span>
                    </label>
                  </div>
                )}

                {/* College & Department Inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#002b66] uppercase tracking-wider">
                      College *
                    </label>
                    <input
                      type="text"
                      required
                      value={member.collegeName}
                      disabled={member.isLeader || (!member.isLeader && isSameCol)}
                      onChange={(e) => handleMemberChange(idx, 'collegeName', e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs font-semibold focus:bg-white focus:ring-2 focus:ring-teal-600 focus:border-teal-600 focus:outline-none disabled:bg-slate-100 disabled:text-slate-600"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#002b66] uppercase tracking-wider">
                      Department *
                    </label>
                    <input
                      type="text"
                      required
                      value={member.department}
                      disabled={member.isLeader || (!member.isLeader && isSameDept)}
                      onChange={(e) => handleMemberChange(idx, 'department', e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs font-semibold focus:bg-white focus:ring-2 focus:ring-teal-600 focus:border-teal-600 focus:outline-none disabled:bg-slate-100 disabled:text-slate-600"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Submit & Confirm Button */}
        <button
          type="submit"
          className="w-full py-4 px-6 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm shadow-md shadow-teal-600/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <ShieldCheck className="w-5 h-5 text-teal-200" />
          <span>Confirm &amp; Generate Official QR Pass</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
