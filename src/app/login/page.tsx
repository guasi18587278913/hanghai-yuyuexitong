'use client'

import { createClient } from '@/lib/supabase/client'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function LoginPage() {
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        // Redirect to home page if user is already logged in
        router.push('/')
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase, router])

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-2xl shadow-lg">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">
            欢迎来到
          </h1>
          <h2 className="text-3xl font-extrabold text-emerald-500 mt-1">
            {process.env.NEXT_PUBLIC_APP_NAME}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            请登录以继续
          </p>
        </div>
        <Auth
          supabaseClient={supabase}
          appearance={{ theme: ThemeSupa }}
          theme="light"
          providers={['google', 'github']}
          redirectTo={`${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback`}
          localization={{
            variables: {
              sign_in: {
                email_label: '邮箱地址',
                password_label: '密码',
                button_label: '登录',
                social_provider_text: '通过 {{provider}} 登录',
                link_text: '已有账户？登录',
              },
              sign_up: {
                email_label: '邮箱地址',
                password_label: '创建密码',
                button_label: '注册',
                social_provider_text: '通过 {{provider}} 注册',
                link_text: '没有账户？注册',
              },
              forgotten_password: {
                email_label: '邮箱地址',
                button_label: '发送重置邮件',
                link_text: '忘记密码？',
              },
            },
          }}
        />
      </div>
    </div>
  )
}