
import React, { useState } from 'react';
import { Onboarding } from './screens/Onboarding';
import { Home } from './screens/Home';
import { Analytics } from './screens/Analytics';
import { AddHabit } from './screens/AddHabit';
import { Calendar } from './screens/Calendar';
import { Profile } from './screens/Profile';
import { BottomNav } from './components/BottomNav';
import { ScreenName } from './types';
import { motion, AnimatePresence } from 'framer-motion';
import { HabitProvider } from './context';

const AppContent: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<ScreenName>('onboarding');
  const [showNav, setShowNav] = useState(false);

  const handleOnboardingComplete = () => {
    setCurrentScreen('home');
    setShowNav(true);
  };

  const handleNavigate = (screen: ScreenName) => {
    setCurrentScreen(screen);
  };

  return (
    <div className="min-h-screen bg-dark-bg text-white font-sans overflow-hidden max-w-md mx-auto relative shadow-2xl">
      
      <AnimatePresence mode="wait">
        {currentScreen === 'onboarding' && (
          <motion.div
            key="onboarding"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, x: -100 }}
            className="h-full w-full absolute inset-0 z-20"
          >
            <Onboarding onComplete={handleOnboardingComplete} />
          </motion.div>
        )}

        {currentScreen === 'home' && (
          <motion.div
            key="home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="h-full"
          >
            <Home />
          </motion.div>
        )}

        {currentScreen === 'analytics' && (
          <motion.div
            key="analytics"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="h-full"
          >
            <Analytics />
          </motion.div>
        )}

        {currentScreen === 'calendar' && (
          <motion.div
            key="calendar"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="h-full"
          >
            <Calendar />
          </motion.div>
        )}

        {currentScreen === 'profile' && (
          <motion.div
            key="profile"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="h-full"
          >
            <Profile />
          </motion.div>
        )}

        {currentScreen === 'add' && (
             <motion.div
                key="add"
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="absolute inset-0 z-30 bg-dark-bg"
             >
                 <AddHabit onClose={() => setCurrentScreen('home')} />
             </motion.div>
        )}
      </AnimatePresence>

      {showNav && currentScreen !== 'add' && (
        <BottomNav currentScreen={currentScreen} onNavigate={handleNavigate} />
      )}
      
    </div>
  );
};

const App: React.FC = () => {
    return (
        <HabitProvider>
            <AppContent />
        </HabitProvider>
    )
}

export default App;
