
import React, { useState } from 'react';
import { Habit } from '../types';
import { Icon } from './Icon';
import { Heatmap } from './Heatmap';
import { motion, AnimatePresence } from 'framer-motion';
import { useHabit } from '../context';
import { getTodayStr } from '../utils';
import { NoteModal } from './NoteModal';

interface HabitCardProps {
  habit: Habit;
  dateStr?: string;
}

export const HabitCard: React.FC<HabitCardProps> = ({ habit, dateStr }) => {
  const { toggleHabit, getHabitStats, logNote } = useHabit();
  const currentDate = dateStr || getTodayStr();
  const [showNoteModal, setShowNoteModal] = useState(false);
  
  const log = habit.logs[currentDate];
  const isCompleted = log?.completed || false;
  const hasNote = log?.note && log.note.trim().length > 0;
  const stats = getHabitStats(habit);

  // Generate heatmap data (last 28 days)
  const history = Array.from({ length: 28 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (27 - i));
    const dStr = d.toISOString().split('T')[0];
    return habit.logs[dStr]?.completed || false;
  });

  const handleSaveNote = (note: string) => {
      logNote(habit.id, currentDate, note);
      setShowNoteModal(false);
  };

  return (
    <>
        <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-dark-card rounded-3xl p-5 mb-4 border border-zinc-800 shadow-xl overflow-hidden relative group"
        >
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-black shadow-lg ${habit.color} shadow-${habit.color.replace('bg-', '')}/20`}>
                <Icon name={habit.icon} size={22} />
            </div>
            <div>
                <h3 className="text-white font-bold text-lg">{habit.title}</h3>
                <p className="text-zinc-500 text-xs mt-0.5 font-medium flex items-center gap-1">
                    <span>Goal: {habit.goal} {habit.unit}</span>
                    <span className="w-1 h-1 rounded-full bg-zinc-600"/>
                    <span>{habit.frequency.length === 7 ? 'Everyday' : `${habit.frequency.length} days/week`}</span>
                </p>
            </div>
            </div>
            <button className="text-zinc-600 hover:text-white transition-colors bg-zinc-900/50 p-2 rounded-xl">
               <Icon name="chevron-down" size={18} />
            </button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-2 mb-6">
            <div className="bg-zinc-900/50 rounded-2xl p-3 text-center border border-zinc-800/50">
            <div className="text-white font-bold text-sm flex items-center justify-center gap-1">
                {stats.streak} <Icon name="flame" size={10} className="text-orange-500 fill-orange-500" />
            </div>
            <div className="text-zinc-500 text-[9px] uppercase tracking-wider font-bold mt-1">Streak</div>
            </div>
            <div className="bg-zinc-900/50 rounded-2xl p-3 text-center border border-zinc-800/50">
            <div className="text-white font-bold text-sm">{stats.totalCompleted}</div>
            <div className="text-zinc-500 text-[9px] uppercase tracking-wider font-bold mt-1">Total</div>
            </div>
            <div className="bg-zinc-900/50 rounded-2xl p-3 text-center border border-zinc-800/50">
            <div className="text-white font-bold text-sm">
                {habit.goal}
            </div>
            <div className="text-zinc-500 text-[9px] uppercase tracking-wider font-bold mt-1">
                Goal
            </div>
            </div>
        </div>

        {/* Heatmap */}
        <div className="mb-6 overflow-x-auto no-scrollbar pb-2">
            <Heatmap data={history} activeColor={habit.color} />
        </div>

        {/* Actions */}
        <div className="flex gap-3">
            <button 
                onClick={() => toggleHabit(habit.id, currentDate)}
                className={`flex-1 font-bold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95 ${isCompleted ? 'bg-primary text-black shadow-lg shadow-primary/20' : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white'}`}
            >
                <div className={`rounded-full p-0.5 ${isCompleted ? 'bg-black/20' : 'bg-zinc-600'}`}>
                    <Icon name="check" size={14} className={isCompleted ? 'text-black' : 'text-zinc-900'} />
                </div>
                {isCompleted ? 'Completed' : 'Mark Done'}
            </button>
            <button 
                onClick={() => setShowNoteModal(true)}
                className={`flex-1 font-medium py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors border ${hasNote ? 'bg-zinc-800 text-white border-zinc-600' : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:bg-zinc-800'}`}
            >
                <Icon name="note" size={18} className={hasNote ? 'text-primary' : 'text-zinc-500'} />
                {hasNote ? 'View Note' : 'Note'}
            </button>
        </div>
        </motion.div>

        <AnimatePresence>
            {showNoteModal && (
                <NoteModal 
                    initialNote={log?.note} 
                    habitTitle={habit.title}
                    onSave={handleSaveNote} 
                    onClose={() => setShowNoteModal(false)} 
                />
            )}
        </AnimatePresence>
    </>
  );
};
