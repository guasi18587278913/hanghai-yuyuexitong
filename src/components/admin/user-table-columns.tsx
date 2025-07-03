'use client'

import { ColumnDef } from '@tanstack/react-table'
import { MoreHorizontal, ArrowUpDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { updateUserRole, toggleUserStatus } from '@/app/(dashboard)/admin/users/actions'

// This type is manually created based on the prisma schema to ensure type safety.
export type User = {
  id: string
  name: string | null
  nickname: string | null
  email: string | null
  role: string
  isActive: boolean
  assignedCoach: {
    name: string | null
  } | null
  assignedStudents: {
    id: string
  }[]
}

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: 'name',
    header: '姓名',
  },
  {
    accessorKey: 'nickname',
    header: '微信 (昵称)',
  },
  {
    accessorKey: 'role',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          角色
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
        const role = row.getValue('role') as string;
        const variant = {
            ADMIN: 'destructive',
            COACH: 'secondary',
            STUDENT: 'outline',
        }[role] || 'default';
        
        return <Badge variant={variant as any}>{role}</Badge>
    }
  },
  {
    id: 'assignment',
    header: '分配关系',
    cell: ({ row }) => {
        const user = row.original
        if(user.role === 'STUDENT') {
            return user.assignedCoach ? `教练: ${user.assignedCoach.name}` : '未分配'
        }
        if(user.role === 'COACH') {
            return `学员数: ${user.assignedStudents.length}`
        }
        return 'N/A'
    }
  },
  {
    accessorKey: 'isActive',
    header: '状态',
    cell: ({ row }) => {
        const isActive = row.getValue('isActive')
        return <Badge variant={isActive ? 'default' : 'destructive'}>{isActive ? '已激活' : '已禁用'}</Badge>
    }
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const user = row.original
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>操作</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(user.id)}
            >
              复制用户ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={() => toggleUserStatus(user.id, !user.isActive)}>
              {user.isActive ? '禁用' : '激活'}
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => updateUserRole(user.id, user.role === 'COACH' ? 'STUDENT' : 'COACH')}>
              {user.role === 'COACH' ? '降为学员' : '提升为教练'}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
] 