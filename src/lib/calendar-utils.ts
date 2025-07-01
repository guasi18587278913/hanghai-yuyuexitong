import { startOfMonth, endOfMonth, eachDayOfInterval, getDay } from 'date-fns';

/**
 * Generates a matrix of dates for a given month.
 * The matrix includes leading and trailing days from adjacent months
 * to fill a 6x7 grid, representing a full calendar view.
 *
 * @param date - A date within the target month.
 * @returns An array of (Date | null), where null represents empty cells
 *          at the beginning of the week for the first week of the month.
 */
export function getMonthMatrix(date: Date): (Date | null)[] {
  const start = startOfMonth(date);
  const end = endOfMonth(date);
  const daysInMonth = eachDayOfInterval({ start, end });

  // `getDay` returns 0 for Sunday, 1 for Monday, ..., 6 for Saturday.
  // We want Monday to be the first day of the week (index 0).
  const firstDayOfWeek = (getDay(start) + 6) % 7;

  const matrix = new Array(firstDayOfWeek).fill(null);
  matrix.push(...daysInMonth);

  return matrix;
} 