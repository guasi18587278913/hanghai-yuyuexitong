'use client'

import { useTransition } from 'react'
import { CheckCircle2, Circle, Loader2, Lock } from 'lucide-react'
import {
  createAvailability,
  deleteAvailability,
} from '@/app/(dashboard)/coach/schedule/actions'
import { format, startOfDay } from 'date-fns'
import clsx from 'clsx'

type Availability = {
  id: string
  startTime: Date
  isBooked: boolean
}

interface TimeTimelineProps {
  selectedDate: Date
  availabilities: Availability[]
  coachId: string
}

export function TimeTimeline({
  selectedDate,
  availabilities,
  coachId,
}: TimeTimelineProps) {
  const [isPending, startTransition] = useTransition()
  
  const hours = Array.from({ length: 14 }, (_, i) => i + 8) // 8 AM to 9 PM

  const handleSlotClick = (slot: Date, isAvailable: boolean) => {
    startTransition(() => {
      const formData = new FormData()
      formData.append('slot', slot.toISOString())
      if (isAvailable) {
        deleteAvailability(formData)
      } else {
        createAvailability(formData)
      }
    })
  }
  
  const availabilitySet = new Set(
    availabilities.map((a) => a.startTime.getHours())
  )
  const bookedSet = new Set(
    availabilities.filter(a => a.isBooked).map(a => a.startTime.getHours())
  )

  return (
    <div className="rounded-lg border bg-white p-4 dark:bg-zinc-800">
      <h3 className="mb-4 text-lg font-semibold">
        {format(selectedDate, 'yyyy年 M月 d日')}
      </h3>
      <div className="relative space-y-2">
        {isPending && (
          <div className="absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-white/70 dark:bg-zinc-900/70">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        )}
        {hours.map((hour) => {
          const slot = startOfDay(selectedDate)
          slot.setHours(hour)
          const isAvailable = availabilitySet.has(hour)
          const isBooked = bookedSet.has(hour)
          
          return (
            <button
              key={hour}
              disabled={isBooked || isPending}
              onClick={() => handleSlotClick(slot, isAvailable)}
              className={clsx(
                'flex w-full items-center justify-between rounded-md border p-3 text-left transition-colors',
                {
                  'border-gray-200 bg-gray-50 hover:bg-gray-100 dark:border-zinc-700 dark:bg-zinc-700/50 dark:hover:bg-zinc-700':
                    !isAvailable && !isBooked,
                  'border-green-300 bg-green-50 text-green-800 dark:border-green-700/50 dark:bg-green-500/10 dark:text-green-300':
                    isAvailable && !isBooked,
                  'cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-500':
                    isBooked,
                }
              )}
            >
              <span className="font-mono">{`${hour.toString().padStart(2, '0')}:00`}</span>
              {isBooked ? (
                <Lock className="h-5 w-5" />
              ) : isAvailable ? (
                <CheckCircle2 className="h-5 w-5" />
              ) : (
                <Circle className="h-5 w-5 text-gray-300 dark:text-zinc-600" />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
} 