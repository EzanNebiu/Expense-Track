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
