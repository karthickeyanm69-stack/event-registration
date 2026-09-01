import React from 'react';
import {
  MapPin,
  FileText,
  Utensils,
  Download,
  X,
  CheckCircle2,
  Building2,
  Sparkles,
} from 'lucide-react';
import { QuickResource } from '../types';
import { CollegeEmblem } from './common/CollegeLogo';

interface ResourceModalProps {
  resource: QuickResource | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ResourceModal: React.FC<ResourceModalProps> = ({ resource, isOpen, onClose }) => {
  if (!isOpen || !resource) return null;

  return (
    <div
      id="resource-modal-overlay"
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        id="resource-modal-content"
        className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl max-h-[85vh] flex flex-col overflow-hidden shadow-2xl border border-[#d4e8f5] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#e8f5fb] flex items-center justify-between bg-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#e8f5fb] text-[#0077c8] flex items-center justify-center shrink-0">
              {resource.type === 'map' ? (
                <MapPin className="w-5 h-5" />
              ) : resource.type === 'pdf' ? (
                <FileText className="w-5 h-5" />
              ) : (
                <Utensils className="w-5 h-5" />
              )}
            </div>
            <div>
              <h3 className="text-base font-bold text-[#002b66]">{resource.title}</h3>
              <p className="text-xs text-slate-500">{resource.subtitle}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content depending on resource type */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 flex flex-col gap-4 text-xs text-slate-700">
          {resource.type === 'map' && (
            <div className="flex flex-col gap-3">
              <div className="bg-[#f8fbfe] border border-[#d4e8f5] rounded-2xl p-4 flex flex-col items-center justify-center min-h-[140px] text-center">
                <Building2 className="w-8 h-8 text-[#0077c8] mb-2" />
                <p className="font-bold text-[#002b66] text-sm">St. Peter's Campus Venues</p>
                <p className="text-[11px] text-slate-500">North &amp; South Academic Blocks</p>
              </div>

              <div className="space-y-2">
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex justify-between items-center">
                  <div>
                    <span className="font-bold text-[#002b66] block">Main Auditorium (Block C)</span>
                    <span className="text-[11px] text-slate-500">Inauguration, Quiz &amp; Valedictory</span>
                  </div>
                  <span className="text-[#0077c8] font-bold text-[11px] bg-[#e8f5fb] px-2 py-0.5 rounded-full border border-[#d4e8f5]">Level 1</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex justify-between items-center">
                  <div>
                    <span className="font-bold text-[#002b66] block">Computing Annex Lab 1 &amp; 2</span>
                    <span className="text-[11px] text-slate-500">Code-A-Thon, Web Craft &amp; Bug Hunter</span>
                  </div>
                  <span className="text-[#0077c8] font-bold text-[11px] bg-[#e8f5fb] px-2 py-0.5 rounded-full border border-[#d4e8f5]">Level 2</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex justify-between items-center">
                  <div>
                    <span className="font-bold text-[#002b66] block">Indoor Robotics Arena</span>
                    <span className="text-[11px] text-slate-500">Robo-Sumo Clash &amp; Esports Arena</span>
                  </div>
                  <span className="text-[#00a887] font-bold text-[11px] bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">Grounds</span>
                </div>
              </div>
            </div>
          )}

          {resource.type === 'pdf' && (
            <div className="flex flex-col gap-3">
              <div className="p-4 bg-[#f8fbfe] rounded-2xl border border-[#d4e8f5] flex items-center gap-3">
                <FileText className="w-8 h-8 text-[#0077c8] shrink-0" />
                <div>
                  <h4 className="font-bold text-[#002b66] text-sm">SPIHER_IGNITE_2024_Rulebook.pdf</h4>
                  <p className="text-[11px] text-slate-500">Official Guidelines &amp; Code of Conduct • 2.4 MB</p>
                </div>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <p className="font-bold text-[#002b66]">Key Instructions:</p>
                <ul className="list-disc pl-4 space-y-1.5 text-slate-600 text-[11px]">
                  <li>Institutional ID card and digital QR pass must be presented at entrance gate.</li>
                  <li>Technical presentations should be submitted to jury coordinators prior to start.</li>
                  <li>E-Certificates are issued post-event to all verified attendees.</li>
                </ul>
              </div>

              <button
                onClick={() => {
                  alert('Downloading official SPIHER IGNITE 2024 rulebook PDF...');
                }}
                className="w-full bg-[#0077c8] hover:bg-[#0066ad] text-white py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-[#0077c8]/20 transition-all cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Download Rulebook (.PDF)</span>
              </button>
            </div>
          )}

          {resource.type === 'token' && (
            <div className="flex flex-col items-center text-center gap-3 py-2">
              <div className="w-16 h-16 rounded-2xl bg-[#e8f5fb] text-[#0077c8] flex items-center justify-center border border-[#d4e8f5]">
                <Utensils className="w-8 h-8" />
              </div>
              <div>
                <h4 className="text-base font-bold text-[#002b66]">Complimentary Lunch Token</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Valid at Dining Hall 1 &amp; Dining Hall 2 (12:30 PM - 02:30 PM)
                </p>
              </div>

              <div className="w-full p-4 bg-[#f8fbfe] rounded-2xl border border-dashed border-[#0077c8]/40 flex flex-col items-center">
                <span className="text-[10px] uppercase font-bold text-[#0077c8] tracking-wider mb-1">
                  Food Coupon Token
                </span>
                <span className="font-mono text-xl font-bold text-[#002b66] tracking-widest">
                  #MEAL-SPIHER-88421
                </span>
                <span className="text-[11px] text-emerald-700 font-bold mt-2 flex items-center gap-1.5 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Verified &amp; Ready for gate pass presentation
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3.5 bg-white border-t border-[#e8f5fb] text-center">
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
