import { User, columns } from '@/components/admin/user-table-columns'
import { DataTable } from '@/components/ui/data-table'
import db from '@/lib/db'

async function getUsers(): Promise<User[]> {
  const users = await db.user.findMany({
    where: {
      role: {
        not: 'ADMIN',
      },
    },
    select: {
      id: true,
      name: true,
      nickname: true,
      email: true,
      role: true,
      isActive: true,
      assignedCoach: {
        select: {
          name: true,
        },
      },
      assignedStudents: {
        select: {
          id: true,
        },
      },
    },
  })
  return users
}

export default async function UsersPage() {
  const data = await getUsers()

  return (
    <div className="container mx-auto p-6">
       <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">用户管理</h1>
        <p className="mt-2 text-gray-500 dark:text-gray-400">
          管理系统中的所有学员和教练。
        </p>
      </div>
      <DataTable 
        columns={columns} 
        data={data}
        filterColumnId="nickname"
        filterPlaceholder="按微信(昵称)筛选..."
      />
    </div>
  )
} 