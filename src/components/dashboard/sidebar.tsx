import Link from 'next/link'
import { BrandLogo as Brand } from '@/components/icons/Brand'

interface SidebarProps {
  userRole: string | undefined
}

const menuOptions = {
  student: [
    { name: '立即预约', href: '/booking' },
    { name: '我的预约', href: '/student/bookings' },
    { name: '我的教练', href: '/student/coach' },
  ],
  coach: [
    { name: '我的预约', href: '/coach/bookings' },
    { name: '时间管理', href: '/coach/schedule' },
    { name: '我的学员', href: '/coach/students' },
  ],
  admin: [
    { name: '数据看板', href: '/admin' },
    { name: '学员管理', href: '/admin/students' },
    { name: '教练管理', href: '/admin/coaches' },
    { name: '匹配管理', href: '/admin/matching' },
  ],
}

function Sidebar({ userRole }: SidebarProps) {
  const links = menuOptions[userRole as keyof typeof menuOptions] || []

  return (
    <aside className="flex w-64 flex-col bg-white p-4 dark:bg-zinc-800 border-r dark:border-zinc-700">
      <div className="mb-8 flex items-center justify-center">
        <Link href="/" className="flex items-center gap-2">
            <Brand className="h-8 w-8" />
            <span className="text-lg font-bold">预约系统</span>
        </Link>
      </div>
      <nav className="flex flex-col gap-2">
        {links.map((link) => (
          <Link
            key={link.name}
            href={link.href}
            className="rounded-md px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-zinc-700"
          >
            {link.name}
          </Link>
        ))}
      </nav>
    </aside>
  )
}

export default Sidebar 