
export type HabitType = 'count' | 'check' | 'time';

export interface HabitLog {
  date: string; // ISO date string YYYY-MM-DD
  value: number;
  completed: boolean;
  note?: string;
}

export interface Habit {
  id: string;
  title: string;
  description?: string;
  goal: number;
  unit: string; // e.g., 'steps', 'mins', 'times'
  frequency: number[]; // Array of day indices (0=Sun, 1=Mon, etc.)
  type: HabitType;
  color: string;
  icon: string;
  createdAt: string;
  logs: Record<string, HabitLog>; // Map date to log
}

export interface User {
  name: string;
  avatar: string;
  totalHabits: number;
  perfectDays: number;
  currentStreak: number;
}

export type ScreenName = 'onboarding' | 'home' | 'calendar' | 'analytics' | 'profile' | 'add';
