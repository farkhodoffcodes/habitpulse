
import React, { useState } from 'react';
import { Icon } from '../components/Icon';
import { useHabit } from '../context';
import { Habit } from '../types';

interface AddHabitProps {
    onClose: () => void;
}

export const AddHabit: React.FC<AddHabitProps> = ({ onClose }) => {
    const { addHabit } = useHabit();
    const [title, setTitle] = useState('');
    const [goal, setGoal] = useState('1');
    const [unit, setUnit] = useState('times');
    const [selectedIcon, setSelectedIcon] = useState('footprints');
    const [selectedColor, setSelectedColor] = useState('bg-yellow-400');
    const [frequency, setFrequency] = useState<number[]>([0, 1, 2, 3, 4, 5, 6]);

    const icons = ['footprints', 'book', 'droplet', 'laptop', 'flame', 'calendar', 'chart', 'home'];
    const colors = ['bg-yellow-400', 'bg-blue-400', 'bg-red-400', 'bg-green-400', 'bg-purple-400', 'bg-pink-400', 'bg-orange-400', 'bg-teal-400'];
    const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

    const handleSubmit = () => {
        if (!title) return;
        
        const newHabit: Omit<Habit, 'id' | 'createdAt' | 'logs'> = {
            title,
            goal: parseInt(goal) || 1,
            unit,
            frequency,
            type: unit === 'mins' ? 'time' : 'count',
            color: selectedColor,
            icon: selectedIcon
        };

        addHabit(newHabit);
        onClose();
    };

    const toggleDay = (index: number) => {
        if (frequency.includes(index)) {
            setFrequency(frequency.filter(d => d !== index));
        } else {
            setFrequency([...frequency, index].sort());
        }
    };

    return (
        <div className="pb-28 pt-8 px-4 h-full flex flex-col bg-dark-bg">
            <div className="flex items-center gap-4 mb-8">
                <button onClick={onClose} className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white transition-colors">
                    <Icon name="x" size={20} />
                </button>
                <h2 className="text-2xl font-bold text-white">New Habit</h2>
            </div>

            <div className="space-y-8 flex-1 overflow-y-auto no-scrollbar pb-10">
                {/* Title Input */}
                <div className="space-y-3">
                    <label className="text-zinc-400 text-sm font-medium uppercase tracking-wider">Habit Name</label>
                    <input 
                        type="text" 
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="e.g. Read 30 mins"
                        autoFocus
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-4 text-white placeholder-zinc-600 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all text-lg"
                    />
                </div>

                {/* Goal Input */}
                <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-3">
                        <label className="text-zinc-400 text-sm font-medium uppercase tracking-wider">Goal</label>
                        <input 
                            type="number" 
                            value={goal}
                            onChange={(e) => setGoal(e.target.value)}
                            className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-4 text-white focus:outline-none focus:border-primary transition-all text-lg"
                        />
                     </div>
                     <div className="space-y-3">
                        <label className="text-zinc-400 text-sm font-medium uppercase tracking-wider">Unit</label>
                        <select 
                            value={unit}
                            onChange={(e) => setUnit(e.target.value)}
                            className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-4 text-white focus:outline-none focus:border-primary transition-all text-lg appearance-none"
                        >
                            <option value="times">Times</option>
                            <option value="steps">Steps</option>
                            <option value="mins">Mins</option>
                            <option value="ml">ml</option>
                            <option value="pages">Pages</option>
                        </select>
                     </div>
                </div>

                 {/* Icon Selection */}
                 <div className="space-y-3">
                    <label className="text-zinc-400 text-sm font-medium uppercase tracking-wider">Icon</label>
                    <div className="grid grid-cols-6 gap-2">
                        {icons.map(icon => (
                            <button 
                                key={icon}
                                onClick={() => setSelectedIcon(icon)}
                                className={`aspect-square rounded-2xl flex items-center justify-center transition-all duration-300 ${selectedIcon === icon ? 'bg-primary text-black scale-105 shadow-lg shadow-primary/20' : 'bg-zinc-900 text-zinc-500 border border-zinc-800 hover:bg-zinc-800'}`}
                            >
                                <Icon name={icon} size={22} />
                            </button>
                        ))}
                    </div>
                </div>

                {/* Color Selection */}
                 <div className="space-y-3">
                    <label className="text-zinc-400 text-sm font-medium uppercase tracking-wider">Color</label>
                    <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
                        {colors.map(color => (
                            <button 
                                key={color}
                                onClick={() => setSelectedColor(color)}
                                className={`w-12 h-12 rounded-full transition-all duration-300 shrink-0 ${color} ${selectedColor === color ? 'ring-4 ring-white/20 scale-110' : 'opacity-70 hover:opacity-100'}`}
                            />
                        ))}
                    </div>
                </div>

                 {/* Frequency */}
                 <div className="space-y-3">
                    <label className="text-zinc-400 text-sm font-medium uppercase tracking-wider">Frequency</label>
                    <div className="flex justify-between gap-1">
                         {days.map((day, idx) => {
                             const isActive = frequency.includes(idx);
                             return (
                                <button 
                                    key={idx} 
                                    onClick={() => toggleDay(idx)}
                                    className={`w-10 h-12 rounded-xl text-sm font-bold transition-all ${isActive ? 'bg-primary text-black' : 'bg-zinc-900 text-zinc-600 border border-zinc-800'}`}
                                >
                                    {day}
                                </button>
                             )
                         })}
                    </div>
                    <p className="text-center text-zinc-500 text-xs mt-2">
                        {frequency.length === 7 ? 'Everyday' : `${frequency.length} days per week`}
                    </p>
                 </div>
            </div>

            <button 
                onClick={handleSubmit} 
                className="w-full bg-primary text-black font-bold py-4 rounded-2xl mt-4 shadow-lg shadow-primary/20 hover:bg-primary-hover active:scale-[0.98] transition-all"
            >
                Create Habit
            </button>
        </div>
    );
};
