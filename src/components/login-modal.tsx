'use client'

import { useEffect } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { toast } from 'sonner'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { BrandLogo } from '@/components/icons/Brand'

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
  role: 'student' | 'coach' | 'admin' | null
}

const roleMap = {
  student: '学员',
  coach: '教练',
  admin: '管理员',
}

// 1. Zod Schema for validation
const formSchema = z.object({
  planetId: z
    .string()
    .min(6, { message: '星球编号必须至少为6位数' })
    .max(10, { message: '星球编号不能超过10位数' })
    .regex(/^\d+$/, { message: '星球编号只能包含数字' }),
  nickname: z.string().min(1, { message: '昵称不能为空' }),
})

// 2. Main Component
export function LoginModal({ isOpen, onClose, role }: LoginModalProps) {
  const router = useRouter()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      planetId:
        typeof window !== 'undefined'
          ? localStorage.getItem('lastPlanetId') || ''
          : '',
      nickname: '',
    },
  })

  // Auto-focus on planet id input when modal opens
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        form.setFocus('planetId')
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [isOpen, form])

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!role) {
      toast.error('用户角色未指定，无法登录。')
      return
    }

    const result = await signIn('credentials', {
      redirect: false,
      planetId: values.planetId,
      nickname: values.nickname,
      role: role.toUpperCase(),
    })

    if (result?.ok) {
      toast.success('登录成功，即将跳转...')
      localStorage.setItem('lastPlanetId', values.planetId)
      
      setTimeout(() => {
        onClose()
        // Corrected redirect path to the root of the role's dashboard
        router.push(`/${role}`) 
        router.refresh()
      }, 1000)
    } else {
      toast.error(result?.error || '登录失败，请检查您的星球编号和昵称。')
    }
  }

  if (!role) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className={cn(
          'w-[90%] rounded-2xl p-8 shadow-2xl dark:bg-zinc-800 dark:text-zinc-100 md:w-[360px]'
        )}
        aria-labelledby="login-title"
      >
        <DialogHeader className="flex flex-row items-center space-x-4">
          <BrandLogo className="h-6 w-6" />
          <DialogTitle id="login-title" className="text-xl font-bold">
            {roleMap[role]} 登录
          </DialogTitle>
        </DialogHeader>
        <DialogDescription>
          请输入您的星球编号和昵称以继续。
        </DialogDescription>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="planetId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>星球编号</FormLabel>
                  <FormControl>
                    <Input placeholder="请输入6-10位数字" {...field} />
                  </FormControl>
                  <FormMessage className="mt-1 text-sm text-red-500" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="nickname"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>昵称</FormLabel>
                  <FormControl>
                    <Input placeholder="请输入您的星球昵称" {...field} />
                  </FormControl>
                  <FormMessage className="mt-1 text-sm text-red-500" />
                </FormItem>
              )}
            />
            {/* TODO: Add a comment for WebAuthn/passkey integration
                // PLAN: If planetCode is valid, show a "Login with Passkey" button here.
            */}
            <Button
              type="submit"
              className="w-full"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? '登录中...' : '登 录'}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
} 