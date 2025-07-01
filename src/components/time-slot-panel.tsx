'use client'

import React from 'react'
import { Calendar as CalendarIcon, CheckCircle2 } from 'lucide-react'
import clsx from 'clsx'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useBookingStore } from '@/lib/store/booking-store'
import type { Status, Slot } from '@/lib/types'
import { format } from 'date-fns'

export function TimeSlotPanel() {
  const { 
    status, 
    slots, 
    slot: selectedSlot, 
    setSlot: onSlotSelect, 
    reset, 
    date, 
    confirmBooking 
  } = useBookingStore();
  const timezoneOffset = `UTC${format(new Date(), 'XXX')}`

  const renderContent = () => {
    switch (status) {
      case 'loading':
        return <SkeletonGrid />;
      case 'success':
        return <TimeSlotGrid slots={slots} selectedSlot={selectedSlot} onSlotSelect={onSlotSelect} />;
      case 'error':
        return <ErrorMessage />;
      case 'confirmed':
        return <BookingSuccessMessage onReset={reset} date={date} slot={selectedSlot} />;
      case 'idle':
      default:
        return <IdleMessage />;
    }
  };

  return (
    <div className="flex flex-col h-full bg-neutral-50 p-6 border-l border-gray-200">
      <div className="flex justify-between items-center mb-4">
        <div className="text-lg font-semibold text-neutral-800">选择预约时段</div>
        <div className="text-xs font-mono text-neutral-400 bg-neutral-200 px-2 py-1 rounded">
          {timezoneOffset}
        </div>
      </div>
      <div className="flex-grow overflow-y-auto pr-2">
        {renderContent()}
      </div>

      {/* --- Confirmation Button --- */}
      {status === 'success' && selectedSlot && (
        <div className="p-4 mt-auto border-t border-gray-200">
            <Button 
                className="w-full h-12 text-base" 
                onClick={confirmBooking}
            >
                确认预约 {selectedSlot.time}
            </Button>
        </div>
      )}
    </div>
  );
}

function TimeSlotGrid({ slots, selectedSlot, onSlotSelect }: { slots: Slot[], selectedSlot: Slot | null, onSlotSelect: (slot: Slot) => void }) {
  if (slots.length === 0) {
    return <div className="text-center text-neutral-500 mt-8">当日已无可选时段</div>;
  }

  return (
    <div className="grid grid-cols-3 gap-3">
      {slots.map((slot) => (
        <button
          key={slot.time}
          disabled={!slot.available}
          onClick={() => onSlotSelect(slot)}
          aria-disabled={!slot.available}
          className={clsx(
            'w-full p-3 text-center rounded-md transition-all duration-200 border',
            {
              'text-neutral-800 bg-white border-neutral-300': slot.available,
              'text-neutral-400 bg-neutral-100 border-neutral-200 cursor-not-allowed': !slot.available,
              'hover:border-blue-600/60 hover:bg-blue-600/5': slot.available,
              'bg-blue-600 text-white border-blue-600 shadow-md': slot.available && selectedSlot?.time === slot.time,
            }
          )}
        >
          {slot.time}
        </button>
      ))}
    </div>
  );
}

function IdleMessage() {
  return (
    <div className="h-full flex flex-col items-center justify-center text-center text-neutral-400">
      <CalendarIcon className="h-12 w-12 mb-4" />
      <p className="font-medium">请先在左侧选择日期</p>
      <p className="text-sm">选择后将显示可用时间段</p>
    </div>
  );
}

function SkeletonGrid() {
  return (
    <div className="grid grid-cols-3 gap-3">
      {Array.from({ length: 9 }).map((_, i) => (
        <Skeleton key={i} className="h-12 w-full" />
      ))}
    </div>
  );
}

function ErrorMessage() {
  return (
    <div className="h-full flex flex-col items-center justify-center text-center text-red-500">
      <p className="font-medium">加载可用时间失败</p>
      <Button variant="link" onClick={() => window.location.reload()}>请重试</Button>
    </div>
  );
}

function BookingSuccessMessage({ onReset, date, slot }: { onReset: () => void; date: Date | null; slot: Slot | null }) {
  if (!date || !slot) return null;

  return (
    <div className="h-full flex flex-col items-center justify-center text-center">
      <CheckCircle2 className="w-16 h-16 text-green-500 mb-4" />
      <h3 className="text-xl font-semibold text-neutral-800">预订成功</h3>
      <div className="bg-emerald-50 text-blue-600 font-semibold p-3 rounded-lg my-4">
        {format(date, 'yyyy年M月d日')} · {slot.time}
      </div>
      <button
        onClick={onReset}
        className="mt-4 text-blue-600 font-semibold hover:underline"
      >
        预约其他时段
      </button>
    </div>
  )
} 