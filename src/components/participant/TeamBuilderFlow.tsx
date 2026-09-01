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
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-white"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Change Event</span>
        </button>

        <div className="flex items-center gap-1 text-[11px] font-bold text-secondary bg-secondary/10 px-2.5 py-1 rounded-full border border-secondary/20">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Step 3 of 3: {event.isTeamEvent ? 'Team Details' : 'Confirmation'}</span>
        </div>
      </div>

      {/* Event Overview Pill */}
      <div className="p-4 rounded-2xl bg-primary-container text-white border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg">
        <div>
          <span className="text-[10px] uppercase tracking-wider font-bold text-secondary-fixed">
            {event.category} Event
          </span>
          <h3 className="text-base font-bold">{event.title}</h3>
          <p className="text-xs text-slate-300">
            {event.venue} • {event.time}
          </p>
        </div>
        <div className="text-xs font-semibold bg-white/10 px-3 py-1.5 rounded-xl border border-white/15 self-start sm:self-auto">
          {event.isTeamEvent ? (
            <span className="text-secondary-fixed">
              Team Requirement: {event.minTeamSize} to {event.maxTeamSize} Members
            </span>
          ) : (
            <span className="text-emerald-300">Solo / Individual Participation</span>
          )}
        </div>
      </div>

      {errorMessage && (
        <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-300 dark:border-red-800/60 text-red-900 dark:text-red-200 text-xs font-medium flex items-start gap-2.5 animate-shake">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleValidateAndProceed} className="space-y-6">
        {/* Team Name Input (If Team Event) */}
        {event.isTeamEvent && (
          <div className="bg-white dark:bg-primary-container rounded-3xl p-6 border border-slate-200/80 dark:border-white/10 shadow-lg space-y-2">
            <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <Users className="w-4 h-4 text-secondary" />
              <span>Team Name *</span>
            </label>
            <input
              type="text"
              required
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              placeholder="e.g. Cyber Ninjas"
              className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-primary/60 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-sm font-semibold focus:ring-2 focus:ring-secondary focus:outline-none"
            />
          </div>
        )}

        {/* Member Cards List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>{event.isTeamEvent ? 'Team Roster & Details' : 'Participant Details'}</span>
              <span className="text-xs font-normal text-slate-400">
                ({members.length} {event.isTeamEvent ? `/ ${event.maxTeamSize} max` : ''})
              </span>
            </h3>

            {event.isTeamEvent && members.length < event.maxTeamSize && (
              <button
                type="button"
                onClick={handleAddMember}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-secondary/10 hover:bg-secondary/20 text-secondary text-xs font-bold border border-secondary/20 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
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
                className={`bg-white dark:bg-primary-container rounded-3xl p-5 sm:p-6 border transition-all ${
                  member.isLeader
                    ? 'border-secondary/40 shadow-md ring-1 ring-secondary/20'
                    : 'border-slate-200/80 dark:border-white/10 shadow'
                } space-y-4`}
              >
                {/* Member Header */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-white/10">
                  <div className="flex items-center gap-2">
                    {member.isLeader ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-300 border border-amber-500/30">
                        <Crown className="w-3.5 h-3.5" />
                        <span>Team Leader (You)</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-300">
                        <User className="w-3.5 h-3.5" />
                        <span>Teammate #{idx + 1}</span>
                      </span>
                    )}
                  </div>

                  {!member.isLeader && (
                    <button
                      type="button"
                      onClick={() => handleRemoveMember(idx)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                      title="Remove Member"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Name & Roll Number Input */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={member.name}
                      disabled={member.isLeader}
                      onChange={(e) => handleMemberChange(idx, 'name', e.target.value)}
                      placeholder="e.g. Teammate Name"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-primary/60 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-secondary focus:outline-none disabled:opacity-75"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Roll / Register Number *
                    </label>
                    <input
                      type="text"
                      required
                      value={member.rollNumber}
                      disabled={member.isLeader}
                      onChange={(e) => handleMemberChange(idx, 'rollNumber', e.target.value.toUpperCase())}
                      placeholder="e.g. 2021CS099"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-primary/60 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs font-mono focus:ring-2 focus:ring-secondary focus:outline-none disabled:opacity-75"
                    />
                  </div>
                </div>

                {/* Quick Auto-Fill Helpers for Teammates */}
                {!member.isLeader && (
                  <div className="flex flex-wrap gap-4 pt-1 text-xs">
                    <label className="flex items-center gap-1.5 cursor-pointer text-slate-600 dark:text-slate-300">
                      <input
                        type="checkbox"
                        checked={isSameCol}
                        onChange={(e) => handleToggleSameCollege(idx, e.target.checked)}
                        className="rounded border-slate-300 text-secondary focus:ring-secondary"
                      />
                      <span>Same College as Leader</span>
                    </label>

                    <label className="flex items-center gap-1.5 cursor-pointer text-slate-600 dark:text-slate-300">
                      <input
                        type="checkbox"
                        checked={isSameDept}
                        onChange={(e) => handleToggleSameDept(idx, e.target.checked)}
                        className="rounded border-slate-300 text-secondary focus:ring-secondary"
                      />
                      <span>Same Department as Leader</span>
                    </label>
                  </div>
                )}

                {/* College & Department Inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      College *
                    </label>
                    <input
                      type="text"
                      required
                      value={member.collegeName}
                      disabled={member.isLeader || (!member.isLeader && isSameCol)}
                      onChange={(e) => handleMemberChange(idx, 'collegeName', e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-primary/60 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-secondary focus:outline-none disabled:opacity-70"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Department *
                    </label>
                    <input
                      type="text"
                      required
                      value={member.department}
                      disabled={member.isLeader || (!member.isLeader && isSameDept)}
                      onChange={(e) => handleMemberChange(idx, 'department', e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-primary/60 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-secondary focus:outline-none disabled:opacity-70"
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
          className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-primary to-primary-container hover:from-primary-container hover:to-primary text-white font-bold text-sm shadow-xl shadow-primary/30 flex items-center justify-center gap-2 hover:scale-[1.01] transition-all"
        >
          <ShieldCheck className="w-5 h-5 text-secondary-fixed" />
          <span>Confirm & Generate Official QR Pass</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
