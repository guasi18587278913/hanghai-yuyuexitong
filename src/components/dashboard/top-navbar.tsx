'use client'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

interface TopNavbarProps {
  user: {
    name?: string | null
    email?: string | null
    image?: string | null
    role?: string | null
  }
}

// A mapping from role enum to display string
const roleDisplayNames = {
  STUDENT: '学员',
  COACH: '教练',
  ADMIN: '管理员',
}

export default function TopNavbar({ user }: TopNavbarProps) {
  const router = useRouter()
  const supabase = createClient()
  const userInitial = user.name?.charAt(0).toUpperCase() || 'U'
  const userRole = user.role as keyof typeof roleDisplayNames

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh() // To ensure server components re-render
  }

  return (
    <header className="flex items-center justify-between border-b bg-white px-6 py-3 dark:border-zinc-700 dark:bg-zinc-800">
      <div>
        {/* Can add a mobile menu button here */}
      </div>
      <div className="flex items-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2">
              <Avatar>
                <AvatarImage src={user.image || undefined} alt={user.name || 'User'} />
                <AvatarFallback>{userInitial}</AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>
              <div className="font-bold">{user.name}</div>
              <div className="text-xs text-zinc-500">
                {roleDisplayNames[userRole] || '用户'}
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={handleLogout}>
              登出
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
} 