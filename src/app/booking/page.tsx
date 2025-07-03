import db from '@/lib/db'
import BookingClient from './page-client'
import { createServer } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

// This is a Next.js Server Component.
// It's a great place to fetch data from the database.
export default async function BookingPage() {
  const supabase = createServer()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/')
  }

  // For this demo, we assume the student is assigned to the one and only coach.
  const coach = await db.user.findFirst({
    where: { role: 'COACH' },
  })

  if (!coach) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>暂无教练信息，无法预约。</p>
      </div>
    )
  }

  // Fetch all future, unbooked availabilities for the coach
  const availabilities = await db.availability.findMany({
    where: {
      coachId: coach.id,
      startTime: {
        gte: new Date(),
      },
      isBooked: false,
    },
    select: {
      startTime: true,
    },
  })

  // Get unique dates from the availabilities
  const availableDates = Array.from(
    new Set(
      availabilities.map((a) => new Date(a.startTime.toDateString()))
    )
  )

  return <BookingClient availableDates={availableDates} coachId={coach.id} />
} 