import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Users, Calendar, ListChecks } from "lucide-react"

export default function CoachDashboardPage() {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">教练仪表盘</h1>
        <p className="text-gray-500">欢迎回来，开始新的一天吧！</p>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <DashboardCard
          title="时间管理"
          description="设置您的可预约时间"
          href="/coach/schedule"
          Icon={Calendar}
        />
        <DashboardCard
          title="预约管理"
          description="查看和管理您的预约"
          href="/coach/bookings"
          Icon={ListChecks}
        />
        <DashboardCard
          title="我的学员"
          description="查看您的学员列表"
          href="/coach/students"
          Icon={Users}
        />
      </div>
      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>今日预约</CardTitle>
            <CardDescription>您今天接下来的预约安排</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Today's bookings will be implemented here */}
            <p className="text-center text-gray-400 py-8">暂无今日预约</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function DashboardCard({ title, description, href, Icon }: { title: string, description: string, href: string, Icon: React.ElementType }) {
  return (
    <Link href={href}>
      <Card className="hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg font-medium">{title}</CardTitle>
          <Icon className="h-6 w-6 text-gray-400" />
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500">{description}</p>
        </CardContent>
      </Card>
    </Link>
  )
} 