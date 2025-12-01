import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '../components/Icon';
import { useHabit } from '../context';
import { AVATARS } from '../constants';

interface OnboardingProps {
  onComplete: () => void;
}

const slides = [
  {
    title: "Welcome to HabitPulse",
    description: "Your personal companion for building a better lifestyle, one day at a time.",
    icon: "home"
  },
  {
    title: "Track Daily Habits",
    description: "Build consistency with intuitive tracking. Don't break the chain!",
    icon: "footprints"
  },
  {
    title: "Visualize Progress",
    description: "Unlock insights about your behavior with beautiful charts and heatmaps.",
    icon: "chart"
  },
  {
    title: "Level Up Your Life",
    description: "Stay motivated with streaks and achievements. Treat your life like a game.",
    icon: "flame"
  }
];

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [name, setName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(AVATARS[0]);
  const { updateUser } = useHabit();

  const handleNext = () => {
    if (currentSlide < slides.length) {
      setCurrentSlide(curr => curr + 1);
    }
  };

  const handleFinish = () => {
    if (!name.trim()) return;
    updateUser({ name, avatar: selectedAvatar });
    onComplete();
  };

  const isProfileStep = currentSlide === slides.length;

  return (
    <div className="h-full flex flex-col justify-between p-6 pt-20 bg-dark-bg relative overflow-hidden">
        {/* Background blobs */}
        <div className="absolute top-[-20%] left-[-20%] w-[300px] h-[300px] bg-primary/20 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[250px] h-[250px] bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="flex-1 flex flex-col items-center relative z-10">
        <AnimatePresence mode='wait'>
          {!isProfileStep ? (
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="flex flex-col items-center text-center mt-10"
            >
              <div className="w-40 h-40 bg-zinc-900 rounded-[2rem] flex items-center justify-center mb-10 shadow-2xl border border-zinc-800 rotate-3 ring-1 ring-white/5">
                 <Icon name={slides[currentSlide].icon} size={64} className="text-primary drop-shadow-[0_0_15px_rgba(252,211,77,0.5)]" />
              </div>
              
              <h1 className="text-4xl font-bold text-white mb-6 leading-tight">
                {slides[currentSlide].title.split(" ").map((word, i) => (
                    <span key={i} className={i % 2 !== 0 ? "text-primary" : ""}>{word} </span>
                ))}
              </h1>
              <p className="text-zinc-400 text-lg px-2 leading-relaxed font-light">
                {slides[currentSlide].description}
              </p>
            </motion.div>
          ) : (
            <motion.div
                key="profile-setup"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full mt-4"
            >
                <h2 className="text-3xl font-bold text-white text-center mb-2">Create Profile</h2>
                <p className="text-zinc-500 text-center mb-8">Who will you be on this journey?</p>

                <div className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">Your Name</label>
                        <input 
                            type="text" 
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter your name..."
                            className="w-full bg-zinc-900/80 border border-zinc-700 rounded-2xl p-4 text-white placeholder-zinc-600 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all text-lg"
                        />
                    </div>

                    <div className="space-y-2">
                         <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">Choose Avatar</label>
                         <div className="grid grid-cols-4 gap-3">
                             {AVATARS.slice(0, 8).map((avatar, i) => (
                                 <button
                                     key={i}
                                     onClick={() => setSelectedAvatar(avatar)}
                                     className={`aspect-square rounded-2xl overflow-hidden border-2 transition-all duration-200 ${selectedAvatar === avatar ? 'border-primary scale-110 shadow-lg shadow-primary/20' : 'border-zinc-800 opacity-60 hover:opacity-100 hover:scale-105'}`}
                                 >
                                     <img src={avatar} alt={`Avatar ${i}`} className="w-full h-full object-cover bg-zinc-800" />
                                 </button>
                             ))}
                         </div>
                    </div>
                </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="w-full pb-10 pt-6 relative z-10">
        {!isProfileStep ? (
             <>
                <div className="flex justify-center gap-2 mb-8">
                {slides.map((_, idx) => (
                    <div 
                    key={idx} 
                    className={`h-1.5 rounded-full transition-all duration-500 ${idx === currentSlide ? 'w-8 bg-primary shadow-[0_0_10px_rgba(252,211,77,0.5)]' : 'w-2 bg-zinc-800'}`} 
                    />
                ))}
                {/* Extra dot for profile step */}
                <div className="h-1.5 w-2 bg-zinc-800 rounded-full" />
                </div>

                <button 
                onClick={handleNext}
                className="w-full bg-white text-black font-bold py-4 rounded-2xl text-lg flex items-center justify-center gap-2 hover:bg-zinc-200 active:scale-[0.98] transition-all"
                >
                Continue
                <Icon name="arrow-right" size={20} />
                </button>
            </>
        ) : (
            <button 
            onClick={handleFinish}
            disabled={!name.trim()}
            className={`w-full font-bold py-4 rounded-2xl text-lg flex items-center justify-center gap-2 transition-all ${name.trim() ? 'bg-primary text-black hover:bg-primary-hover shadow-lg shadow-primary/25 active:scale-[0.98]' : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'}`}
            >
            Start Adventure
            <Icon name="flame" size={20} />
            </button>
        )}
      </div>
    </div>
  );
};