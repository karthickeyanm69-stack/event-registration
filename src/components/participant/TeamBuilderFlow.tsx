import React, { useState, useEffect } from 'react';
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
  useEffect(() => {
    if (!participantData?.name || !participantData?.rollNumber) {
      onBackToEventSelection();
    }
  }, [participantData, onBackToEventSelection]);

  const [teamName, setTeamName] = useState(
    event.isTeamEvent ? `Squad ${participantData.name?.split(' ')[0] || 'Alpha'}` : ''
  );

  const [members, setMembers] = useState<TeamMember[]>([
    {
      name: participantData.name || '',
      rollNumber: participantData.rollNumber || '',
      department: participantData.department || 'Dept. of Information Technology',
      collegeName: participantData.collegeName || "St. Peter's Institute of Higher Education & Research",
      dateOfBirth: participantData.dateOfBirth,
      isLeader: true,
    },
  ]);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [sameAsLeaderFlags, setSameAsLeaderFlags] = useState<{ [index: number]: { college: boolean; dept: boolean } }>({});

  const handleAddMember = () => {
    if (members.length >= event.maxTeamSize) {
      setErrorMessage(`Maximum squad size for ${event.title} is ${event.maxTeamSize} members.`);
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
    if (members[idx].isLeader) return;
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
      [idx]: {
        ...prev[idx],
        college: checked,
      },
    }));

    if (checked) {
      handleMemberChange(idx, 'collegeName', participantData.collegeName);
    }
  };

  const handleToggleSameDept = (idx: number, checked: boolean) => {
    setSameAsLeaderFlags((prev) => ({
      ...prev,
      [idx]: {
        ...prev[idx],
        dept: checked,
      },
    }));

    if (checked) {
      handleMemberChange(idx, 'department', participantData.department);
    }
  };

  const handleValidateAndProceed = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (event.isTeamEvent && !teamName.trim()) {
      setErrorMessage('Please enter a Squad/Team name.');
      return;
    }

    if (members.length < event.minTeamSize) {
      setErrorMessage(`This arena requires at least ${event.minTeamSize} team members.`);
      return;
    }

    const rollSet = new Set<string>();
    for (let i = 0; i < members.length; i++) {
      const m = members[i];
      if (!m.name.trim() || !m.rollNumber.trim()) {
        setErrorMessage(`Please fill in Name and Roll Number for Member #${i + 1}.`);
        return;
      }

      const normRoll = MockDatabaseService.normalizeRollNumber(m.rollNumber);
      if (rollSet.has(normRoll)) {
        setErrorMessage(`Duplicate Roll Number "${normRoll}" detected in your squad.`);
        return;
      }
      rollSet.add(normRoll);
    }

    onSubmitTeamAndRegister(teamName.trim(), members);
  };

  return (
    <div className="w-full min-h-screen bg-[#05050a] text-white flex flex-col items-center justify-start py-6 sm:py-10 px-4 relative overflow-x-hidden">
      {/* Spider-Verse Ambient Glow */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-[#FF1E42]/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-[#FF6B00]/10 blur-[120px] pointer-events-none" />

      <div className="w-full max-w-2xl mx-auto space-y-6 relative z-10">
        {/* Navigation Bar */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={onBackToEventSelection}
            className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-stone-300 hover:text-white transition-colors cursor-pointer bg-[#110c20] px-3.5 py-1.5 rounded-xl border border-[#FF1E42]/30 shadow-md hover:border-[#FF1E42]"
          >
            <ArrowLeft className="w-4 h-4 text-[#FF1E42]" />
            <span>BACK TO ARENA</span>
          </button>

          <div className="flex items-center gap-1 text-[11px] font-mono font-bold text-[#FF6B00] bg-[#110c20] px-3 py-1 rounded-full border border-[#FF6B00]/30 shadow-md">
            <Sparkles className="w-3.5 h-3.5 text-[#FFE600]" />
            <span>Step 3: {event.isTeamEvent ? 'Squad Roster' : 'Confirmation'}</span>
          </div>
        </div>

        {/* Event Overview Banner */}
        <div className="p-5 rounded-3xl bg-gradient-to-r from-[#180922] via-[#090714] to-[#120516] text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xl border border-[#FF1E42]/30">
          <div>
            <span className="text-[10px] uppercase tracking-wider font-mono font-black text-[#FF6B00]">
              {event.category} ARENA
            </span>
            <h3 className="text-xl font-['Impact',sans-serif] text-white mt-0.5 uppercase tracking-wide">{event.title}</h3>
            <p className="text-xs text-stone-300">
              {event.venue} • {event.time}
            </p>
          </div>
          <div className="text-xs font-mono font-bold bg-white/5 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/10 self-start sm:self-auto">
            {event.isTeamEvent ? (
              <span className="text-[#FFE600]">
                Squad Requirement: {event.minTeamSize} to {event.maxTeamSize} Members
              </span>
            ) : (
              <span className="text-[#00F0FF]">Solo / Individual Participation</span>
            )}
          </div>
        </div>

        {errorMessage && (
          <div className="p-4 rounded-2xl bg-[#FF1E42]/10 border border-[#FF1E42]/40 text-[#FF1E42] text-xs font-medium flex items-start gap-2.5 shadow-md">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleValidateAndProceed} className="space-y-6">
          {/* Team Name Input */}
          {event.isTeamEvent && (
            <div className="card-spider-verse rounded-3xl p-6 border border-[#FF1E42]/30 shadow-lg space-y-2">
              <label htmlFor="team-name-input" className="text-xs font-mono font-bold text-stone-300 uppercase tracking-wider flex items-center gap-2">
                <Users className="w-4 h-4 text-[#FF1E42]" />
                <span>Squad / Team Name *</span>
              </label>
              <input
                id="team-name-input"
                name="teamName"
                type="text"
                required
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                placeholder="e.g. Spider Society"
                className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/20 text-white text-sm font-semibold focus:ring-2 focus:ring-[#FF1E42]/30 focus:border-[#FF1E42] focus:outline-none"
              />
            </div>
          )}

          {/* Member Cards List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-mono font-bold text-white flex items-center gap-2 uppercase tracking-wider">
                <span>{event.isTeamEvent ? 'Squad Roster' : 'Participant Details'}</span>
                <span className="text-xs font-normal text-stone-400">
                  ({members.length} {event.isTeamEvent ? `/ ${event.maxTeamSize} max` : ''})
                </span>
              </h3>

              {event.isTeamEvent && members.length < event.maxTeamSize && (
                <button
                  type="button"
                  onClick={handleAddMember}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#FF6B00]/20 hover:bg-[#FF6B00]/40 text-[#FFA500] text-xs font-mono font-bold border border-[#FF6B00]/40 transition-colors shadow-md cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>ADD TEAMMATE</span>
                </button>
              )}
            </div>

            {members.map((member, idx) => {
              const isSameCol = sameAsLeaderFlags[idx]?.college ?? true;
              const isSameDept = sameAsLeaderFlags[idx]?.dept ?? true;

              return (
                <div
                  key={idx}
                  className={`card-spider-verse rounded-3xl p-5 sm:p-6 border transition-all ${
                    member.isLeader
                      ? 'border-[#FF1E42] shadow-lg shadow-[#FF1E42]/20'
                      : 'border-white/10 shadow-md'
                  } space-y-4`}
                >
                  {/* Member Header */}
                  <div className="flex items-center justify-between pb-3 border-b border-white/10">
                    <div className="flex items-center gap-2">
                      {member.isLeader ? (
                        <span className="inline-flex items-center gap-1 text-xs font-mono font-bold px-3 py-1 rounded-full bg-[#FF1E42]/20 text-[#FF1E42] border border-[#FF1E42]/40">
                          <Crown className="w-3.5 h-3.5 text-[#FFE600]" />
                          <span>Squad Leader (You)</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-mono font-bold px-3 py-1 rounded-full bg-white/10 text-stone-300 border border-white/20">
                          <User className="w-3.5 h-3.5 text-stone-400" />
                          <span>Teammate #{idx + 1}</span>
                        </span>
                      )}
                    </div>

                    {!member.isLeader && (
                      <button
                        type="button"
                        onClick={() => handleRemoveMember(idx)}
                        className="p-1.5 rounded-lg text-stone-400 hover:text-[#FF1E42] hover:bg-[#FF1E42]/10 transition-colors cursor-pointer"
                        title="Remove Member"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {/* Inputs */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label htmlFor={`member-name-${idx}`} className="text-xs font-mono text-stone-300">
                        Full Name *
                      </label>
                      <input
                        id={`member-name-${idx}`}
                        type="text"
                        required
                        disabled={member.isLeader}
                        value={member.name}
                        onChange={(e) => handleMemberChange(idx, 'name', e.target.value)}
                        placeholder="e.g. Miles Morales"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/20 text-white text-xs font-semibold focus:border-[#FF1E42] focus:outline-none disabled:opacity-75"
                      />
                    </div>

                    <div className="space-y-1">
                      <label htmlFor={`member-roll-${idx}`} className="text-xs font-mono text-stone-300">
                        Roll / Reg Number *
                      </label>
                      <input
                        id={`member-roll-${idx}`}
                        type="text"
                        required
                        disabled={member.isLeader}
                        value={member.rollNumber}
                        onChange={(e) => handleMemberChange(idx, 'rollNumber', e.target.value.toUpperCase())}
                        placeholder="e.g. 2021CS042"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/20 text-white font-mono font-bold text-xs uppercase focus:border-[#FF1E42] focus:outline-none disabled:opacity-75"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-[#FF1E42] via-[#FF6B00] to-[#E000FF] hover:brightness-110 text-white font-mono font-black text-xs uppercase tracking-wider shadow-lg shadow-[#FF1E42]/40 flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition-all"
            >
              <span>PROCEED TO PAYMENT &amp; PASS MINTING</span>
              <ArrowRight className="w-4 h-4 text-white" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TeamBuilderFlow;
