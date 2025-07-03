'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'
import db from '@/lib/db'
import { createServer } from '@/lib/supabase/server'

const createBookingSchema = z.object({
  availabilityId: z.string().cuid(),
  notes: z.string().optional(),
})

export async function createBooking(formData: FormData) {
  const supabase = createServer()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('You must be logged in to book an appointment.')
  }

  const validation = createBookingSchema.safeParse({
    availabilityId: formData.get('availabilityId'),
    notes: formData.get('notes'),
  })

  if (!validation.success) {
    throw new Error(validation.error.message)
  }

  const { availabilityId } = validation.data
  const studentId = user.id

  try {
    const result = await db.$transaction(async (prisma) => {
      // 1. Check if the slot is still available
      const availability = await prisma.availability.findUnique({
        where: { id: availabilityId },
      })

      if (!availability || availability.isBooked) {
        throw new Error('This time slot is no longer available.')
      }

      // 2. Create the booking
      const booking = await prisma.booking.create({
        data: {
          studentId: studentId,
          availabilityId: availabilityId,
          // Notes can be added here if the schema supports it.
          // The current schema does not have a notes field in Booking.
        },
      })

      // 3. Mark the availability as booked
      await prisma.availability.update({
        where: { id: availabilityId },
        data: { isBooked: true },
      })

      return booking
    })
  } catch (error) {
    console.error('Booking failed:', error)
    // In a real app, you'd want to handle this more gracefully.
    throw new Error('Failed to create booking.')
  }

  // Revalidate the booking page to show the updated availability
  revalidatePath('/booking')
  // Optionally, redirect to a confirmation page or the "My Bookings" page.
  // For now, we stay on the page, and the UI will update to a success state.
} 