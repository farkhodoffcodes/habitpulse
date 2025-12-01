import React from 'react';
import { useHabit } from '../context';
import { Icon } from '../components/Icon';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getDayName } from '../utils';
import { HabitLog } from '../types';

export const Analytics: React.FC = () => {
  const { habits } = useHabit();

  // Calculate completion by day for last 7 days
  const data = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dateStr = d.toISOString().split('T')[0];
    const dayName = getDayName(dateStr);
    
    // Count completions
    let completed = 0;
    let totalDue = 0;
    
    habits.forEach(h => {
         if (h.frequency.includes(d.getDay())) {
             totalDue++;
             if (h.logs[dateStr]?.completed) completed++;
         }
    });

    const percent = totalDue > 0 ? Math.round((completed / totalDue) * 100) : 0;

    return { name: dayName, completion: percent };
  });

  const overallCompletion = Math.round(data.reduce((acc, curr) => acc + curr.completion, 0) / 7);

  return (
    <div className="pb-28 pt-8 px-4 h-full overflow-y-auto no-scrollbar">
      <h2 className="text-2xl font-bold text-white mb-6">Analytics</h2>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-zinc-900 p-4 rounded-3xl border border-zinc-800">
           <div className="flex items-center gap-2 mb-2">
             <div className="p-2 bg-primary/20 rounded-lg text-primary">
               <Icon name="check" size={16} />
             </div>
             <span className="text-zinc-400 text-xs font-medium uppercase">Success Rate</span>
           </div>
           <p className="text-3xl font-bold text-white">{overallCompletion}%</p>
           <p className="text-zinc-500 text-xs mt-1">Last 7 Days</p>
        </div>
        <div className="bg-zinc-900 p-4 rounded-3xl border border-zinc-800">
           <div className="flex items-center gap-2 mb-2">
             <div className="p-2 bg-blue-500/20 rounded-lg text-blue-500">
               <Icon name="flame" size={16} />
             </div>
             <span className="text-zinc-400 text-xs font-medium uppercase">Active Habits</span>
           </div>
           <p className="text-3xl font-bold text-white">{habits.length}</p>
           <p className="text-zinc-500 text-xs mt-1">Keep it up!</p>
        </div>
      </div>

      {/* Weekly Progress Chart */}
      <div className="bg-zinc-900 p-6 rounded-3xl border border-zinc-800 mb-8">
        <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-white">Weekly Progress</h3>
            <select className="bg-zinc-800 text-zinc-400 text-xs rounded-lg px-2 py-1 outline-none border border-zinc-700">
                <option>This Week</option>
            </select>
        </div>
        <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                    <defs>
                        <linearGradient id="colorBar" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#FCD34D" stopOpacity={1}/>
                        <stop offset="95%" stopColor="#FCD34D" stopOpacity={0.6}/>
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#27272A" />
                    <XAxis 
                        dataKey="name" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{fill: '#71717A', fontSize: 12}} 
                        dy={10}
                    />
                    <Tooltip 
                        cursor={{fill: '#27272A', opacity: 0.4}}
                        contentStyle={{backgroundColor: '#18181B', border: '1px solid #27272A', borderRadius: '8px'}}
                        itemStyle={{color: '#FCD34D'}}
                    />
                    <Bar dataKey="completion" fill="url(#colorBar)" radius={[4, 4, 4, 4]} barSize={30} />
                </BarChart>
            </ResponsiveContainer>
        </div>
      </div>

      {/* Habit Breakdown */}
      <h3 className="font-bold text-white mb-4">Habit Breakdown</h3>
      <div className="space-y-3">
         {habits.map(habit => {
             const logs = Object.values(habit.logs) as HabitLog[];
             const totalDone = logs.filter(l => l.completed).length;
             const rate = logs.length > 0 ? Math.round((totalDone / 30) * 100) : 0; // Approx logic

             return (
             <motion.div 
                key={habit.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-4 bg-zinc-900/50 p-4 rounded-2xl border border-zinc-800/50"
             >
                 <div className={`w-10 h-10 rounded-full flex items-center justify-center ${habit.color} text-zinc-900`}>
                     <Icon name={habit.icon} size={20} />
                 </div>
                 <div className="flex-1">
                     <div className="flex justify-between mb-1">
                         <span className="font-medium text-white">{habit.title}</span>
                         <span className="text-zinc-400 text-sm">{totalDone} times</span>
                     </div>
                     <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                         <div className={`h-full ${habit.color}`} style={{width: `${rate}%`}} />
                     </div>
                 </div>
             </motion.div>
         )})}
      </div>
    </div>
  );
};