'use server'

import db from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const userRoleSchema = z.enum(['STUDENT', 'COACH', 'ADMIN'])

// Action to update a user's role
export async function updateUserRole(userId: string, newRole: string) {
  const validatedRole = userRoleSchema.safeParse(newRole)
  if (!validatedRole.success) {
    throw new Error('Invalid role specified.')
  }

  await db.user.update({
    where: { id: userId },
    data: { role: validatedRole.data },
  })

  revalidatePath('/admin/users')
}

// Action to toggle a user's active status
export async function toggleUserStatus(userId: string, isActive: boolean) {
  await db.user.update({
    where: { id: userId },
    data: { isActive },
  })

  revalidatePath('/admin/users')
} 