import { Habit, User, HabitLog } from './types';

export const AVATARS = [
  "https://api.dicebear.com/9.x/adventurer/svg?seed=Felix",
  "https://api.dicebear.com/9.x/adventurer/svg?seed=Aneka",
  "https://api.dicebear.com/9.x/adventurer/svg?seed=Zack",
  "https://api.dicebear.com/9.x/adventurer/svg?seed=Midnight",
  "https://api.dicebear.com/9.x/adventurer/svg?seed=Luna",
  "https://api.dicebear.com/9.x/adventurer/svg?seed=Shadow",
  "https://api.dicebear.com/9.x/adventurer/svg?seed=Orion",
  "https://api.dicebear.com/9.x/adventurer/svg?seed=Nova",
  "https://api.dicebear.com/9.x/adventurer/svg?seed=Leo",
  "https://api.dicebear.com/9.x/adventurer/svg?seed=Bella",
  "https://api.dicebear.com/9.x/adventurer/svg?seed=Jack",
  "https://api.dicebear.com/9.x/adventurer/svg?seed=Willow"
];

export const MOCK_USER: User = {
  name: "Alex",
  avatar: AVATARS[0],
  totalHabits: 4,
  perfectDays: 12,
  currentStreak: 5,
};

// Generates random logs for mocking data
const generateLogs = (length: number, successRate: number, goal: number): Record<string, HabitLog> => {
  const logs: Record<string, HabitLog> = {};
  const today = new Date();
  
  for (let i = 0; i < length; i++) {
    if (Math.random() < successRate) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        const dateStr = d.toISOString().split('T')[0];
        logs[dateStr] = {
            date: dateStr,
            value: goal,
            completed: true
        };
    }
  }
  return logs;
};

export const MOCK_HABITS: Habit[] = [
  {
    id: '1',
    title: 'Walk',
    goal: 4000,
    unit: 'steps',
    frequency: [1, 3, 5],
    type: 'count',
    color: 'bg-yellow-400',
    icon: 'footprints',
    createdAt: new Date().toISOString(),
    logs: generateLogs(28, 0.6, 4000)
  },
  {
    id: '2',
    title: 'Working Time',
    goal: 8,
    unit: 'hours',
    frequency: [1, 2, 3, 4, 5],
    type: 'time',
    color: 'bg-blue-400',
    icon: 'laptop',
    createdAt: new Date().toISOString(),
    logs: generateLogs(28, 0.8, 8)
  },
  {
    id: '3',
    title: 'Drink Water',
    goal: 2,
    unit: 'Liters',
    frequency: [0, 1, 2, 3, 4, 5, 6],
    type: 'check',
    color: 'bg-cyan-400',
    icon: 'droplet',
    createdAt: new Date().toISOString(),
    logs: generateLogs(28, 0.9, 2)
  },
  {
    id: '4',
    title: 'Reading',
    goal: 30,
    unit: 'mins',
    frequency: [0, 1, 2, 3, 4, 5, 6],
    type: 'time',
    color: 'bg-purple-400',
    icon: 'book',
    createdAt: new Date().toISOString(),
    logs: generateLogs(28, 0.4, 30)
  }
];