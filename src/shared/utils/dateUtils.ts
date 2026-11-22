import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek,
  startOfYear,
  endOfYear,
  subMonths,
  isWithinInterval,
} from 'date-fns';

// Parse a 'yyyy-MM-dd' value from <input type="date"> as a LOCAL date.
// `new Date('2026-01-31')` is UTC midnight, which shows as the previous day in timezones west of UTC.
export const parseInputDate = (value: string): Date => {
  const [year, month, day] = value.split('-').map(Number);
  return new Date(year, month - 1, day);
};

export const formatDate = (date: Date, formatStr: string = 'MMM dd, yyyy'): string => {
  return format(date, formatStr);
};

export const getCurrentMonthRange = (): { start: Date; end: Date } => {
  const now = new Date();
  return {
    start: startOfMonth(now),
    end: endOfMonth(now),
  };
};

export const getPreviousMonthRange = (): { start: Date; end: Date } => {
  const lastMonth = subMonths(new Date(), 1);
  return {
    start: startOfMonth(lastMonth),
    end: endOfMonth(lastMonth),
  };
};

export const getCurrentWeekRange = (): { start: Date; end: Date } => {
  const now = new Date();
  return {
    start: startOfWeek(now),
    end: endOfWeek(now),
  };
};

export const getCurrentYearRange = (): { start: Date; end: Date } => {
  const now = new Date();
  return {
    start: startOfYear(now),
    end: endOfYear(now),
  };
};

export const isDateInRange = (date: Date, start: Date, end: Date): boolean => {
  return isWithinInterval(date, { start, end });
};

export const getMonthName = (date: Date): string => {
  return format(date, 'MMMM yyyy');
};

export const getLastNMonths = (n: number): Date[] => {
  const months: Date[] = [];
  for (let i = n - 1; i >= 0; i--) {
    months.push(subMonths(new Date(), i));
  }
  return months;
};
