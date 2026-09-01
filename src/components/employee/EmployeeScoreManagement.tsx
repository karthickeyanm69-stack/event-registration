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
      <div className="bg-white dark:bg-primary-container p-5 rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-lg space-y-3">
        <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
          <Trophy className="w-4 h-4 text-secondary" />
          <span>Select Participant / Team to Evaluate</span>
        </label>

        <select
          value={selectedRegId}
          onChange={(e) => handleSelectRegistration(e.target.value)}
          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-primary/60 border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-secondary focus:outline-none"
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
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-700 text-emerald-900 dark:text-emerald-200 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" />
          <span>{successNotice}</span>
        </div>
      )}

      {selectedReg && (
        <form onSubmit={handleSaveScore} className="bg-white dark:bg-primary-container rounded-3xl p-6 border border-slate-200/80 dark:border-white/10 shadow-xl space-y-5">
          {/* Candidate Overview Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-white/10">
            <div>
              <span className="text-[10px] uppercase font-bold text-secondary">{selectedReg.eventTitle}</span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {selectedReg.teamName ? selectedReg.teamName : selectedReg.leaderName}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                {selectedReg.leaderRollNumber} • {selectedReg.collegeName}
              </p>
            </div>

            {/* Total Score Meter */}
            <div className="p-3 rounded-2xl bg-primary text-white text-center min-w-[80px] shadow-md border border-white/15">
              <span className="text-[9px] uppercase tracking-wider text-slate-400 block">Total</span>
              <span className="text-2xl font-bold font-mono text-secondary-fixed">{totalScore}</span>
              <span className="text-[9px] text-slate-400 block">/ {maxPossible}</span>
            </div>
          </div>

          {/* Round Selector */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Evaluation Round
            </label>
            <input
              type="text"
              value={round}
              onChange={(e) => setRound(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-primary/60 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white"
            />
          </div>

          {/* Criteria Sliders & Numeric Inputs */}
          <div className="space-y-4 pt-1">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Evaluation Criteria Breakdown
            </h4>

            {criteria.map((c, idx) => (
              <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800 dark:text-slate-200">{c.name}</span>
                  <div className="flex items-center gap-1.5 font-mono">
                    <input
                      type="number"
                      min={0}
                      max={c.maxMarks}
                      value={c.awardedMarks}
                      onChange={(e) => handleMarkChange(idx, parseInt(e.target.value) || 0)}
                      className="w-14 px-2 py-1 text-center font-bold text-sm bg-white dark:bg-primary rounded-lg border border-slate-300 dark:border-white/20 text-secondary focus:outline-none"
                    />
                    <span className="text-slate-400">/ {c.maxMarks}</span>
                  </div>
                </div>

                <input
                  type="range"
                  min={0}
                  max={c.maxMarks}
                  value={c.awardedMarks}
                  onChange={(e) => handleMarkChange(idx, parseInt(e.target.value) || 0)}
                  className="w-full h-1.5 bg-slate-200 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-secondary"
                />
              </div>
            ))}
          </div>

          {/* Feedback Notes */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Evaluator Feedback / Remarks
            </label>
            <textarea
              rows={2}
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="e.g. Excellent algorithmic structure, clear defense response..."
              className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-primary/60 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-secondary focus:outline-none"
            />
          </div>

          {/* Save Button */}
          <button
            type="submit"
            className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-secondary to-secondary-container text-primary font-bold text-xs shadow-lg shadow-secondary/30 flex items-center justify-center gap-2 hover:opacity-95 transition-opacity"
          >
            <Save className="w-4 h-4" />
            <span>Submit & Lock Score ({totalScore}/100)</span>
          </button>
        </form>
      )}
    </div>
  );
};
