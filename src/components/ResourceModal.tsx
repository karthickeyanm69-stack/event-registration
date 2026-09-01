import React from 'react';
import { QuickResource } from '../types';

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
      className="fixed inset-0 z-50 bg-primary/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        id="resource-modal-content"
        className="bg-surface-container-lowest w-full max-w-md rounded-t-2xl sm:rounded-2xl max-h-[85vh] flex flex-col overflow-hidden shadow-2xl border border-outline-variant/60 animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-outline-variant/40 flex items-center justify-between bg-surface-container-low">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">{resource.icon}</span>
            </div>
            <div>
              <h3 className="font-serif text-base font-bold text-primary">{resource.title}</h3>
              <p className="text-xs text-on-surface-variant">{resource.subtitle}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-surface-container-highest text-on-surface-variant flex items-center justify-center transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Content depending on resource type */}
        <div className="p-5 overflow-y-auto flex-1 flex flex-col gap-4 text-xs text-on-surface">
          {resource.type === 'map' && (
            <div className="flex flex-col gap-3">
              <div className="bg-surface-variant/40 border border-outline-variant rounded-xl p-3 flex flex-col items-center justify-center min-h-[160px] text-center">
                <span className="material-symbols-outlined text-4xl text-secondary mb-2">
                  map
                </span>
                <p className="font-semibold text-primary">St. Peter's Institute Campus Layout</p>
                <p className="text-[11px] text-on-surface-variant">North & South Academic Blocks</p>
              </div>

              <div className="space-y-2">
                <div className="p-2.5 bg-surface rounded-lg border border-outline-variant/30 flex justify-between items-center">
                  <div>
                    <span className="font-bold text-primary block">Main Auditorium (Block C)</span>
                    <span className="text-[11px] text-on-surface-variant">Keynotes & Technical Symposium</span>
                  </div>
                  <span className="text-secondary font-bold text-[11px]">Level 1</span>
                </div>
                <div className="p-2.5 bg-surface rounded-lg border border-outline-variant/30 flex justify-between items-center">
                  <div>
                    <span className="font-bold text-primary block">Main Lab 1 & 2 (Block A)</span>
                    <span className="text-[11px] text-on-surface-variant">Code-A-Thon & Hackathon</span>
                  </div>
                  <span className="text-secondary font-bold text-[11px]">Level 2</span>
                </div>
                <div className="p-2.5 bg-surface rounded-lg border border-outline-variant/30 flex justify-between items-center">
                  <div>
                    <span className="font-bold text-primary block">Engineering Quad</span>
                    <span className="text-[11px] text-on-surface-variant">Robo-Sumo Arena</span>
                  </div>
                  <span className="text-secondary font-bold text-[11px]">Grounds</span>
                </div>
                <div className="p-2.5 bg-surface rounded-lg border border-outline-variant/30 flex justify-between items-center">
                  <div>
                    <span className="font-bold text-primary block">Design Studio B</span>
                    <span className="text-[11px] text-on-surface-variant">Canvas Chronicles</span>
                  </div>
                  <span className="text-secondary font-bold text-[11px]">Block B</span>
                </div>
              </div>
            </div>
          )}

          {resource.type === 'pdf' && (
            <div className="flex flex-col gap-3">
              <div className="p-4 bg-surface-container-low rounded-xl border border-outline-variant/40 flex items-center gap-3">
                <span className="material-symbols-outlined text-3xl text-secondary">
                  description
                </span>
                <div>
                  <h4 className="font-bold text-primary text-sm">Symposium_Guidelines_2024.pdf</h4>
                  <p className="text-[11px] text-on-surface-variant">Official Rulebook & Code of Conduct • 2.4 MB</p>
                </div>
              </div>

              <div className="p-3 bg-surface rounded-lg border border-outline-variant/30 space-y-2">
                <p className="font-bold text-primary">Summary of Rules:</p>
                <ul className="list-disc pl-4 space-y-1 text-on-surface-variant text-[11px]">
                  <li>College ID card or SPITHR digital pass must be carried at all times.</li>
                  <li>Presentations should be in .pptx or .pdf format pre-loaded on a USB stick.</li>
                  <li>Certificate of participation is generated automatically upon desk checkout.</li>
                </ul>
              </div>

              <button
                onClick={() => {
                  alert('Downloading official SPITHR symposium guidelines PDF...');
                }}
                className="w-full bg-secondary text-on-secondary py-2.5 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-secondary/90 transition-colors shadow-sm cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">download</span>
                Download Document (.PDF)
              </button>
            </div>
          )}

          {resource.type === 'token' && (
            <div className="flex flex-col items-center text-center gap-3">
              <div className="w-16 h-16 rounded-full bg-secondary/10 text-secondary flex items-center justify-center border border-secondary/20">
                <span className="material-symbols-outlined text-3xl">restaurant_menu</span>
              </div>
              <div>
                <h4 className="font-serif text-base font-bold text-primary">Cafeteria Meal Token</h4>
                <p className="text-[11px] text-on-surface-variant mt-0.5">
                  Valid at Dining Hall 1 & Dining Hall 2 (12:30 PM - 02:30 PM)
                </p>
              </div>

              <div className="w-full p-4 bg-surface rounded-xl border border-dashed border-secondary/40 flex flex-col items-center">
                <span className="text-[10px] uppercase font-bold text-secondary tracking-wider mb-1">
                  Food Coupon Token
                </span>
                <span className="font-mono text-xl font-bold text-primary tracking-widest">
                  #MEAL-SP-88421
                </span>
                <span className="text-[10px] text-emerald-700 font-semibold mt-2 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Verified & Ready for scanning at dining entrance
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-surface-container-low border-t border-outline-variant/30 text-center">
          <button
            onClick={onClose}
            className="w-full py-2 bg-surface text-primary font-bold text-xs rounded-lg border border-outline-variant hover:bg-surface-container transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
