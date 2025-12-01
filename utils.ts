
export const generateId = () => Math.random().toString(36).substr(2, 9);

export const getTodayStr = () => new Date().toISOString().split('T')[0];

export const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

export const getDaysInMonth = (year: number, month: number) => {
  return new Date(year, month + 1, 0).getDate();
};

export const getDayName = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { weekday: 'short' });
};

export const getDayNumber = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.getDate();
};

export const isSameDay = (d1: Date, d2: Date) => {
  return d1.getFullYear() === d2.getFullYear() &&
         d1.getMonth() === d2.getMonth() &&
         d1.getDate() === d2.getDate();
};
