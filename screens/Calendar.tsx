
import React, { useState } from 'react';
import { useHabit } from '../context';
import { Icon } from '../components/Icon';
import { motion } from 'framer-motion';
import { getDaysInMonth, isSameDay } from '../utils';

export const Calendar: React.FC = () => {
    const { habits } = useHabit();
    const [currentDate, setCurrentDate] = useState(new Date());

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const daysInMonth = getDaysInMonth(year, month);
    const firstDayOfMonth = new Date(year, month, 1).getDay();

    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const prevMonth = () => {
        setCurrentDate(new Date(year, month - 1, 1));
    };

    const nextMonth = () => {
        setCurrentDate(new Date(year, month + 1, 1));
    };

    const getCompletionForDate = (date: Date) => {
        const dateStr = date.toISOString().split('T')[0];
        let completedCount = 0;
        let totalDue = 0;

        habits.forEach(h => {
            if (h.frequency.includes(date.getDay())) {
                totalDue++;
                if (h.logs[dateStr]?.completed) {
                    completedCount++;
                }
            }
        });

        return { completedCount, totalDue };
    };

    const renderCalendarDays = () => {
        const days = [];
        // Empty slots for previous month
        for (let i = 0; i < firstDayOfMonth; i++) {
            days.push(<div key={`empty-${i}`} className="h-14" />);
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day);
            const isToday = isSameDay(date, new Date());
            const { completedCount, totalDue } = getCompletionForDate(date);
            
            // Determine color based on completion rate
            let bgClass = "bg-zinc-900";
            let textClass = "text-zinc-400";
            
            if (totalDue > 0) {
                if (completedCount === totalDue) {
                    bgClass = "bg-primary text-black";
                    textClass = "text-black font-bold";
                } else if (completedCount > 0) {
                    bgClass = "bg-yellow-400/20 border border-yellow-400/30";
                    textClass = "text-yellow-400";
                }
            }

            if (isToday && totalDue === 0) {
                bgClass = "bg-zinc-800 border border-zinc-700";
                textClass = "text-white";
            }

            days.push(
                <motion.div 
                    key={day}
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: day * 0.01 }}
                    className={`h-14 rounded-xl flex flex-col items-center justify-center relative ${bgClass} mb-1`}
                >
                    <span className={`text-sm ${textClass}`}>{day}</span>
                    {totalDue > 0 && (
                        <div className="flex gap-0.5 mt-1">
                            {Array.from({ length: Math.min(3, totalDue) }).map((_, i) => (
                                <div 
                                    key={i} 
                                    className={`w-1 h-1 rounded-full ${i < completedCount ? (bgClass.includes('bg-primary') ? 'bg-black' : 'bg-yellow-400') : 'bg-zinc-700'}`} 
                                />
                            ))}
                            {totalDue > 3 && <div className="w-1 h-1 rounded-full bg-zinc-700" />}
                        </div>
                    )}
                </motion.div>
            );
        }
        return days;
    };

    return (
        <div className="pb-28 pt-8 px-4 h-full overflow-y-auto no-scrollbar">
            <h2 className="text-2xl font-bold text-white mb-6">Calendar</h2>

            {/* Month Navigation */}
            <div className="flex items-center justify-between mb-8 bg-zinc-900 p-2 rounded-2xl border border-zinc-800">
                <button onClick={prevMonth} className="w-10 h-10 rounded-xl flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors">
                    <Icon name="chevron-down" className="rotate-90" size={20} />
                </button>
                <h3 className="text-lg font-bold text-white">{monthNames[month]} {year}</h3>
                <button onClick={nextMonth} className="w-10 h-10 rounded-xl flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors">
                    <Icon name="chevron-down" className="-rotate-90" size={20} />
                </button>
            </div>

            {/* Stats Summary */}
            <div className="flex justify-between gap-4 mb-8">
                 <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl flex-1 text-center">
                      <p className="text-2xl font-bold text-primary">{getDaysInMonth(year, month)}</p>
                      <p className="text-xs text-zinc-500 uppercase tracking-wide">Days</p>
                 </div>
                 <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl flex-1 text-center">
                      <p className="text-2xl font-bold text-white">{habits.length}</p>
                      <p className="text-xs text-zinc-500 uppercase tracking-wide">Active Habits</p>
                 </div>
            </div>

            {/* Calendar Grid */}
            <div className="mb-4">
                 <div className="grid grid-cols-7 gap-2 mb-2">
                     {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                         <div key={i} className="text-center text-zinc-600 text-xs font-bold">{d}</div>
                     ))}
                 </div>
                 <div className="grid grid-cols-7 gap-2">
                     {renderCalendarDays()}
                 </div>
            </div>
            
            <div className="mt-8 p-4 bg-zinc-900/50 rounded-2xl border border-zinc-800/50">
                 <h4 className="text-sm font-semibold text-zinc-300 mb-3">Legend</h4>
                 <div className="flex gap-4">
                      <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded bg-primary" />
                          <span className="text-xs text-zinc-500">Perfect Day</span>
                      </div>
                      <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded bg-yellow-400/20 border border-yellow-400/30" />
                          <span className="text-xs text-zinc-500">Partial</span>
                      </div>
                      <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded bg-zinc-900 border border-zinc-800" />
                          <span className="text-xs text-zinc-500">None</span>
                      </div>
                 </div>
            </div>
        </div>
    );
};
