import React, { useState } from 'react';
import { BottomNav } from './components/BottomNav';
import { EventDetailsModal } from './components/EventDetailsModal';
import { EventsListing } from './components/EventsListing';
import { ParticipantHome } from './components/ParticipantHome';
import { ParticipantProfile } from './components/ParticipantProfile';
import { RegistrationPass } from './components/RegistrationPass';
import { ResourceModal } from './components/ResourceModal';
import { mockEvents, mockParticipant, mockQuickResources } from './data/mockData';
import { CollegeEvent, NavigationTab, ParticipantInfo, QuickResource } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavigationTab>('home');
  const [participant, setParticipant] = useState<ParticipantInfo>(mockParticipant);
  const [events, setEvents] = useState<CollegeEvent[]>(mockEvents);
  const [selectedEventForModal, setSelectedEventForModal] = useState<CollegeEvent | null>(null);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [selectedResource, setSelectedResource] = useState<QuickResource | null>(null);
  const [isResourceModalOpen, setIsResourceModalOpen] = useState(false);

  const handleViewPass = () => {
    setActiveTab('my-qr');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenEventDetails = (event: CollegeEvent) => {
    setSelectedEventForModal(event);
    setIsEventModalOpen(true);
  };

  const handleOpenResource = (resource: QuickResource) => {
    setSelectedResource(resource);
    setIsResourceModalOpen(true);
  };

  const handleConfirmRegistration = (event: CollegeEvent) => {
    setIsEventModalOpen(false);

    // Update active event in participant state
    const [month, day] = event.date.split(' ');
    setParticipant((prev) => ({
      ...prev,
      activeEvent: {
        title: event.title,
        date: event.date,
        month: month || 'Oct',
        day: day ? day.replace(',', '') : '24',
        time: event.time,
        venue: event.venue,
        status: 'Confirmed Registration',
        qrData: `SPE-2024-${Math.floor(10000 + Math.random() * 90000)}`,
      },
    }));

    // Decrement slot count
    setEvents((prev) =>
      prev.map((e) => (e.id === event.id ? { ...e, slotsLeft: Math.max(0, e.slotsLeft - 1) } : e))
    );

    // Navigate to QR Pass
    setActiveTab('my-qr');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-background text-on-background flex flex-col items-center justify-start">
      {/* Screen Container with responsive container constraints */}
      <div className="w-full max-w-md min-h-screen bg-background flex flex-col relative shadow-xl">
        {/* Render Tab Content */}
        {activeTab === 'home' && (
          <ParticipantHome
            participant={participant}
            resources={mockQuickResources}
            onViewPass={handleViewPass}
            onViewEventDetails={() => {
              // Open default active event
              const matchingEvent = events.find(
                (e) => e.title === participant.activeEvent.title
              ) || events[0];
              handleOpenEventDetails(matchingEvent);
            }}
            onResourceClick={handleOpenResource}
            onProfileClick={() => setActiveTab('profile')}
          />
        )}

        {activeTab === 'events' && (
          <EventsListing
            events={events}
            onSelectEvent={handleOpenEventDetails}
            onRegisterClick={handleOpenEventDetails}
          />
        )}

        {activeTab === 'my-qr' && (
          <RegistrationPass
            participant={participant}
            onBackToEvents={() => setActiveTab('events')}
          />
        )}

        {activeTab === 'profile' && (
          <ParticipantProfile
            participant={participant}
            onViewPass={handleViewPass}
            onNavigateToEvents={() => setActiveTab('events')}
          />
        )}

        {/* Global Bottom Navigation */}
        <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

      {/* Reusable Modals */}
      <EventDetailsModal
        event={selectedEventForModal}
        isOpen={isEventModalOpen}
        onClose={() => setIsEventModalOpen(false)}
        onConfirmRegistration={handleConfirmRegistration}
      />

      <ResourceModal
        resource={selectedResource}
        isOpen={isResourceModalOpen}
        onClose={() => setIsResourceModalOpen(false)}
      />
    </div>
  );
}
