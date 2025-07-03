import { Suspense } from 'react'
import { AssignmentManager } from '@/components/admin/assignment-manager'
import { Skeleton } from '@/components/ui/skeleton'

export default function MatchingPage() {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">学员-教练匹配管理</h1>
        <p className="mt-2 text-gray-500 dark:text-gray-400">
          在这里批量导入和查看学员与教练的分配关系。
        </p>
      </div>
      <Suspense fallback={<AssignmentManagerSkeleton />}>
        <AssignmentManager />
      </Suspense>
    </div>
  )
}

function AssignmentManagerSkeleton() {
  return (
    <div className="space-y-8">
      <Skeleton className="h-48 w-full" />
      <Skeleton className="h-64 w-full" />
    </div>
  )
} 