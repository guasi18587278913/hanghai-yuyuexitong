import Link from 'next/link'
import { CoachInfo } from '@/components/dashboard/coach-info'
import { Button } from '@/components/ui/button'
import db from '@/lib/db'

export default async function StudentDashboardPage() {
  // Assuming there is only one coach for simplicity
  const coach = await db.user.findFirst({
    where: {
      role: 'COACH',
    },
  })

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8 grid gap-6 md:grid-cols-2">
        <div className="flex flex-col justify-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-50 sm:text-4xl">
            欢迎回来！
          </h1>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
            准备好开始新的学习旅程了吗？
          </p>
          <div className="mt-6">
            <Button asChild size="lg">
              <Link href="/booking">立即预约</Link>
            </Button>
          </div>
        </div>
        <CoachInfo coach={coach} />
      </div>
    </div>
  )
} 