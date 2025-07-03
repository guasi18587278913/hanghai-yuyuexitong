import { NextResponse } from 'next/server'
import db from '@/lib/db'
import { z } from 'zod'
import { startOfDay, endOfDay } from 'date-fns'
import { createServer } from '@/lib/supabase/server'

const getAvailabilitiesSchema = z.object({
  coachId: z.string(),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Invalid date string',
  }),
})

export async function GET(request: Request) {
  const supabase = createServer()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user || user.user_metadata.role !== 'COACH') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

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
  
  // A coach should only be able to get their own availability
  if(user.id !== validation.data.coachId) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { coachId, date } = validation.data
  const targetDate = new Date(date)
  const startTime = startOfDay(targetDate)
  const endTime = endOfDay(targetDate)

  try {
    const availabilities = await db.availability.findMany({
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
    return NextResponse.json(availabilities)
  } catch (error) {
    console.error('Failed to fetch availability:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
} 