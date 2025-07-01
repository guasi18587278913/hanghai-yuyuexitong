'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function CustomLoginPage() {
  const supabase = createClient()
  const router = useRouter()

  const [nickname, setNickname] = useState('')
  const [accessCode, setAccessCode] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Step 1: Call the custom function to get temporary login credentials
      const { data: creds, error: invokeError } = await supabase.functions.invoke('custom-login', {
        body: { nickname, accessCode },
      });

      if (invokeError) {
        const errorBody = await invokeError.context.json();
        throw new Error(errorBody.error || `Function invocation failed: ${invokeError.message}`);
      }
      if (creds.error) throw new Error(creds.error);

      // Step 2: Use the temporary credentials to sign in with the standard Supabase method
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: creds.email,
        password: creds.password,
      });

      if (signInError) throw new Error(signInError.message);

      // Step 3: Redirect on successful login
      router.push('/');
      router.refresh();
    } catch (err: any) {
      console.error("Login failed:", err);
      setError(err.message || '登录失败，请检查您的凭据。');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-sm p-8 space-y-6 bg-white rounded-2xl shadow-lg dark:bg-gray-800">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            成员登录
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            深海圈 YouTube Shorts 训练营
          </p>
        </div>
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label
              htmlFor="nickname"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              学员昵称
            </label>
            <input
              id="nickname"
              name="nickname"
              type="text"
              required
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="sailing_master"
            />
          </div>
          <div>
            <label
              htmlFor="access-code"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              专属编号
            </label>
            <input
              id="access-code"
              name="access-code"
              type="password"
              required
              value={accessCode}
              onChange={(e) => setAccessCode(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="••••••••"
            />
          </div>
          {error && (
            <p className="text-sm text-red-600 dark:text-red-500 text-center">
              {error}
            </p>
          )}
          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50"
            >
              {loading ? '登录中...' : '登 录'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}