
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Habit, User, HabitLog } from './types';
import { generateId } from './utils';
import { AVATARS } from './constants';

interface HabitContextType {
  habits: Habit[];
  user: User;
  addHabit: (habit: Omit<Habit, 'id' | 'createdAt' | 'logs'>) => void;
  toggleHabit: (id: string, date: string) => void;
  logNote: (id: string, date: string, note: string) => void;
  deleteHabit: (id: string) => void;
  updateUser: (user: Partial<User>) => void;
  getHabitStats: (habit: Habit) => { streak: number; completionRate: number; totalCompleted: number };
}

const HabitContext = createContext<HabitContextType | undefined>(undefined);

const DEFAULT_USER: User = {
  name: 'Adventurer',
  avatar: AVATARS[0],
  totalHabits: 0,
  perfectDays: 0,
  currentStreak: 0,
};

const DEFAULT_HABITS: Habit[] = [
  {
    id: '1',
    title: 'Morning Walk',
    goal: 4000,
    unit: 'steps',
    frequency: [0, 1, 2, 3, 4, 5, 6],
    type: 'count',
    color: 'bg-yellow-400',
    icon: 'footprints',
    createdAt: new Date().toISOString(),
    logs: {}
  },
  {
    id: '2',
    title: 'Read Wisdom',
    goal: 30,
    unit: 'mins',
    frequency: [0, 1, 2, 3, 4, 5, 6],
    type: 'time',
    color: 'bg-purple-400',
    icon: 'book',
    createdAt: new Date().toISOString(),
    logs: {}
  }
];

export const HabitProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [user, setUser] = useState<User>(DEFAULT_USER);
  const [loading, setLoading] = useState(true);

  // Load from local storage
  useEffect(() => {
    const storedHabits = localStorage.getItem('habitpulse_habits');
    const storedUser = localStorage.getItem('habitpulse_user');

    if (storedHabits) {
      setHabits(JSON.parse(storedHabits));
    } else {
      setHabits(DEFAULT_HABITS);
    }

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    setLoading(false);
  }, []);

  // Save to local storage
  useEffect(() => {
    if (!loading) {
      localStorage.setItem('habitpulse_habits', JSON.stringify(habits));
      localStorage.setItem('habitpulse_user', JSON.stringify(user));
    }
  }, [habits, user, loading]);

  const addHabit = (habitData: Omit<Habit, 'id' | 'createdAt' | 'logs'>) => {
    const newHabit: Habit = {
      ...habitData,
      id: generateId(),
      createdAt: new Date().toISOString(),
      logs: {},
    };
    setHabits(prev => [...prev, newHabit]);
  };

  const toggleHabit = (id: string, date: string) => {
    setHabits(prev => prev.map(habit => {
      if (habit.id !== id) return habit;

      const currentLog = habit.logs[date];
      const isCompleted = currentLog?.completed;

      // Toggle logic
      const newLog: HabitLog = {
        date,
        value: isCompleted ? 0 : habit.goal, // Simple toggle for now
        completed: !isCompleted,
        note: currentLog?.note // Preserve note
      };

      return {
        ...habit,
        logs: {
          ...habit.logs,
          [date]: newLog
        }
      };
    }));
  };

  const logNote = (id: string, date: string, note: string) => {
    setHabits(prev => prev.map(habit => {
        if (habit.id !== id) return habit;
        const currentLog = habit.logs[date] || { date, value: 0, completed: false };
        
        return {
            ...habit,
            logs: {
                ...habit.logs,
                [date]: { ...currentLog, note }
            }
        };
    }));
  };

  const deleteHabit = (id: string) => {
    setHabits(prev => prev.filter(h => h.id !== id));
  };

  const updateUser = (userData: Partial<User>) => {
    setUser(prev => ({ ...prev, ...userData }));
  };

  const getHabitStats = (habit: Habit) => {
    const logs = Object.values(habit.logs);
    const totalCompleted = logs.filter(l => l.completed).length;
    
    // Calculate streak (simplified backwards check from today)
    let streak = 0;
    const today = new Date();
    // Check up to 365 days back
    for (let i = 0; i < 365; i++) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        const dateStr = d.toISOString().split('T')[0];
        
        // Skip checking today if it's not done yet, don't break streak
        if (i === 0 && !habit.logs[dateStr]?.completed) {
            continue; 
        }

        if (habit.logs[dateStr]?.completed) {
            streak++;
        } else {
            // Check if user was supposed to do it this day
            if (habit.frequency.includes(d.getDay())) {
                break;
            }
            // If not supposed to do it, continue checking backwards without incrementing streak
            // (Strict streak logic usually requires consecutive active days, but let's keep it simple)
        }
    }

    // Completion rate based on last 30 days
    const completionRate = Math.round((totalCompleted / 30) * 100); 

    return { streak, completionRate, totalCompleted };
  };

  return (
    <HabitContext.Provider value={{ habits, user, addHabit, toggleHabit, logNote, deleteHabit, updateUser, getHabitStats }}>
      {children}
    </HabitContext.Provider>
  );
};

export const useHabit = () => {
  const context = useContext(HabitContext);
  if (!context) throw new Error('useHabit must be used within a HabitProvider');
  return context;
};
