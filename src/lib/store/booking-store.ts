import { create } from 'zustand'
import { startOfToday } from 'date-fns'
import type { Status, Slot } from '@/lib/types'

interface BookingState {
  // --- Calendar State ---
  date: Date | null;
  currentMonth: Date;
  setDate: (date: Date | null) => void;
  setCurrentMonth: (month: Date) => void;

  // --- Time Slot State ---
  status: Status;
  slots: Slot[];
  slot: Slot | null;
  setStatus: (status: Status) => void;
  setSlots: (slots: Slot[]) => void;
  setSlot: (slot: Slot | null) => void;

  // --- Booking Action ---
  confirmBooking: () => Promise<void>;

  // --- General Actions ---
  reset: () => void;
}

const initialState = {
  date: null,
  currentMonth: startOfToday(),
  status: 'idle' as Status,
  slots: [],
  slot: null,
};

export const useBookingStore = create<BookingState>((set, get) => ({
  ...initialState,
  setDate: (date) => {
    // When a new date is set, reset the slot and set status to 'loading'
    // to trigger fetching new time slots. If date is null, go back to idle.
    set({ date, slot: null, status: date ? 'loading' : 'idle' });
  },
  setCurrentMonth: (month) => set({ currentMonth: month }),
  setStatus: (status) => set({ status }),
  setSlots: (slots) => set({ slots }),
  setSlot: (slot) => set({ slot }),
  
  confirmBooking: async () => {
    const { date, slot } = get();
    if (!date || !slot) return;

    // Here you would typically call your backend API
    // For now, we just simulate it.
    console.log(`Booking confirmed for ${date} at ${slot.time}`);
    await new Promise(resolve => setTimeout(resolve, 750)); // Simulate network delay

    set({ status: 'confirmed' });
  },

  reset: () => set(initialState),
})); 