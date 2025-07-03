'use client'

import { useState, useEffect } from 'react'
import { BookingCalendar } from '@/components/booking-calendar'
import { TimeTimeline } from './time-timeline'
import { Skeleton } from '@/components/ui/skeleton'

type Availability = {
  id: string
  startTime: Date
  isBooked: boolean
}

interface AvailabilityEditorProps {
  coachId: string
  // Coach's availabilities for the initial month, to avoid layout shift
  initialAvailabilities: { startTime: Date }[]
}

export function AvailabilityEditor({
  coachId,
  initialAvailabilities,
}: AvailabilityEditorProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [availabilities, setAvailabilities] = useState<Availability[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchAvailabilitiesForDay = async () => {
      setIsLoading(true)
      const dateString = selectedDate.toISOString().split('T')[0]
      const response = await fetch(
        `/api/coach/availabilities?coachId=${coachId}&date=${dateString}`
      )
      if (response.ok) {
        const data = await response.json()
        setAvailabilities(data.map((a: any) => ({...a, startTime: new Date(a.startTime)})))
      } else {
        // Handle error, maybe show a toast
        setAvailabilities([])
      }
      setIsLoading(false)
    }

    fetchAvailabilitiesForDay()
  }, [selectedDate, coachId])

  return (
    <div className="mx-auto grid w-full max-w-5xl grid-cols-1 gap-6 md:grid-cols-3">
      <div className="md:col-span-2">
        <BookingCalendar
          availableDates={initialAvailabilities.map(a => new Date(a.startTime))}
          selectedDate={selectedDate}
          onDateSelect={setSelectedDate}
        />
      </div>
      <div className="md:col-span-1">
        {isLoading ? (
          <Skeleton className="h-[500px] w-full" />
        ) : (
          <TimeTimeline
            selectedDate={selectedDate}
            availabilities={availabilities}
            coachId={coachId}
          />
        )}
      </div>
    </div>
  )
} 