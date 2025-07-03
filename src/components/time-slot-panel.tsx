'use client'

import React, { useState } from 'react'
import { Calendar as CalendarIcon, CheckCircle2 } from 'lucide-react'
import clsx from 'clsx'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useBookingStore } from '@/lib/store/booking-store'
import type { Status, Slot } from '@/lib/types'
import { format } from 'date-fns'
import { BookingConfirmDialog } from './booking-confirm-dialog'

export function TimeSlotPanel() {
  const { status, slots, reset, date, setStatus } = useBookingStore()
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null)
  const [isDialogOpen, setDialogOpen] = useState(false)

  const timezoneOffset = `UTC${format(new Date(), 'XXX')}`

  const handleSlotSelect = (slot: Slot) => {
    if (slot.available) {
      setSelectedSlot(slot)
      setDialogOpen(true)
    }
  }

  const handleBookingSuccess = () => {
    setDialogOpen(false)
    setStatus('confirmed')
  }

  const renderContent = () => {
    switch (status) {
      case 'loading':
        return <SkeletonGrid />
      case 'success':
        return (
          <TimeSlotGrid
            slots={slots}
            selectedSlot={selectedSlot}
            onSlotSelect={handleSlotSelect}
          />
        )
      case 'error':
        return <ErrorMessage />
      case 'confirmed':
        return (
          <BookingSuccessMessage
            onReset={reset}
            date={date}
            slot={selectedSlot}
          />
        )
      case 'idle':
      default:
        return <IdleMessage />
    }
  }

  return (
    <>
      <div className="flex h-full flex-col border-l border-gray-200 bg-neutral-50 p-6">
        <div className="mb-4 flex items-center justify-between">
          <div className="text-lg font-semibold text-neutral-800">
            选择预约时段
          </div>
          <div className="rounded bg-neutral-200 px-2 py-1 font-mono text-xs text-neutral-400">
            {timezoneOffset}
          </div>
        </div>
        <div className="flex-grow overflow-y-auto pr-2">{renderContent()}</div>
      </div>
      <BookingConfirmDialog
        slot={selectedSlot}
        date={date}
        open={isDialogOpen}
        onOpenChange={setDialogOpen}
        onBookingSuccess={handleBookingSuccess}
      />
    </>
  )
}

function TimeSlotGrid({
  slots,
  selectedSlot,
  onSlotSelect,
}: {
  slots: Slot[]
  selectedSlot: Slot | null
  onSlotSelect: (slot: Slot) => void
}) {
  if (slots.length === 0) {
    return (
      <div className="mt-8 text-center text-neutral-500">
        当日已无可选时段
      </div>
    )
  }

  return (
    <div className="grid grid-cols-3 gap-3">
      {slots.map((slot) => (
        <button
          key={slot.id}
          disabled={!slot.available}
          onClick={() => onSlotSelect(slot)}
          aria-disabled={!slot.available}
          className={clsx(
            'w-full rounded-md border p-3 text-center transition-all duration-200',
            {
              'border-neutral-300 bg-white text-neutral-800': slot.available,
              'cursor-not-allowed border-neutral-200 bg-neutral-100 text-neutral-400':
                !slot.available,
              'hover:border-blue-600/60 hover:bg-blue-600/5': slot.available,
              'border-blue-600 bg-blue-600 text-white shadow-md':
                slot.available && selectedSlot?.id === slot.id,
            }
          )}
        >
          {slot.time}
        </button>
      ))}
    </div>
  )
}

function IdleMessage() {
  return (
    <div className="flex h-full flex-col items-center justify-center text-center text-neutral-400">
      <CalendarIcon className="h-12 w-12 mb-4" />
      <p className="font-medium">请先在左侧选择日期</p>
      <p className="text-sm">选择后将显示可用时间段</p>
    </div>
  )
}

function SkeletonGrid() {
  return (
    <div className="grid grid-cols-3 gap-3">
      {Array.from({ length: 9 }).map((_, i) => (
        <Skeleton key={i} className="h-12 w-full" />
      ))}
    </div>
  )
}

function ErrorMessage() {
  return (
    <div className="h-full flex flex-col items-center justify-center text-center text-red-500">
      <p className="font-medium">加载可用时间失败</p>
      <Button variant="link" onClick={() => window.location.reload()}>
        请重试
      </Button>
    </div>
  )
}

function BookingSuccessMessage({
  onReset,
  date,
  slot,
}: {
  onReset: () => void
  date: Date | null
  slot: Slot | null
}) {
  if (!date || !slot) return null

  return (
    <div className="flex h-full flex-col items-center justify-center text-center">
      <CheckCircle2 className="w-16 h-16 text-green-500 mb-4" />
      <h3 className="text-xl font-semibold text-neutral-800">预订成功</h3>
      <div className="my-4 rounded-lg bg-emerald-50 p-3 font-semibold text-blue-600">
        {format(date, 'yyyy年M月d日')} · {slot.time}
      </div>
      <button
        onClick={onReset}
        className="mt-4 font-semibold text-blue-600 hover:underline"
      >
        预约其他时段
      </button>
    </div>
  )
} 