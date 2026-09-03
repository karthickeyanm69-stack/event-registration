import React, { useState } from 'react';
import {
  User,
  GraduationCap,
  Building,
  Calendar,
  Mail,
  Phone,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import { MockDatabaseService } from '../../data/mockDatabase';
import { Participant, Registration } from '../../types';

interface OnboardingDetailsFormProps {
  onBackToAccess: () => void;
  onContinueToEvents: (participantData: Partial<Participant>) => void;
  onRedirectToExistingDashboard: (participant: Participant, registration: Registration) => void;
}

export const OnboardingDetailsForm: React.FC<OnboardingDetailsFormProps> = ({
  onBackToAccess,
  onContinueToEvents,
  onRedirectToExistingDashboard,
}) => {
  const [name, setName] = useState('');
  const [collegeName, setCollegeName] = useState("St. Peter's Institute of Higher Education & Research");
  const [department, setDepartment] = useState('Dept. of Computer Science & Engineering');
  const [rollNumber, setRollNumber] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [existingRegNotice, setExistingRegNotice] = useState<{ participant: Participant; registration: Registration } | null>(null);

  const departments = [
    'Dept. of Computer Science & Engineering',
    'Dept. of Artificial Intelligence & Data Science',
    'Dept. of Information Technology',
    'Dept. of Electronics & Communication',
    'Dept. of Electrical & Electronics',
    'Dept. of Mechanical Engineering',
    'Dept. of Robotics & Automation',
    'Dept. of Civil Engineering',
    'Dept. of Management Studies (MBA)',
    'Other / Visiting Department',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setExistingRegNotice(null);

    const normRoll = MockDatabaseService.normalizeRollNumber(rollNumber);
    if (!normRoll) {
      setErrorMessage('Please enter a valid Roll Number or Register Number.');
      return;
    }

    if (!name.trim() || !dateOfBirth || !email.trim()) {
      setErrorMessage('Please fill in all mandatory onboarding fields.');
      return;
    }

    // Strict Backend Check: Check if roll number already has an active registration
    const check = MockDatabaseService.checkIsParticipantRegistered(normRoll);
    if (check.isRegistered && check.activeRegistration) {
      const participants = MockDatabaseService.getParticipants();
      const existingPart = participants.find((p) => MockDatabaseService.normalizeRollNumber(p.rollNumber) === normRoll);
      if (existingPart) {
        setExistingRegNotice({
          participant: existingPart,
          registration: check.activeRegistration,
        });
        return;
      }
    }

    const participantData: Partial<Participant> = {
      name: name.trim(),
      collegeName: collegeName.trim(),
      department: department.trim(),
      rollNumber: normRoll,
      dateOfBirth,
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
    };

    onContinueToEvents(participantData);
  };

  return (
    <div className="w-full max-w-lg mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <button
          type="button"
          onClick={onBackToAccess}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-teal-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Access</span>
        </button>

        <div className="flex items-center gap-1 text-xs font-bold text-teal-800 bg-teal-50 px-3 py-1 rounded-full border border-teal-200 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-teal-600" />
          <span>Step 1 of 3: Onboarding</span>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl space-y-6">
        <div className="border-b border-slate-100 pb-3">
          <h2 className="text-xl font-serif font-bold text-[#002b66]">
            Participant Onboarding
          </h2>
          <p className="text-xs text-slate-600 mt-1">
            Provide your basic institutional details for the official symposium record and QR pass.
          </p>
        </div>

        {/* Existing Registration Conflict Alert */}
        {existingRegNotice && (
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 space-y-3 animate-in fade-in duration-200">
            <div className="flex items-start gap-2.5">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-amber-900">
                  Already Registered for an Event
                </p>
                <p className="text-xs text-amber-800 mt-0.5">
                  Roll Number <strong className="font-mono">{existingRegNotice.participant.rollNumber}</strong> is already registered for{' '}
                  <strong className="underline">{existingRegNotice.registration.eventTitle}</strong>.
                </p>
                <p className="text-[11px] text-amber-700 mt-1">
                  Per the 1-Participant-1-Event rule, you cannot create a new registration. You can open your existing pass now.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onRedirectToExistingDashboard(existingRegNotice.participant, existingRegNotice.registration)}
              className="w-full py-2.5 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow flex items-center justify-center gap-2"
            >
              <span>Open My Existing Pass &amp; Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs font-medium flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#002b66] uppercase tracking-wider flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-teal-600" />
              <span>Full Name (As per College ID) *</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Alex Mercer"
              className="w-full px-3.5 py-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 text-sm font-semibold focus:bg-white focus:ring-2 focus:ring-teal-600 focus:border-teal-600 focus:outline-none"
            />
          </div>

          {/* Roll Number & Date of Birth (Grid) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#002b66] uppercase tracking-wider flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5 text-teal-600" />
                <span>Roll / Register No *</span>
              </label>
              <input
                type="text"
                required
                value={rollNumber}
                onChange={(e) => setRollNumber(e.target.value.toUpperCase())}
                placeholder="2021CS042"
                className="w-full px-3.5 py-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 text-sm font-mono font-bold tracking-wider focus:bg-white focus:ring-2 focus:ring-teal-600 focus:border-teal-600 focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#002b66] uppercase tracking-wider flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-teal-600" />
                <span>Date of Birth *</span>
              </label>
              <input
                type="date"
                required
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                className="w-full px-3.5 py-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-sm font-semibold focus:bg-white focus:ring-2 focus:ring-teal-600 focus:border-teal-600 focus:outline-none"
              />
            </div>
          </div>

          {/* College Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#002b66] uppercase tracking-wider flex items-center gap-1.5">
              <Building className="w-3.5 h-3.5 text-teal-600" />
              <span>College Name *</span>
            </label>
            <input
              type="text"
              required
              value={collegeName}
              onChange={(e) => setCollegeName(e.target.value)}
              className="w-full px-3.5 py-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-sm font-semibold focus:bg-white focus:ring-2 focus:ring-teal-600 focus:border-teal-600 focus:outline-none"
            />
          </div>

          {/* Department */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#002b66] uppercase tracking-wider">
              Department *
            </label>
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full px-3.5 py-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-sm font-semibold focus:bg-white focus:ring-2 focus:ring-teal-600 focus:border-teal-600 focus:outline-none"
            >
              {departments.map((dept) => (
                <option key={dept} value={dept} className="bg-white text-slate-900 font-semibold">
                  {dept}
                </option>
              ))}
            </select>
          </div>

          {/* Email & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#002b66] uppercase tracking-wider flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-teal-600" />
                <span>Email Address *</span>
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alex@college.edu"
                className="w-full px-3.5 py-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 text-sm font-semibold focus:bg-white focus:ring-2 focus:ring-teal-600 focus:border-teal-600 focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#002b66] uppercase tracking-wider flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-teal-600" />
                <span>Phone / WhatsApp</span>
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full px-3.5 py-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 text-sm font-semibold focus:bg-white focus:ring-2 focus:ring-teal-600 focus:border-teal-600 focus:outline-none"
              />
            </div>
          </div>

          {/* Continue Action */}
          <button
            type="submit"
            className="w-full mt-3 py-3.5 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm shadow-md shadow-teal-600/20 flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <span>Proceed to Event Selection</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
