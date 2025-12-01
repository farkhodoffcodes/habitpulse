
import React from 'react';
import { ScreenName } from '../types';
import { Icon } from './Icon';

interface BottomNavProps {
  currentScreen: ScreenName;
  onNavigate: (screen: ScreenName) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentScreen, onNavigate }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-dark-bg via-dark-bg to-transparent flex items-end pb-6 px-4 justify-between pointer-events-none z-50 max-w-md mx-auto">
      <div className="w-full bg-dark-card/90 backdrop-blur-lg border border-zinc-800 rounded-3xl h-16 px-1 flex items-center justify-between pointer-events-auto shadow-2xl relative">
          
        <NavButton active={currentScreen === 'home'} onClick={() => onNavigate('home')} icon="home" label="Home" />
        <NavButton active={currentScreen === 'calendar'} onClick={() => onNavigate('calendar')} icon="calendar" label="Calendar" />

         {/* Center Add Button */}
         <div className="relative -top-6 px-2">
            <button 
                onClick={() => onNavigate('add')}
                className="w-14 h-14 bg-primary text-black rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20 border-4 border-dark-bg hover:scale-105 transition-transform active:scale-95"
            >
                <Icon name="plus" size={28} />
            </button>
         </div>

        <NavButton active={currentScreen === 'analytics'} onClick={() => onNavigate('analytics')} icon="chart" label="Stats" />
        <NavButton active={currentScreen === 'profile'} onClick={() => onNavigate('profile')} icon="user" label="Profile" />

      </div>
    </div>
  );
};

const NavButton = ({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: string, label: string }) => (
    <button 
        onClick={onClick}
        className={`flex-1 flex flex-col items-center justify-center h-full gap-1 transition-colors ${active ? 'text-primary' : 'text-zinc-500 hover:text-zinc-300'}`}
    >
        <Icon name={icon} size={22} className={active ? 'fill-current' : ''} />
        <span className="text-[9px] font-medium">{label}</span>
    </button>
);
