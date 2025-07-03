import { AvailabilityEditor } from '@/components/coach/availability-editor'
import { createServer } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import db from '@/lib/db'
import { startOfMonth, endOfMonth } from 'date-fns'

export default async function SchedulePage() {
  const supabase = createServer()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user || user.user_metadata.role !== 'COACH') {
    redirect('/')
  }

  const today = new Date()
  const start = startOfMonth(today)
  const end = endOfMonth(today)

  const initialAvailabilities = await db.availability.findMany({
    where: {
      coachId: user.id,
      startTime: {
        gte: start,
        lte: end,
      },
    },
    select: {
      startTime: true,
    },
  })

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">时间管理</h1>
        <p className="mt-2 text-gray-500 dark:text-gray-400">
          在这里设置您的可预约时间段。点击日历中的日期，然后在右侧的时间轴上选择或取消选择可用时段。
        </p>
      </div>
      <AvailabilityEditor
        coachId={user.id}
        initialAvailabilities={initialAvailabilities}
      />
    </div>
  )
} 