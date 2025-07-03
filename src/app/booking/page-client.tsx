'use client'

import { BookingCalendar } from "@/components/booking-calendar";
import { TimeSlotPanel } from "@/components/time-slot-panel";
import { useBookingStore } from "@/lib/store/booking-store";
import { useEffect } from "react";
import { Slot } from "@/lib/types";
import { format } from "date-fns";

interface BookingClientProps {
  availableDates: Date[];
  coachId: string;
}

async function getSlotsForDate(
  date: Date,
  coachId: string
): Promise<Slot[]> {
  const dateString = format(date, 'yyyy-MM-dd');
  const response = await fetch(
    `/api/availabilities?coachId=${coachId}&date=${dateString}`
  );

  if (!response.ok) {
    throw new Error('Failed to fetch slots');
  }

  const slots = await response.json();
  return slots;
}

export default function BookingClient({
  availableDates,
  coachId,
}: BookingClientProps) {
  const { date, setDate, currentMonth, setCurrentMonth, setStatus, setSlots } =
    useBookingStore()

  useEffect(() => {
    if (!date) return;

    const fetchSlots = async () => {
      try {
        setStatus('loading');
        const fetchedSlots = await getSlotsForDate(date, coachId);
        setSlots(fetchedSlots);
        setStatus('success');
      } catch (error) {
        console.error('Failed to fetch slots:', error);
        setStatus('error');
      }
    };

    fetchSlots();
  }, [date, coachId, setStatus, setSlots]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100 p-4 sm:p-6 md:p-8">
      <div className="mx-auto grid w-full max-w-4xl grid-cols-1 overflow-hidden rounded-xl bg-white shadow-2xl md:grid-cols-3">
        <div className="md:col-span-2">
          <BookingCalendar
            availableDates={availableDates}
            selectedDate={date}
            onDateSelect={setDate}
            currentMonth={currentMonth}
            onMonthChange={setCurrentMonth}
          />
        </div>
        <div className="md:col-span-1">
          <TimeSlotPanel />
        </div>
      </div>
    </main>
  );
} 