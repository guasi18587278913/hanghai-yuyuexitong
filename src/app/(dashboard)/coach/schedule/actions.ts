'use server'

import { revalidatePath } from 'next/cache'
import db from '@/lib/db'
import { createServer } from '@/lib/supabase/server'
import { z } from 'zod'
import { startOfDay, endOfDay } from 'date-fns'

const slotActionSchema = z.object({
  coachId: z.string(),
  slot: z.string().datetime(),
})

// Action to create a new availability slot
export async function createAvailability(formData: FormData) {
  const supabase = createServer()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || user.user_metadata.role !== 'COACH') {
    throw new Error('Unauthorized')
  }

  const validated = slotActionSchema.safeParse({
    coachId: user.id,
    slot: formData.get('slot'),
  })

  if (!validated.success) {
    throw new Error('Invalid input for createAvailability')
  }

  const { coachId, slot } = validated.data
  const startTime = new Date(slot)
  const endTime = new Date(startTime.getTime() + 60 * 60 * 1000) // Assuming 1-hour slots

  await db.availability.create({
    data: {
      coachId,
      startTime,
      endTime,
    },
  })

  revalidatePath('/coach/schedule')
}

// Action to delete an existing availability slot
export async function deleteAvailability(formData: FormData) {
   const supabase = createServer()
   const { data: { user } } = await supabase.auth.getUser()
   if (!user || user.user_metadata.role !== 'COACH') {
     throw new Error('Unauthorized')
   }

  const validated = slotActionSchema.safeParse({
    coachId: user.id,
    slot: formData.get('slot'),
  })

  if (!validated.success) {
    throw new Error('Invalid input for deleteAvailability')
  }

  const { coachId, slot } = validated.data
  const startTime = new Date(slot)

  // Find the specific availability slot to delete
  const availability = await db.availability.findFirst({
    where: {
      coachId,
      startTime,
    },
  })

  if (availability) {
    if(availability.isBooked) {
      throw new Error("Cannot delete an availability that is already booked.")
    }
    await db.availability.delete({
      where: { id: availability.id },
    })
  }

  revalidatePath('/coach/schedule')
} 