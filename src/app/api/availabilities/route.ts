import { NextResponse } from 'next/server'
import db from '@/lib/db'
import { z } from 'zod'
import { startOfDay, endOfDay } from 'date-fns'

const getAvailabilitiesSchema = z.object({
  coachId: z.string(),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Invalid date string',
  }),
})

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)

  const validation = getAvailabilitiesSchema.safeParse({
    coachId: searchParams.get('coachId'),
    date: searchParams.get('date'),
  })

  if (!validation.success) {
    return NextResponse.json(
      { error: 'Invalid input', details: validation.error.flatten() },
      { status: 400 }
    )
  }

  const { coachId, date } = validation.data
  const targetDate = new Date(date)
  const startTime = startOfDay(targetDate)
  const endTime = endOfDay(targetDate)

  try {
    const slots = await db.availability.findMany({
      where: {
        coachId,
        startTime: {
          gte: startTime,
          lt: endTime,
        },
      },
      select: {
        id: true,
        startTime: true,
        isBooked: true,
      },
      orderBy: {
        startTime: 'asc',
      },
    })

    const formattedSlots = slots.map((slot) => ({
      id: slot.id,
      time: slot.startTime.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      }),
      available: !slot.isBooked,
    }))

    return NextResponse.json(formattedSlots)
  } catch (error) {
    console.error('Failed to fetch availability slots:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
} 