'use client'

import React, { useMemo } from 'react'
import {
  format,
  addMonths,
  subMonths,
  isSameDay,
  isToday,
  isBefore,
  startOfToday,
} from 'date-fns'
import { getMonthMatrix } from '@/lib/calendar-utils'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import clsx from 'clsx'
import { Button } from '@/components/ui/button'
import { useBookingStore } from '@/lib/store/booking-store'

interface BookingCalendarProps {
  // An array of dates that are available for booking
  availableDates?: Date[];
  // Optional: The earliest date that can be selected
  minDate?: Date;
  // Optional: The latest date that can be selected
  maxDate?: Date;
}

export function BookingCalendar({ 
  availableDates = [],
  minDate,
  maxDate
}: BookingCalendarProps) {
  const { 
    currentMonth, 
    setCurrentMonth, 
    date: selectedDate, 
    setDate: onDateSelect 
  } = useBookingStore();

  const monthMatrix = useMemo(() => getMonthMatrix(currentMonth), [currentMonth]);
  const today = startOfToday();

  // For performance, convert the array of available dates to a Set of date strings.
  const availableDatesSet = useMemo(() => 
    new Set(availableDates.map(d => format(d, 'yyyy-MM-dd'))), 
    [availableDates]
  );

  const effectiveMinDate = minDate || today;
  const effectiveMaxDate = maxDate || addMonths(today, 3);

  const weekDays = ['一', '二', '三', '四', '五', '六', '日'];

  return (
    <div className="p-4 md:p-6 border rounded-lg shadow-sm">
      <CalendarHeader 
        currentMonth={currentMonth}
        onNextMonth={() => setCurrentMonth(addMonths(currentMonth, 1))}
        onPrevMonth={() => setCurrentMonth(subMonths(currentMonth, 1))}
      />
      <div className="grid grid-cols-7 gap-2 mt-4">
        {weekDays.map(day => <div key={day} className="text-center text-sm font-medium text-neutral-400">{day}</div>)}
        {monthMatrix.map((day, index) => (
          <DayCell 
            key={index}
            day={day}
            today={today}
            minDate={effectiveMinDate}
            maxDate={effectiveMaxDate}
            selectedDate={selectedDate}
            onDateSelect={onDateSelect}
            isAvailable={day ? availableDatesSet.has(format(day, 'yyyy-MM-dd')) : false}
          />
        ))}
      </div>
    </div>
  );
}

// --- Calendar Sub-components ---
function CalendarHeader({ currentMonth, onNextMonth, onPrevMonth }: any) {
  return (
    <div className="flex items-center justify-between">
      <Button variant="ghost" size="icon" onClick={onPrevMonth} aria-label="上个月">
        <ChevronLeft className="h-5 w-5 text-neutral-700" />
      </Button>
      <h2 className="font-semibold text-neutral-700">{format(currentMonth, 'yyyy年 M月')}</h2>
      <Button variant="ghost" size="icon" onClick={onNextMonth} aria-label="下个月">
        <ChevronRight className="h-5 w-5 text-neutral-700" />
      </Button>
    </div>
  );
}

interface DayCellProps {
  day: Date | null;
  today: Date;
  minDate: Date;
  maxDate: Date;
  selectedDate: Date | null;
  isAvailable: boolean;
  onDateSelect: (date: Date) => void;
}

function DayCell({ day, today, minDate, maxDate, selectedDate, onDateSelect, isAvailable }: DayCellProps) {
  if (!day) {
    return <div />;
  }
  
  const isDateBeforeMin = isBefore(day, minDate);
  const isDateAfterMax = maxDate ? isBefore(maxDate, day) : false;
  
  // A day is selectable if it's available AND within the min/max date range.
  const isSelectable = isAvailable && !isDateBeforeMin && !isDateAfterMax;

  return (
    <div
      className={clsx(
        'relative flex items-center justify-center h-10 w-10 rounded-full transition-colors duration-200',
        isSelectable ? 'cursor-pointer' : 'text-neutral-400 cursor-not-allowed',
        !isSelectable && isToday(day) && 'text-neutral-500 font-semibold',
        !isSelectable && !isAvailable && 'text-neutral-300', // Dim unavailable dates
        isSelectable && isToday(day) && 'bg-neutral-100',
        isSelectable && !isToday(day) && 'hover:bg-neutral-100',
        isSameDay(day, selectedDate || new Date(0)) && 'bg-blue-600 text-white hover:bg-blue-700'
      )}
      onClick={() => isSelectable && onDateSelect(day)}
    >
      <span>{format(day, 'd')}</span>
      {isAvailable && (
        <div className="absolute bottom-1 h-1 w-1 rounded-full bg-blue-500"></div>
      )}
    </div>
  );
} 