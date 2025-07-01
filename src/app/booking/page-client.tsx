'use client'

import { BookingCalendar } from "@/components/booking-calendar";
import { TimeSlotPanel } from "@/components/time-slot-panel";
import { useBookingStore } from "@/lib/store/booking-store";
import { useEffect } from "react";
import { Slot } from "@/lib/types";
import { format } from "date-fns";

interface BookingClientProps {
  availableDates: Date[];
}

// Mock function to simulate fetching slots from an API
async function getSlotsForDate(date: Date): Promise<Slot[]> {
  console.log(`Fetching slots for ${format(date, 'yyyy-MM-dd')}...`);
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500)); 

  // In a real app, you'd fetch this from your database based on the selected date.
  // For this demo, we'll return some mock slots.
  const hour = date.getDate() % 5; // Just to make different dates have different slots
  return [
    { time: '09:00', available: hour !== 1 },
    { time: '10:00', available: true },
    { time: '11:00', available: hour !== 2 },
    { time: '12:00', available: false },
    { time: '13:00', available: true },
    { time: '14:00', available: hour !== 3 },
    { time: '15:00', available: true },
    { time: '16:00', available: hour !== 4 },
    { time: '17:00', available: true },
  ];
}


export default function BookingClient({ availableDates }: BookingClientProps) {
  const { date, setStatus, setSlots } = useBookingStore();

  useEffect(() => {
    // This effect runs whenever the selected date changes.
    if (!date) return;

    const fetchSlots = async () => {
      try {
        setStatus('loading');
        const fetchedSlots = await getSlotsForDate(date);
        setSlots(fetchedSlots);
        setStatus('success');
      } catch (error) {
        console.error("Failed to fetch slots:", error);
        setStatus('error');
      }
    };

    fetchSlots();
  }, [date, setStatus, setSlots]);


  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100 p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 bg-white rounded-xl shadow-2xl overflow-hidden">
        <div className="md:col-span-2">
          <BookingCalendar availableDates={availableDates} />
        </div>
        <div className="md:col-span-1">
          <TimeSlotPanel />
        </div>
      </div>
    </main>
  );
} 