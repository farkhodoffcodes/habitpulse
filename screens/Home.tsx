
import React, { useState, useEffect, useRef } from 'react';
import { useHabit } from '../context';
import { HabitCard } from '../components/HabitCard';
import { Icon } from '../components/Icon';
import { motion } from 'framer-motion';
import { getTodayStr, getDayName, getDayNumber } from '../utils';

export const Home: React.FC = () => {
  const { habits, user } = useHabit();
  const [selectedDate, setSelectedDate] = useState(getTodayStr());
  
  // Generate date strip (last 15 days + next 5 days)
  const [dates, setDates] = useState<{ dateStr: string; dayName: string; dayNum: number }[]>([]);

  useEffect(() => {
    const tempDates = [];
    for (let i = -14; i <= 5; i++) {
        const d = new Date();
        d.setDate(d.getDate() + i);
        tempDates.push({
            dateStr: d.toISOString().split('T')[0],
            dayName: getDayName(d.toISOString()),
            dayNum: getDayNumber(d.toISOString())
        });
    }
    setDates(tempDates);
  }, []);

  // Auto scroll to selected date
  const scrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
     if(scrollRef.current) {
        // Simple scroll to roughly the end where 'today' is initially
        scrollRef.current.scrollLeft = 800;
     }
  }, []);

  // Filter habits based on day of week
  const selectedDayOfWeek = new Date(selectedDate).getDay();
  const todaysHabits = habits.filter(h => h.frequency.includes(selectedDayOfWeek));

  const completedCount = todaysHabits.filter(h => h.logs[selectedDate]?.completed).length;
  const progress = todaysHabits.length > 0 ? (completedCount / todaysHabits.length) * 100 : 0;

  return (
    <div className="h-full overflow-y-auto no-scrollbar pb-28 pt-6 px-4">
      {/* Top Bar */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl overflow-hidden border-2 border-zinc-800 shadow-lg">
            <img src={user.avatar} alt="User" className="w-full h-full object-cover bg-zinc-800" />
          </div>
          <div>
            <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider mb-0.5">
                {new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
            </p>
            <h2 className="text-white font-bold text-xl">Hello, {user.name} 👋</h2>
          </div>
        </div>
        <div className="w-12 h-12 rounded-full border-4 border-zinc-800 flex items-center justify-center relative shadow-inner bg-zinc-900">
            <span className="text-[10px] font-bold text-white z-10">{Math.round(progress)}%</span>
            <svg className="absolute inset-0 w-full h-full -rotate-90">
                <circle cx="20" cy="20" r="16" stroke="transparent" strokeWidth="4" fill="none" className="scale-[1.15] origin-center" />
                <circle 
                    cx="20" cy="20" r="16" 
                    stroke="#FCD34D" strokeWidth="4" fill="none" 
                    strokeDasharray="100" strokeDashoffset={100 - progress}
                    className="transition-all duration-500 scale-[1.15] origin-center"
                    strokeLinecap="round"
                />
            </svg>
        </div>
      </div>

      {/* Date Strip */}
      <div className="mb-8 -mx-4 px-4 overflow-x-auto no-scrollbar" ref={scrollRef}>
        <div className="flex gap-3 min-w-max pr-4">
            {dates.map((d) => {
                const isSelected = d.dateStr === selectedDate;
                const isToday = d.dateStr === getTodayStr();
                return (
                    <button 
                        key={d.dateStr}
                        onClick={() => setSelectedDate(d.dateStr)}
                        className={`flex flex-col items-center justify-center w-14 h-20 rounded-2xl border transition-all duration-300 ${isSelected ? 'bg-primary border-primary text-black scale-105 shadow-lg shadow-primary/20' : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:border-zinc-700 hover:bg-zinc-800'}`}
                    >
                        <span className={`text-xs font-bold ${isSelected ? 'text-black/70' : ''}`}>{d.dayName}</span>
                        <span className={`text-xl font-bold mt-1 ${isSelected ? 'text-black' : 'text-white'}`}>{d.dayNum}</span>
                        {isToday && <div className={`w-1.5 h-1.5 rounded-full mt-1.5 ${isSelected ? 'bg-black' : 'bg-primary'}`} />}
                    </button>
                );
            })}
        </div>
      </div>

      {/* Summary Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white text-lg font-bold">
            {selectedDate === getTodayStr() ? "Today's Habits" : "Habits History"}
            <span className="text-zinc-500 font-medium ml-2 text-sm bg-zinc-900 px-2 py-0.5 rounded-lg border border-zinc-800">{todaysHabits.length}</span>
        </h3>
      </div>

      {/* Habits List */}
      <div className="space-y-4 min-h-[300px]">
        {todaysHabits.length === 0 ? (
             <div className="flex flex-col items-center justify-center py-16 text-zinc-600 bg-zinc-900/30 rounded-3xl border border-zinc-800/50 border-dashed">
                 <div className="w-16 h-16 rounded-full bg-zinc-900 flex items-center justify-center mb-4">
                    <Icon name="calendar" size={24} className="opacity-50" />
                 </div>
                 <p className="font-medium">No habits scheduled for this day.</p>
                 <p className="text-xs mt-1 text-zinc-700">Enjoy your free time!</p>
             </div>
        ) : (
            todaysHabits.map(habit => (
            <HabitCard key={habit.id} habit={habit} dateStr={selectedDate} />
            ))
        )}
      </div>
    </div>
  );
};
