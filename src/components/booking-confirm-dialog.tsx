'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { createBooking } from '@/app/booking/actions'
import { Slot } from '@/lib/types'
import { format } from 'date-fns'
import { useTransition } from 'react'
import { Loader2 } from 'lucide-react'

interface BookingConfirmDialogProps {
  slot: Slot | null
  date: Date | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onBookingSuccess: () => void
}

export function BookingConfirmDialog({
  slot,
  date,
  open,
  onOpenChange,
  onBookingSuccess,
}: BookingConfirmDialogProps) {
  const [isPending, startTransition] = useTransition()

  if (!slot || !date) return null

  const handleBooking = async (formData: FormData) => {
    startTransition(async () => {
      try {
        await createBooking(formData)
        onBookingSuccess()
      } catch (error) {
        // TODO: Handle error with a toast notification
        console.error(error)
        onOpenChange(false)
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>确认预约信息</DialogTitle>
          <DialogDescription>
            请核对您的预约时间，确认无误后提交。
          </DialogDescription>
        </DialogHeader>
        <form action={handleBooking}>
          <input type="hidden" name="availabilityId" value={slot.id} />
          <div className="space-y-4 py-4">
            <div className="flex items-center justify-between rounded-md bg-gray-100 p-3 dark:bg-zinc-800">
              <span className="text-sm font-medium">日期</span>
              <span className="font-semibold">{format(date, 'yyyy年M月d日')}</span>
            </div>
            <div className="flex items-center justify-between rounded-md bg-gray-100 p-3 dark:bg-zinc-800">
              <span className="text-sm font-medium">时间</span>
              <span className="font-semibold">{slot.time}</span>
            </div>
            <div>
              <label htmlFor="notes" className="mb-2 block text-sm font-medium">
                备注 (可选)
              </label>
              <Textarea
                id="notes"
                name="notes"
                placeholder="如有特殊要求，请在此说明..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              取消
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              确认预约
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
} 