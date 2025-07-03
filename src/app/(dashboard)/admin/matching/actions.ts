'use server'

import db from '@/lib/db'
import { z } from 'zod'
import { revalidatePath } from 'next/cache'

const AssignmentRowSchema = z.object({
  studentName: z.string().min(1, '学员姓名不能为空'),
  studentWechat: z.string().min(1, '学员微信不能为空'),
  coachName: z.string().min(1, '教练姓名不能为空'),
  coachWechat: z.string().min(1, '教练微信不能为空'),
})

const AssignmentsSchema = z.array(AssignmentRowSchema)

type ParsedAssignments = z.infer<typeof AssignmentsSchema>

export async function processAssignments(assignments: ParsedAssignments) {
  const validation = AssignmentsSchema.safeParse(assignments)
  if (!validation.success) {
    throw new Error('CSV 数据格式不正确: ' + validation.error.message)
  }

  const data = validation.data

  try {
    const result = await db.$transaction(async (prisma) => {
      const results = []
      for (const row of data) {
        // Upsert coach (find by wechat/nickname, create if not exist)
        const coach = await prisma.user.upsert({
          where: { nickname: row.coachWechat },
          update: { name: row.coachName },
          create: {
            name: row.coachName,
            nickname: row.coachWechat,
            role: 'COACH',
          },
        })

        // Upsert student and assign coach
        const student = await prisma.user.upsert({
          where: { nickname: row.studentWechat },
          update: { name: row.studentName, coachId: coach.id },
          create: {
            name: row.studentName,
            nickname: row.studentWechat,
            role: 'STUDENT',
            coachId: coach.id,
          },
        })
        results.push({ student, coach })
      }
      return results
    })
    
    revalidatePath('/admin/matching')
    return { success: true, count: result.length }
  } catch (error: any) {
    console.error('Failed to process assignments:', error)
    return { success: false, error: error.message }
  }
} 