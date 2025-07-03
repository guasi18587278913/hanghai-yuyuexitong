import { createServer } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import TopNavbar from '@/components/dashboard/top-navbar'
import Sidebar from '@/components/dashboard/sidebar'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createServer()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/')
  }

  const userRole = user.user_metadata.role
  const navbarUser = {
    name: user.user_metadata.name || user.email,
    email: user.email,
    image: user.user_metadata.avatar_url,
    role: userRole,
  }

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-zinc-900">
      <Sidebar userRole={userRole} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <TopNavbar user={navbarUser} />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  )
} 