import React, { useState } from 'react';
import { CollegeEvent, EventCategory } from '../types';

interface EventsListingProps {
  events: CollegeEvent[];
  onSelectEvent: (event: CollegeEvent) => void;
  onRegisterClick: (event: CollegeEvent) => void;
}

export const EventsListing: React.FC<EventsListingProps> = ({
  events,
  onSelectEvent,
  onRegisterClick,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<EventCategory>('All');

  const categories: EventCategory[] = ['All', 'Technical', 'Non-Technical'];

  const filteredEvents = events.filter((event) => {
    const matchesCategory =
      selectedCategory === 'All' ? true : event.category === selectedCategory;
    const matchesSearch =
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.venue.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (event.description && event.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div id="events-listing-screen" className="flex flex-col min-h-screen pb-28 bg-background">
      {/* Header Section */}
      <header
        id="events-header"
        className="bg-primary-container text-on-primary-container pt-8 pb-6 px-4 rounded-b-xl shadow-sm max-w-md mx-auto w-full"
      >
        <h1 className="font-serif text-2xl md:text-3xl font-bold text-white mb-2 tracking-tight">
          Discover Your Potential
        </h1>
        <p className="font-body-md text-sm text-on-primary-container mb-6 opacity-85">
          Explore events and elevate your skills.
        </p>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-surface-variant/20 rounded-lg p-3 text-center border border-white/10 backdrop-blur-xs">
            <div className="font-headline-sm text-lg font-bold text-white">12</div>
            <div className="font-label-sm text-[11px] text-on-primary-container font-medium mt-1">
              Active Events
            </div>
          </div>
          <div className="bg-surface-variant/20 rounded-lg p-3 text-center border border-white/10 backdrop-blur-xs">
            <div className="font-headline-sm text-lg font-bold text-white">340+</div>
            <div className="font-label-sm text-[11px] text-on-primary-container font-medium mt-1">
              Registrations
            </div>
          </div>
          <div className="bg-surface-variant/20 rounded-lg p-3 text-center border border-white/10 backdrop-blur-xs">
            <div className="font-headline-sm text-lg font-bold text-white">₹50K</div>
            <div className="font-label-sm text-[11px] text-on-primary-container font-medium mt-1">
              Prize Pool
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 py-6 flex flex-col gap-6 max-w-md mx-auto w-full">
        {/* Search Bar */}
        <div className="relative">
          <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-outline text-[20px]">
            search
          </span>
          <input
            id="event-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search events..."
            className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg pl-11 pr-4 py-3 font-body-md text-sm text-on-surface focus:border-secondary focus:ring-1 focus:ring-secondary transition-all shadow-sm outline-none placeholder:text-outline"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface p-1"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {categories.map((category) => {
            const isSelected = selectedCategory === category;
            return (
              <button
                key={category}
                id={`tab-category-${category.toLowerCase()}`}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full font-label-md text-xs font-semibold shrink-0 transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-primary text-on-primary shadow-sm'
                    : 'bg-surface-container-highest text-on-surface-variant hover:bg-surface-variant border border-outline-variant'
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>

        {/* Event List */}
        <div className="flex flex-col gap-4">
          {filteredEvents.length === 0 ? (
            <div className="p-8 text-center bg-surface-container-lowest rounded-xl border border-outline-variant">
              <span className="material-symbols-outlined text-4xl text-outline mb-2">
                event_busy
              </span>
              <p className="font-body-md text-sm text-on-surface-variant">
                No events found matching your search.
              </p>
            </div>
          ) : (
            filteredEvents.map((event) => (
              <div
                key={event.id}
                id={`event-card-${event.id}`}
                className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow group"
              >
                {/* Event Image Banner */}
                <div
                  onClick={() => onSelectEvent(event)}
                  className="relative h-36 w-full cursor-pointer overflow-hidden"
                >
                  <img
                    src={event.imageUrl}
                    alt={event.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div
                    className={`absolute top-2.5 left-2.5 px-2.5 py-1 rounded font-label-sm text-[11px] font-bold backdrop-blur-sm shadow-xs ${
                      event.category === 'Technical'
                        ? 'bg-secondary/90 text-on-secondary'
                        : 'bg-primary/90 text-on-primary'
                    }`}
                  >
                    {event.category}
                  </div>
                </div>

                {/* Event Details */}
                <div className="p-4 flex flex-col gap-3">
                  <div className="flex justify-between items-start">
                    <h3
                      onClick={() => onSelectEvent(event)}
                      className="font-headline-sm text-base font-bold text-on-surface hover:text-secondary transition-colors cursor-pointer"
                    >
                      {event.title}
                    </h3>
                    <span className="font-label-md text-base text-secondary font-bold">
                      ₹{event.price}
                    </span>
                  </div>

                  <div className="flex flex-col gap-1.5 text-on-surface-variant">
                    <div className="flex items-center gap-2 font-body-sm text-xs">
                      <span className="material-symbols-outlined text-[16px] text-secondary">
                        calendar_today
                      </span>
                      <span>
                        {event.date} • {event.time}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 font-body-sm text-xs">
                      <span className="material-symbols-outlined text-[16px] text-secondary">
                        location_on
                      </span>
                      <span>{event.venue}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-1 pt-3 border-t border-outline-variant/40">
                    <div
                      className={`flex items-center gap-1.5 font-label-md text-xs font-semibold ${
                        event.slotsLeft <= 20 ? 'text-error' : 'text-on-surface-variant'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[16px]">group</span>
                      <span>{event.slotsLeft} Slots Left</span>
                    </div>
                    <button
                      id={`btn-register-${event.id}`}
                      onClick={() => onRegisterClick(event)}
                      className="bg-secondary text-on-secondary px-4 py-1.5 rounded-lg font-label-md text-xs font-bold hover:bg-secondary/90 transition-colors shadow-xs active:scale-95 cursor-pointer"
                    >
                      Register
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Championship Banner */}
        <div
          id="championship-bonus-banner"
          className="mt-2 bg-gradient-to-r from-primary-container to-secondary rounded-xl p-5 text-on-primary-container shadow-md flex items-center justify-between relative overflow-hidden"
        >
          {/* Subtle pattern overlay */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white to-transparent pointer-events-none" />
          <div className="relative z-10 pr-3">
            <div className="font-label-sm text-[10px] text-secondary-container mb-1 tracking-wider uppercase font-bold">
              Unlock Rewards
            </div>
            <h3 className="font-headline-sm text-base font-bold text-white mb-1">
              Championship Bonus
            </h3>
            <p className="font-body-sm text-xs text-white/80">Register for 3+ events to qualify.</p>
          </div>
          <div className="relative z-10 bg-white/20 p-3 rounded-full backdrop-blur-sm border border-white/30 shrink-0">
            <span className="material-symbols-outlined text-white text-[32px]">
              workspace_premium
            </span>
          </div>
        </div>
      </main>
    </div>
  );
};
