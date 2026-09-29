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
  initialData?: Partial<Participant>;
  onBackToAccess: () => void;
  onContinueToEvents: (participantData: Partial<Participant>) => void;
  onRedirectToExistingDashboard: (participant: Participant, registration: Registration) => void;
}

export const OnboardingDetailsForm: React.FC<OnboardingDetailsFormProps> = ({
  initialData,
  onBackToAccess,
  onContinueToEvents,
  onRedirectToExistingDashboard,
}) => {
  const [name, setName] = useState(initialData?.name || '');
  const [collegeName, setCollegeName] = useState(
    initialData?.collegeName || "St. Peter's Institute of Higher Education & Research"
  );
  const [department, setDepartment] = useState(initialData?.department || 'Dept. of Information Technology');
  const [rollNumber, setRollNumber] = useState(initialData?.rollNumber || '');
  const [dateOfBirth, setDateOfBirth] = useState(initialData?.dateOfBirth || '');
  const [email, setEmail] = useState(initialData?.email || '');
  const [phone, setPhone] = useState(initialData?.phone || '');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [existingRegNotice, setExistingRegNotice] = useState<{ participant: Participant; registration: Registration } | null>(null);

  const handleAutoFillDemo = () => {
    const randomRoll = `RAD26-IT${Math.floor(100 + Math.random() * 900)}`;
    setName(name || 'Miles Morales');
    setRollNumber(randomRoll);
    setDateOfBirth('2004-05-14');
    setEmail(email || `${randomRoll.toLowerCase()}@spiher.edu.in`);
    setPhone(phone || '+91 98765 43210');
    setErrorMessage(null);
  };

  const departments = [
    'Dept. of Information Technology',
    'Dept. of Artificial Intelligence & Data Science',
    'Dept. of Computer Science & Engineering',
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

    onContinueToEvents({
      name: name.trim(),
      collegeName: collegeName.trim(),
      department: department.trim(),
      rollNumber: normRoll,
      dateOfBirth: dateOfBirth.trim(),
      email: email.trim(),
      phone: phone.trim() || undefined,
    });
  };

  return (
    <div className="w-full min-h-screen bg-[#05050a] text-white flex flex-col items-center justify-center p-3 sm:p-6 select-none relative overflow-x-hidden">
      {/* Multiverse Ambient Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-[#FF1E42]/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-[#FF6B00]/10 blur-[120px] pointer-events-none" />

      <div className="w-full max-w-4xl bg-[#090714] rounded-3xl sm:rounded-[2.5rem] shadow-2xl border border-[#FF1E42]/30 overflow-hidden grid grid-cols-1 lg:grid-cols-12 relative z-10">
        {/* ========================================================================= */}
        {/* LEFT PROGRESS & SYMPOSIUM OVERVIEW HERO (Visible ONLY on Desktop lg+)    */}
        {/* ========================================================================= */}
        <div className="hidden lg:flex lg:col-span-5 bg-gradient-to-br from-[#12061e] via-[#090714] to-[#05050a] text-white p-8 sm:p-10 flex-col justify-between relative overflow-hidden border-r border-[#FF1E42]/20">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#FF1E42]/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#FF6B00]/20 rounded-full blur-2xl pointer-events-none" />

          {/* Top Brand Header */}
          <div className="relative z-10 space-y-4">
            <button
              type="button"
              onClick={onBackToAccess}
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-[#FF1E42] backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/15 text-xs font-mono font-bold text-white transition-all cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-[#FF6B00]" />
              <span>Back to Portal</span>
            </button>

            <div className="flex items-center gap-3 pt-2">
              <CollegeEmblem size={44} />
              <div>
                <h1 className="font-['Impact',sans-serif] text-xl leading-tight tracking-tight text-white uppercase">
                  RADIANZA <span className="text-[#FF1E42]">'26</span>
                </h1>
                <p className="text-[11px] text-[#FF6B00] font-mono font-bold tracking-wide">
                  Across The Tech-Verse
                </p>
                <p className="text-[9px] text-stone-400 uppercase tracking-wider">
                  SPIHER IT Registration Matrix
                </p>
              </div>
            </div>
          </div>

          {/* Center 3-Step Timeline Progression */}
          <div className="relative z-10 space-y-4 py-6">
            <h2 className="text-xl sm:text-2xl font-['Impact',sans-serif] text-white uppercase tracking-wide">
              DELEGATE ONBOARDING
            </h2>
            <p className="text-xs text-stone-300 leading-relaxed">
              Complete your profile to unlock full arena competition access and mint your verified digital QR pass.
            </p>

            <div className="space-y-3 pt-3">
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#FF1E42]/15 border border-[#FF1E42]/40 text-xs shadow-md">
                <div className="w-7 h-7 rounded-xl bg-[#FF1E42] text-white font-bold flex items-center justify-center shrink-0 shadow">
                  1
                </div>
                <div>
                  <span className="font-bold text-white block text-xs">Delegate Details</span>
                  <span className="text-[10px] text-[#FF6B00] font-mono">Name, Roll No, DOB &amp; College</span>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/10 text-xs opacity-70">
                <div className="w-7 h-7 rounded-xl bg-white/10 text-stone-400 font-bold flex items-center justify-center shrink-0">
                  2
                </div>
                <div>
                  <span className="font-bold text-stone-300 block text-xs">Arena Selection</span>
                  <span className="text-[10px] text-stone-400">Technical &amp; Non-Technical Arenas</span>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/10 text-xs opacity-70">
                <div className="w-7 h-7 rounded-xl bg-white/10 text-stone-400 font-bold flex items-center justify-center shrink-0">
                  3
                </div>
                <div>
                  <span className="font-bold text-stone-300 block text-xs">Pass Minting</span>
                  <span className="text-[10px] text-stone-400">Cryptographic QR Pass Access</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Security Footer */}
          <div className="relative z-10 pt-4 border-t border-white/10 flex items-center justify-between text-[11px] text-stone-400 font-mono">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#FF1E42]" />
              <span>1-Participant-1-Event Rule</span>
            </div>
            <span className="text-[10px] text-[#FF6B00]">Free Access Pass</span>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* RIGHT INTERACTIVE ONBOARDING FORM                                         */}
        {/* ========================================================================= */}
        <div className="lg:col-span-7 p-5 sm:p-8 lg:p-10 flex flex-col justify-center space-y-5 sm:space-y-6">
          {/* Mobile Navigation Header */}
          <div className="lg:hidden flex items-center justify-between pb-3 border-b border-white/10">
            <button
              type="button"
              onClick={onBackToAccess}
              className="flex items-center gap-1.5 text-xs font-mono font-bold text-stone-300 hover:text-white transition-colors cursor-pointer bg-white/5 px-2.5 py-1.5 rounded-xl border border-white/10"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-[#FF1E42]" />
              <span>Back</span>
            </button>

            <div className="flex items-center gap-1 text-[10px] font-mono font-bold text-[#FF6B00] bg-[#FF6B00]/10 px-2.5 py-1 rounded-full border border-[#FF6B00]/30">
              <Sparkles className="w-3 h-3" />
              <span>Step 1: Onboarding</span>
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#FF1E42]/10 text-[#FF1E42] border border-[#FF1E42]/30">
                Step 1 of 3: Profile Setup
              </span>
              <button
                type="button"
                onClick={handleAutoFillDemo}
                className="text-[11px] font-mono font-bold text-[#FF287D] hover:text-white bg-[#1a041c] hover:bg-[#FF1E42]/30 px-2.5 py-1 rounded-lg border border-[#FF1E42]/40 transition-colors cursor-pointer flex items-center gap-1"
                title="Auto-fill form with test registration data"
              >
                <Sparkles className="w-3 h-3 text-[#FFE600]" />
                <span>Auto-Fill Demo Data</span>
              </button>
            </div>
            <h3 className="text-xl sm:text-2xl font-['Impact',sans-serif] text-white uppercase tracking-wide">
              PERSONAL &amp; ACADEMIC PROFILE
            </h3>
            <p className="text-xs text-stone-400">
              Provide your details for the symposium registry and digital entry badge.
            </p>
          </div>

          {/* Existing Registration Conflict Alert */}
          {existingRegNotice && (
            <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-500/50 space-y-3 animate-in fade-in duration-200">
              <div className="flex items-start gap-2.5">
                <AlertCircle className="w-5 h-5 text-[#FFE600] shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-[#FFE600]">
                    Already Registered for an Arena
                  </p>
                  <p className="text-xs text-stone-300 mt-0.5">
                    Roll Number <strong className="font-mono text-white">{existingRegNotice.participant.rollNumber}</strong> is already registered for{' '}
                    <strong className="underline text-[#FF6B00]">{existingRegNotice.registration.eventTitle}</strong>.
                  </p>
                  <p className="text-[11px] text-stone-400 mt-1">
                    Per the 1-Participant-1-Event rule, you cannot create a new registration. You can open your existing pass now.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onRedirectToExistingDashboard(existingRegNotice.participant, existingRegNotice.registration)}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#FF6B00] to-[#FF1E42] text-white text-xs font-mono font-bold shadow-md flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <span>OPEN EXISTING PASS &amp; DASHBOARD</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {errorMessage && (
            <div className="p-3.5 rounded-2xl bg-[#FF1E42]/10 border border-[#FF1E42]/40 text-[#FF1E42] text-xs font-medium flex items-center gap-2.5 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div className="space-y-1.5">
              <label htmlFor="onboarding-name" className="text-xs font-mono font-bold text-stone-300 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-[#FF1E42]" />
                <span>Full Name (As per College ID) <span className="text-[#FF1E42]">*</span></span>
              </label>
              <input
                id="onboarding-name"
                name="fullName"
                type="text"
                autoComplete="name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Alex Mercer"
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/20 text-white placeholder-stone-500 text-sm focus:ring-2 focus:ring-[#FF1E42]/30 focus:border-[#FF1E42] focus:outline-none transition-all shadow-inner"
              />
            </div>

            {/* Roll Number & Date of Birth */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="space-y-1.5">
                <label htmlFor="onboarding-roll" className="text-xs font-mono font-bold text-stone-300 flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-[#FF6B00]" />
                  <span>Roll / Reg No <span className="text-[#FF1E42]">*</span></span>
                </label>
                <input
                  id="onboarding-roll"
                  name="rollNumber"
                  type="text"
                  required
                  value={rollNumber}
                  onChange={(e) => setRollNumber(e.target.value.toUpperCase())}
                  placeholder="e.g. 2021CS042"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/20 text-white font-mono font-bold placeholder-stone-500 text-sm focus:ring-2 focus:ring-[#FF1E42]/30 focus:border-[#FF1E42] focus:outline-none transition-all uppercase shadow-inner"
                />
              </div>

              <div className="space-y-1.5">
                <CustomDatePicker
                  id="onboarding-dob"
                  name="dateOfBirth"
                  value={dateOfBirth}
                  onChange={setDateOfBirth}
                  label="Date of Birth"
                  placeholder="Select Date of Birth"
                  required
                />
              </div>
            </div>

            {/* College & Department */}
            <div className="space-y-3.5">
              <div className="space-y-1.5">
                <CustomSelect
                  id="onboarding-college"
                  name="collegeName"
                  value={collegeName}
                  onChange={setCollegeName}
                  options={collegeList}
                  label="Institution / University"
                  icon={<Building className="w-3.5 h-3.5 text-[#FF1E42]" />}
                />
              </div>

              <div className="space-y-1.5">
                <CustomSelect
                  id="onboarding-dept"
                  name="department"
                  value={department}
                  onChange={setDepartment}
                  options={departments}
                  label="Department / Branch"
                  icon={<GraduationCap className="w-3.5 h-3.5 text-[#FF6B00]" />}
                />
              </div>
            </div>

            {/* Email & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="space-y-1.5">
                <label htmlFor="onboarding-email" className="text-xs font-mono font-bold text-stone-300 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-[#FF1E42]" />
                  <span>Email Address <span className="text-[#FF1E42]">*</span></span>
                </label>
                <input
                  id="onboarding-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex@example.com"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/20 text-white placeholder-stone-500 text-sm focus:ring-2 focus:ring-[#FF1E42]/30 focus:border-[#FF1E42] focus:outline-none transition-all shadow-inner"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="onboarding-phone" className="text-xs font-mono font-bold text-stone-300 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-[#FF6B00]" />
                  <span>Phone Number</span>
                </label>
                <input
                  id="onboarding-phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/20 text-white placeholder-stone-500 text-sm focus:ring-2 focus:ring-[#FF1E42]/30 focus:border-[#FF1E42] focus:outline-none transition-all shadow-inner"
                />
              </div>
            </div>

            {/* Submit Action */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#FF1E42] via-[#FF6B00] to-[#E000FF] hover:brightness-110 text-white font-mono font-black text-xs uppercase tracking-wider shadow-lg shadow-[#FF1E42]/40 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95"
              >
                <span>CONTINUE TO EVENT MATRIX</span>
                <ArrowRight className="w-4 h-4 text-white" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OnboardingDetailsForm;
