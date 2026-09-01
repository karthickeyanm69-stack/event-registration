import React from 'react';
import { NavigationTab } from '../types';

interface BottomNavProps {
  activeTab: NavigationTab;
  onTabChange: (tab: NavigationTab) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange }) => {
  const tabs: { id: NavigationTab; label: string; icon: string }[] = [
    { id: 'home', label: 'Home', icon: 'home' },
    { id: 'events', label: 'Events', icon: 'calendar_month' },
    { id: 'my-qr', label: 'My QR', icon: 'qr_code' },
    { id: 'profile', label: 'Profile', icon: 'person' },
  ];

  return (
    <nav
      id="participant-bottom-nav"
      className="fixed bottom-0 left-0 right-0 w-full z-50 bg-surface border-t border-outline-variant shadow-lg max-w-md mx-auto"
    >
      <div className="flex justify-around items-center h-16 px-4 pb-safe">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              id={`nav-btn-${tab.id}`}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center transition-all active:scale-95 cursor-pointer ${
                isActive
                  ? 'bg-secondary-container text-on-secondary-container rounded-full px-4 py-1 shadow-sm'
                  : 'text-on-surface-variant hover:bg-surface-container-highest w-16 h-14 rounded-lg'
              }`}
            >
              <span
                className={`material-symbols-outlined ${isActive ? 'icon-fill' : ''} text-[22px]`}
              >
                {tab.icon}
              </span>
              <span className="font-label-sm text-[11px] font-semibold tracking-wide mt-0.5">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
