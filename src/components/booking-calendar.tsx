'use client'

import React, { useState, useMemo } from 'react'
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

interface BookingCalendarProps {
  availableDates?: Date[]
  minDate?: Date
  maxDate?: Date
  selectedDate?: Date | null
  onDateSelect?: (date: Date) => void
  // Making month navigation controllable from outside
  currentMonth?: Date
  onMonthChange?: (month: Date) => void
}

export function BookingCalendar({
  availableDates = [],
  minDate,
  maxDate,
  selectedDate: controlledSelectedDate,
  onDateSelect: controlledOnDateSelect,
  currentMonth: controlledCurrentMonth,
  onMonthChange: controlledOnMonthChange,
}: BookingCalendarProps) {
  // Internal state for when the component is not controlled from the outside.
  const [internalCurrentMonth, setInternalCurrentMonth] = useState(startOfToday())
  
  const currentMonth = controlledCurrentMonth || internalCurrentMonth
  const setCurrentMonth = controlledOnMonthChange || setInternalCurrentMonth
  
  // The selected date is now primarily controlled by props.
  const selectedDate = controlledSelectedDate

  const monthMatrix = useMemo(() => getMonthMatrix(currentMonth), [currentMonth])
  const today = startOfToday()

  const availableDatesSet = useMemo(
    () => new Set(availableDates.map((d) => format(d, 'yyyy-MM-dd'))),
    [availableDates]
  )
  
  const onDateSelect = controlledOnDateSelect || (() => {});

  const effectiveMinDate = minDate || today
  const effectiveMaxDate = maxDate || addMonths(today, 3)

  const weekDays = ['一', '二', '三', '四', '五', '六', '日']

  return (
    <div className="rounded-lg border bg-white p-4 shadow-sm dark:bg-zinc-800 md:p-6">
      <CalendarHeader
        currentMonth={currentMonth}
        onNextMonth={() => setCurrentMonth(addMonths(currentMonth, 1))}
        onPrevMonth={() => setCurrentMonth(subMonths(currentMonth, 1))}
      />
      <div className="mt-4 grid grid-cols-7 gap-2">
        {weekDays.map((day) => (
          <div
            key={day}
            className="text-center text-sm font-medium text-neutral-400"
          >
            {day}
          </div>
        ))}
        {monthMatrix.map((day, index) => (
          <DayCell
            key={index}
            day={day}
            today={today}
            minDate={effectiveMinDate}
            maxDate={effectiveMaxDate}
            selectedDate={selectedDate}
            onDateSelect={onDateSelect}
            isAvailable={
              day ? availableDatesSet.has(format(day, 'yyyy-MM-dd')) : false
            }
          />
        ))}
      </div>
    </div>
  )
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
  selectedDate: Date | null | undefined;
  isAvailable: boolean;
  onDateSelect: (date: Date) => void;
}

function DayCell({ day, today, minDate, maxDate, selectedDate, onDateSelect, isAvailable }: DayCellProps) {
  if (!day) {
    return <div />;
  }
  
  const isDateBeforeMin = isBefore(day, minDate);
  const isDateAfterMax = maxDate ? isBefore(maxDate, day) : false;
  
  const isSelectable = isAvailable && !isDateBeforeMin && !isDateAfterMax;

  return (
    <div
      className={clsx(
        'relative flex h-10 w-10 items-center justify-center rounded-full transition-colors duration-200',
        isSelectable ? 'cursor-pointer' : 'cursor-not-allowed text-neutral-400',
        !isSelectable && isToday(day) && 'font-semibold text-neutral-500',
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