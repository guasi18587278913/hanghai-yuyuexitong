import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { CsvUploader } from './csv-uploader'
import db from '@/lib/db'

async function getAssignments() {
  const assignments = await db.user.findMany({
    where: {
      role: 'STUDENT',
      coachId: {
        not: null,
      },
    },
    select: {
      id: true,
      name: true,
      nickname: true, // student wechat
      assignedCoach: {
        select: {
          name: true,
          nickname: true, // coach wechat
        },
      },
    },
    orderBy: {
      assignedCoach: {
        name: 'asc'
      }
    }
  })
  return assignments
}


export async function AssignmentManager() {
  const assignments = await getAssignments()

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>批量导入与分配</CardTitle>
          <CardDescription>
            请上传 CSV 文件以批量分配学员给教练。文件格式应为：学员姓名,学员微信,教练姓名,教练微信
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CsvUploader />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>当前分配关系</CardTitle>
          <CardDescription>
            目前系统中所有已建立的学员-教练分配关系。
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>学员姓名</TableHead>
                <TableHead>学员微信</TableHead>
                <TableHead>分配的教练</TableHead>
                <TableHead>教练微信</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {assignments.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.nickname}</TableCell>
                  <TableCell>{user.assignedCoach?.name}</TableCell>
                  <TableCell>{user.assignedCoach?.nickname}</TableCell>
                </TableRow>
              ))}
               {assignments.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    暂无分配数据。
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
} 