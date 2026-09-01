import React from 'react';
import { ParticipantInfo, QuickResource } from '../types';

interface ParticipantHomeProps {
  participant: ParticipantInfo;
  resources: QuickResource[];
  onViewPass: () => void;
  onViewEventDetails: () => void;
  onResourceClick: (resource: QuickResource) => void;
  onProfileClick: () => void;
}

export const ParticipantHome: React.FC<ParticipantHomeProps> = ({
  participant,
  resources,
  onViewPass,
  onViewEventDetails,
  onResourceClick,
  onProfileClick,
}) => {
  return (
    <div id="participant-home-screen" className="flex flex-col min-h-screen pb-24 bg-background">
      {/* Header Section */}
      <header
        id="participant-home-header"
        className="w-full bg-surface-container-lowest shadow-[0px_4px_20px_rgba(0,33,71,0.05)] sticky top-0 z-40"
      >
        <div className="px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="font-headline-sm text-lg font-bold text-primary tracking-tight">
              {participant.college.split(' of ')[0] || "St. Peter's Institute"}
            </h1>
            <p className="font-label-md text-xs text-on-surface-variant font-medium mt-0.5">
              {participant.department} • {participant.team}
            </p>
          </div>
          <button
            id="header-avatar-btn"
            onClick={onProfileClick}
            className="w-10 h-10 rounded-full bg-primary-container text-on-primary flex items-center justify-center overflow-hidden border-2 border-surface-container-high transition-transform active:scale-95 cursor-pointer shadow-sm"
          >
            <img
              src={participant.avatarUrl}
              alt={participant.name}
              className="w-full h-full object-cover"
            />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-4 flex flex-col gap-6 max-w-md mx-auto w-full">
        {/* Welcome Banner (Bento-style) */}
        <section
          id="welcome-banner"
          className="bg-primary-container text-on-primary rounded-xl p-5 shadow-[0px_10px_30px_rgba(0,33,71,0.12)] relative overflow-hidden"
        >
          <div className="relative z-10">
            <p className="font-label-md text-sm text-primary-fixed mb-1 font-medium">
              Welcome back,
            </p>
            <h2 className="font-serif text-2xl font-bold tracking-tight text-white">
              {participant.name}
            </h2>
            <div className="mt-4 flex gap-2">
              <span className="bg-white/10 backdrop-blur-sm border border-white/15 px-3 py-1 rounded-full font-label-sm text-xs font-semibold text-on-primary tracking-wide">
                Participant ID: {participant.id}
              </span>
            </div>
          </div>
          {/* Decorative College Crest Watermark */}
          <div className="absolute right-[-16px] bottom-[-16px] opacity-10 pointer-events-none text-white">
            <span className="material-symbols-outlined text-[130px]">school</span>
          </div>
        </section>

        {/* Active Event Card */}
        <section id="active-event-section">
          <h3 className="font-headline-sm text-lg font-bold text-on-background mb-3">
            Active Event
          </h3>
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-4 shadow-[0px_4px_20px_rgba(0,33,71,0.05)] transition-all hover:shadow-[0px_8px_24px_rgba(0,33,71,0.08)]">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1 pr-2">
                <div className="inline-flex items-center gap-1.5 bg-secondary/10 text-secondary px-2.5 py-0.5 rounded-full mb-2 border border-secondary/20">
                  <span className="material-symbols-outlined text-[14px]">check_circle</span>
                  <span className="font-label-sm text-xs font-semibold">
                    {participant.activeEvent.status}
                  </span>
                </div>
                <h4 className="font-serif text-lg font-bold text-primary leading-snug">
                  {participant.activeEvent.title}
                </h4>
              </div>
              <div className="bg-surface-container-highest px-3 py-2 rounded-lg text-center min-w-[58px] border border-outline-variant/40">
                <span className="block font-label-sm text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">
                  {participant.activeEvent.month}
                </span>
                <span className="block font-serif text-xl font-bold text-primary">
                  {participant.activeEvent.day}
                </span>
              </div>
            </div>

            <div className="h-[1px] bg-outline-variant/40 w-full my-3" />

            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2.5 text-on-surface-variant">
                <span className="material-symbols-outlined text-[18px] text-secondary">
                  schedule
                </span>
                <span className="font-body-sm text-sm text-on-surface">
                  {participant.activeEvent.time}
                </span>
              </div>
              <div className="flex items-center gap-2.5 text-on-surface-variant">
                <span className="material-symbols-outlined text-[18px] text-secondary">
                  location_on
                </span>
                <span className="font-body-sm text-sm text-on-surface">
                  {participant.activeEvent.venue}
                </span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-outline-variant/40 flex gap-3">
              <button
                id="btn-view-pass"
                onClick={onViewPass}
                className="flex-1 bg-primary text-on-primary py-2.5 px-4 rounded-lg font-label-md text-sm font-semibold flex items-center justify-center gap-2 hover:bg-primary-container transition-all active:scale-[0.98] shadow-sm cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">qr_code_2</span>
                View Pass
              </button>
              <button
                id="btn-event-details"
                onClick={onViewEventDetails}
                className="bg-surface text-primary border border-outline-variant px-4 py-2.5 rounded-lg font-label-md text-sm font-semibold hover:bg-surface-container-low transition-colors active:scale-[0.98] cursor-pointer"
              >
                Details
              </button>
            </div>
          </div>
        </section>

        {/* Quick Resources */}
        <section id="quick-resources-section">
          <h3 className="font-headline-sm text-lg font-bold text-on-background mb-3">
            Quick Resources
          </h3>
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-[0px_4px_20px_rgba(0,33,71,0.05)] overflow-hidden divide-y divide-outline-variant/40">
            {resources.map((resource) => (
              <button
                key={resource.id}
                id={`resource-btn-${resource.id}`}
                onClick={() => onResourceClick(resource)}
                className="w-full flex items-center justify-between p-4 hover:bg-surface-container-low transition-colors active:bg-surface-container-highest text-left cursor-pointer"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[20px]">{resource.icon}</span>
                  </div>
                  <div>
                    <h4 className="font-body-md text-sm font-semibold text-on-surface">
                      {resource.title}
                    </h4>
                    <p className="font-label-sm text-xs text-on-surface-variant font-normal mt-0.5">
                      {resource.subtitle}
                    </p>
                  </div>
                </div>
                <span className="material-symbols-outlined text-on-surface-variant text-[20px]">
                  {resource.actionIcon}
                </span>
              </button>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};
