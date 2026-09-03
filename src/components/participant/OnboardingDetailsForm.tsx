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
  CreditCard,
  CheckCircle2,
  Layers,
  Award,
} from 'lucide-react';
import { MockDatabaseService } from '../../data/mockDatabase';
import { Participant, Registration } from '../../types';
import { CustomSelect } from '../common/CustomSelect';
import { CustomDatePicker } from '../common/CustomDatePicker';
import { CollegeLogo, CollegeEmblem } from '../common/CollegeLogo';

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

  const collegeList = [
    "St. Peter's Institute of Higher Education & Research",
    'Anna University, CEG Campus',
    'Madras Institute of Technology (MIT)',
    'SRM Institute of Science and Technology',
    'SSN College of Engineering',
    'Vellore Institute of Technology (VIT)',
    'PSG College of Technology',
    'Sathyabama Institute of Science and Technology',
    'Rajalakshmi Engineering College',
    'Other Affiliated / Partner Institution',
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
    <div className="min-h-screen w-full bg-slate-50 flex items-center justify-center p-3 sm:p-6 lg:p-10 font-sans selection:bg-[#0077c8] selection:text-white">
      {/* Main Split-Hero Card Container */}
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-[0_25px_60px_-15px_rgba(0,43,102,0.15)] border border-[#d4e8f5] overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-auto lg:min-h-[620px]">
        {/* ========================================================================= */}
        {/* LEFT PROGRESS & SYMPOSIUM OVERVIEW HERO (Visible ONLY on Desktop lg+)    */}
        {/* ========================================================================= */}
        <div className="hidden lg:flex lg:col-span-5 bg-gradient-to-br from-[#001f4d] via-[#002b66] to-[#001838] text-white p-8 sm:p-10 flex-col justify-between relative overflow-hidden">
          {/* Luminous Ambient Glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#0077c8]/25 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#00a887]/20 rounded-full blur-2xl pointer-events-none" />

          {/* Top Brand Header */}
          <div className="relative z-10 space-y-4">
            <button
              type="button"
              onClick={onBackToAccess}
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/15 text-xs font-bold text-white transition-all cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-[#7af1fc]" />
              <span>Back to Pass Access</span>
            </button>

            <div className="flex items-center gap-3 pt-2">
              <CollegeEmblem size={44} />
              <div>
                <h1 className="font-serif font-bold text-lg leading-tight tracking-tight text-white">
                  St. Peter's
                </h1>
                <p className="text-[11px] text-[#7af1fc] font-medium tracking-wide">
                  Institute of Higher Education &amp; Research
                </p>
                <p className="text-[9px] text-white/60 uppercase tracking-wider">
                  IGNITE 2026 Registration
                </p>
              </div>
            </div>
          </div>

          {/* Center 3-Step Timeline Progression */}
          <div className="relative z-10 space-y-4 py-6">
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-white leading-snug">
              Student Registration
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              Complete your profile to unlock full competition access and mint your verified digital QR badge.
            </p>

            {/* 3-Step Process Indicator */}
            <div className="space-y-3 pt-3">
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/15 border border-[#7af1fc]/40 text-xs">
                <div className="w-7 h-7 rounded-xl bg-[#0077c8] text-white font-bold flex items-center justify-center shrink-0 shadow">
                  1
                </div>
                <div>
                  <span className="font-bold text-white block text-xs">Student Details</span>
                  <span className="text-[10px] text-[#7af1fc]">Name, Roll No, DOB &amp; College</span>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/10 text-xs opacity-70">
                <div className="w-7 h-7 rounded-xl bg-white/10 text-slate-300 font-bold flex items-center justify-center shrink-0">
                  2
                </div>
                <div>
                  <span className="font-bold text-slate-200 block text-xs">Competition Selection</span>
                  <span className="text-[10px] text-slate-400">Technical &amp; Non-Technical Events</span>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/10 text-xs opacity-70">
                <div className="w-7 h-7 rounded-xl bg-white/10 text-slate-300 font-bold flex items-center justify-center shrink-0">
                  3
                </div>
                <div>
                  <span className="font-bold text-slate-200 block text-xs">Pass Minting</span>
                  <span className="text-[10px] text-slate-400">Vector QR Pass Download</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Security Footer */}
          <div className="relative z-10 pt-4 border-t border-white/15 flex items-center justify-between text-[11px] text-white/70">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#7af1fc]" />
              <span>1-Participant-1-Event Rule</span>
            </div>
            <span className="text-[10px] text-white/50">Free Registration</span>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* RIGHT INTERACTIVE ONBOARDING FORM                                         */}
        {/* ========================================================================= */}
        <div className="lg:col-span-7 p-5 sm:p-8 lg:p-10 flex flex-col justify-center space-y-5 sm:space-y-6">
          {/* Mobile Navigation Header */}
          <div className="lg:hidden flex items-center justify-between pb-3 border-b border-[#e8f5fb]">
            <button
              type="button"
              onClick={onBackToAccess}
              className="flex items-center gap-1.5 text-xs font-bold text-[#002b66] hover:text-[#0077c8] transition-colors cursor-pointer bg-slate-50 px-2.5 py-1.5 rounded-xl border border-[#d4e8f5]"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-[#0077c8]" />
              <span>Back</span>
            </button>

            <div className="flex items-center gap-1 text-[10px] font-bold text-[#0077c8] bg-[#e8f5fb] px-2.5 py-1 rounded-full border border-[#d4e8f5]">
              <Sparkles className="w-3 h-3" />
              <span>Step 1 of 3: Onboarding</span>
            </div>
          </div>

          <div className="space-y-1">
            <div className="hidden lg:flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#e8f5fb] text-[#0077c8] border border-[#d4e8f5]">
                Step 1 of 3: Profile Setup
              </span>
              <span className="text-xs text-slate-400 font-medium">All fields with * are required</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#002b66]">
              Personal &amp; College Details
            </h3>
            <p className="text-xs text-slate-500">
              Provide your details for the symposium registry and digital entry badge.
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
                className="w-full py-2.5 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <span>Open My Existing Pass &amp; Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {errorMessage && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium flex items-center gap-2.5 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#002b66] flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-[#0077c8]" />
                <span>Full Name (As per College ID) <span className="text-rose-500">*</span></span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Alex Mercer"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-[#d4e8f5] text-[#002b66] placeholder-slate-400 text-sm focus:ring-2 focus:ring-[#0077c8]/20 focus:border-[#0077c8] focus:bg-white focus:outline-none transition-all shadow-xs"
              />
            </div>

            {/* Roll Number & Date of Birth (Grid) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#002b66] flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5 text-[#0077c8]" />
                  <span>Roll / Register No <span className="text-rose-500">*</span></span>
                </label>
                <input
                  type="text"
                  required
                  value={rollNumber}
                  onChange={(e) => setRollNumber(e.target.value.toUpperCase())}
                  placeholder="2021CS042"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-[#d4e8f5] text-[#002b66] placeholder-slate-400 text-sm font-mono tracking-wider focus:ring-2 focus:ring-[#0077c8]/20 focus:border-[#0077c8] focus:bg-white focus:outline-none transition-all shadow-xs uppercase"
                />
              </div>

              {/* Modern Custom Date Picker with right-aligned popover */}
              <div className="space-y-1.5">
                <CustomDatePicker
                  value={dateOfBirth}
                  onChange={setDateOfBirth}
                  label="Date of Birth"
                  placeholder="Select Date of Birth"
                  required
                  align="right"
                />
              </div>
            </div>

            {/* College Name Custom Select */}
            <div className="space-y-1.5">
              <CustomSelect
                label="College / Institution *"
                icon={<Building className="w-3.5 h-3.5 text-[#0077c8]" />}
                options={collegeList}
                value={collegeName}
                onChange={setCollegeName}
                searchable
              />
            </div>

            {/* Department Custom Select */}
            <div className="space-y-1.5">
              <CustomSelect
                label="Department / Specialization *"
                icon={<GraduationCap className="w-3.5 h-3.5 text-[#0077c8]" />}
                options={departments}
                value={department}
                onChange={setDepartment}
                searchable
              />
            </div>

            {/* Email & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#002b66] flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-[#0077c8]" />
                  <span>Email Address <span className="text-rose-500">*</span></span>
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex@college.edu"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-[#d4e8f5] text-[#002b66] placeholder-slate-400 text-sm focus:ring-2 focus:ring-[#0077c8]/20 focus:border-[#0077c8] focus:bg-white focus:outline-none transition-all shadow-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#002b66] flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-[#0077c8]" />
                  <span>Phone / WhatsApp</span>
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-[#d4e8f5] text-[#002b66] placeholder-slate-400 text-sm focus:ring-2 focus:ring-[#0077c8]/20 focus:border-[#0077c8] focus:bg-white focus:outline-none transition-all shadow-xs"
                />
              </div>
            </div>

            {/* Continue Action Button */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-[#002b66] to-[#0077c8] hover:from-[#001f4d] hover:to-[#005fa3] text-white font-bold text-xs sm:text-sm shadow-lg shadow-[#0077c8]/25 flex items-center justify-center gap-2 transition-all cursor-pointer hover:scale-[1.01] active:scale-[0.98]"
              >
                <span>Proceed to Competition Selection</span>
                <ArrowRight className="w-4 h-4 text-[#7af1fc]" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OnboardingDetailsForm;
