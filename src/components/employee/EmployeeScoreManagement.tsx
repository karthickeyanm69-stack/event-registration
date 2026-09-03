import React, { useState } from 'react';
import {
  Trophy,
  Award,
  CheckCircle2,
  Lock,
  Edit3,
  Sparkles,
  AlertCircle,
  Save,
  User,
  Users,
} from 'lucide-react';
import { MockDatabaseService } from '../../data/mockDatabase';
import { Registration, ScoreCriteria, ScoreRecord, StaffUser } from '../../types';

interface EmployeeScoreManagementProps {
  staffUser: StaffUser;
  registrations: Registration[];
  scores: ScoreRecord[];
  onScoresUpdated: () => void;
}

export const EmployeeScoreManagement: React.FC<EmployeeScoreManagementProps> = ({
  staffUser,
  registrations,
  scores,
  onScoresUpdated,
}) => {
  // Assigned registrations
  const assignedRegistrations = registrations.filter((r) =>
    staffUser.assignedEventIds.length === 0 || staffUser.assignedEventIds.includes(r.eventId)
  );

  const [selectedRegId, setSelectedRegId] = useState<string>(
    assignedRegistrations[0]?.id || ''
  );

  const selectedReg = assignedRegistrations.find((r) => r.id === selectedRegId);

  // Find existing score or initialize
  const existingScore = scores.find((s) => s.registrationId === selectedRegId);

  const defaultCriteria: ScoreCriteria[] = [
    { name: 'Core Concept & Execution', maxMarks: 40, awardedMarks: 35 },
    { name: 'Technical Depth & Optimization', maxMarks: 30, awardedMarks: 25 },
    { name: 'Design / Modularity & Polish', maxMarks: 20, awardedMarks: 18 },
    { name: 'Presentation & Q&A Defense', maxMarks: 10, awardedMarks: 9 },
  ];

  const [criteria, setCriteria] = useState<ScoreCriteria[]>(
    existingScore?.criteria || defaultCriteria
  );
  const [feedback, setFeedback] = useState<string>(existingScore?.feedback || '');
  const [round, setRound] = useState<string>(existingScore?.round || 'Final Round');
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  // Sync state when selectedRegId changes
  const handleSelectRegistration = (regId: string) => {
    setSelectedRegId(regId);
    setSuccessNotice(null);
    const score = scores.find((s) => s.registrationId === regId);
    if (score) {
      setCriteria(score.criteria);
      setFeedback(score.feedback || '');
      setRound(score.round);
    } else {
      setCriteria(defaultCriteria);
      setFeedback('');
      setRound('Final Round');
    }
  };

  const handleMarkChange = (idx: number, newMark: number) => {
    setCriteria((prev) => {
      const updated = [...prev];
      const bounded = Math.max(0, Math.min(updated[idx].maxMarks, newMark));
      updated[idx] = { ...updated[idx], awardedMarks: bounded };
      return updated;
    });
  };

  const totalScore = criteria.reduce((sum, c) => sum + (Number(c.awardedMarks) || 0), 0);
  const maxPossible = criteria.reduce((sum, c) => sum + c.maxMarks, 0);

  const handleSaveScore = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReg) return;

    const scoreRecord: ScoreRecord = {
      id: existingScore?.id || `scr-${Date.now()}`,
      registrationId: selectedReg.id,
      eventId: selectedReg.eventId,
      teamOrParticipantName: selectedReg.teamName || selectedReg.leaderName,
      rollNumberOrTeamId: selectedReg.leaderRollNumber,
      criteria,
      totalScore,
      round,
      feedback: feedback.trim(),
      submittedByStaffId: staffUser.id,
      submittedByStaffName: staffUser.name,
      submittedAt: existingScore?.submittedAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isLocked: true,
    };

    MockDatabaseService.saveScore(scoreRecord, staffUser);
    setSuccessNotice(`Score of ${totalScore}/${maxPossible} recorded successfully for ${scoreRecord.teamOrParticipantName}!`);
    onScoresUpdated();
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-5">
      {/* Registration Picker Card */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-md space-y-3">
        <label className="text-xs font-bold text-[#002b66] flex items-center gap-2 uppercase tracking-wider">
          <Trophy className="w-4 h-4 text-teal-600" />
          <span>Select Participant / Team to Evaluate</span>
        </label>

        <select
          value={selectedRegId}
          onChange={(e) => handleSelectRegistration(e.target.value)}
          className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-300 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-teal-600 focus:bg-white focus:outline-none"
        >
          {assignedRegistrations.map((r) => {
            const hasScore = scores.some((s) => s.registrationId === r.id);
            return (
              <option key={r.id} value={r.id}>
                {r.teamName ? `[Team] ${r.teamName}` : `[Solo] ${r.leaderName}`} — {r.leaderRollNumber} ({r.eventTitle}) {hasScore ? '★ Scored' : '○ Pending'}
              </option>
            );
          })}
        </select>
      </div>

      {successNotice && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600" />
          <span>{successNotice}</span>
        </div>
      )}

      {selectedReg && (
        <form onSubmit={handleSaveScore} className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xl space-y-6">
          {/* Candidate Overview Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-200">
            <div>
              <span className="text-[10px] uppercase font-extrabold px-2.5 py-1 rounded bg-teal-50 text-teal-800 border border-teal-200">
                {selectedReg.eventTitle}
              </span>
              <h3 className="text-lg font-bold text-slate-900 mt-1.5">
                {selectedReg.teamName ? selectedReg.teamName : selectedReg.leaderName}
              </h3>
              <p className="text-xs text-slate-600 font-mono mt-0.5">
                Roll No: <span className="font-bold text-teal-700">{selectedReg.leaderRollNumber}</span> • {selectedReg.collegeName}
              </p>
            </div>

            {/* Total Score Meter */}
            <div className="p-3.5 rounded-2xl bg-teal-700 text-white text-center min-w-[90px] shadow-md border border-teal-800 shrink-0">
              <span className="text-[9px] uppercase tracking-widest text-teal-100 block font-bold">Total Score</span>
              <span className="text-2xl font-bold font-mono text-white">{totalScore}</span>
              <span className="text-[10px] text-teal-200 block font-medium">/ {maxPossible}</span>
            </div>
          </div>

          {/* Round Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Evaluation Round
            </label>
            <input
              type="text"
              value={round}
              onChange={(e) => setRound(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-teal-600 focus:outline-none"
            />
          </div>

          {/* Criteria Sliders & Numeric Inputs */}
          <div className="space-y-4 pt-1">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Evaluation Criteria Breakdown
              </h4>
              <span className="text-xs font-bold font-mono text-teal-700">
                Total: {totalScore}/{maxPossible}
              </span>
            </div>

            {criteria.map((c, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-900 text-sm">{c.name}</span>
                  <div className="flex items-center gap-1.5 font-mono">
                    <input
                      type="number"
                      min={0}
                      max={c.maxMarks}
                      value={c.awardedMarks}
                      onChange={(e) => handleMarkChange(idx, parseInt(e.target.value) || 0)}
                      className="w-16 px-2.5 py-1 text-center font-bold text-base bg-white rounded-lg border border-slate-300 text-teal-800 focus:ring-2 focus:ring-teal-600 focus:outline-none shadow-sm"
                    />
                    <span className="text-slate-500 font-bold text-sm">/ {c.maxMarks}</span>
                  </div>
                </div>

                <input
                  type="range"
                  min={0}
                  max={c.maxMarks}
                  value={c.awardedMarks}
                  onChange={(e) => handleMarkChange(idx, parseInt(e.target.value) || 0)}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-teal-600"
                />
              </div>
            ))}
          </div>

          {/* Feedback Notes */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Evaluator Feedback / Remarks
            </label>
            <textarea
              rows={3}
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="e.g. Excellent algorithmic structure, clear defense response..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs font-medium text-slate-900 placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-teal-600 focus:outline-none"
            />
          </div>

          {/* Save Button */}
          <button
            type="submit"
            className="w-full py-4 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm shadow-lg shadow-teal-600/30 flex items-center justify-center gap-2 cursor-pointer transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>Submit &amp; Lock Score ({totalScore}/100)</span>
          </button>
        </form>
      )}
    </div>
  );
};
