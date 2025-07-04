import { type NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { type User } from '@supabase/supabase-js'

export async function updateSession(request: NextRequest): Promise<{
  user: User | null
  response: NextResponse
}> {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name) => request.cookies.get(name)?.value,
        set: (name, value, options) => {
          supabaseResponse.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove: (name, options) => {
          supabaseResponse.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  return { user, response: supabaseResponse }
} 