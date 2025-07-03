'use client'

import { useState } from 'react'
import Link from 'next/link'
import { LoginModal } from '@/components/login-modal'

type Role = 'student' | 'coach' | 'admin'

export default function HomePage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedRole, setSelectedRole] = useState<Role | null>(null)

  const handleRoleSelect = (role: Role) => {
    setSelectedRole(role)
    setIsModalOpen(true)
  }

  return (
    <>
      <LoginModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        role={selectedRole}
      />
      <div className="flex min-h-screen flex-col items-center justify-center bg-teal-50 text-teal-900">
        <header className="absolute top-0 left-0 w-full p-8">
          <h1 className="text-2xl font-bold">生财有术</h1>
      </header>
      
        <main className="flex flex-col items-center text-center">
          <span className="mb-4 inline-block rounded-full bg-amber-200 px-4 py-1 text-sm font-semibold text-amber-800">
            内部专用
          </span>
          <h2 className="text-5xl font-extrabold">
            深海圈 · YouTube Shorts 训练营
        </h2>
          <p className="mt-4 text-lg text-gray-500">
            两步预约 · 30秒搞定和教练的1v1
        </p>
          <div className="mt-10 flex space-x-4">
            <button
              onClick={() => handleRoleSelect('student')}
              className="rounded-lg bg-emerald-500 px-8 py-3 text-lg font-semibold text-white shadow-md transition hover:bg-emerald-600"
          >
              我是学员，立即预约
            </button>
            <button
              onClick={() => handleRoleSelect('coach')}
              className="rounded-lg bg-amber-400 px-8 py-3 text-lg font-semibold text-gray-900 shadow-md transition hover:bg-amber-500"
          >
            我是教练
            </button>
            <button
              onClick={() => handleRoleSelect('admin')}
              className="rounded-lg border border-gray-200 bg-white px-8 py-3 text-lg font-semibold text-gray-700 shadow-md transition hover:bg-gray-100"
            >
              我是管理员
            </button>
          </div>
        </main>

        <footer className="absolute bottom-0 left-0 p-8">
          <Link
            href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg
              aria-label="Vercel logomark"
              role="img"
              viewBox="0 0 74 64"
              className="h-8 w-auto text-black"
            >
              <path
                d="M37.5896 0.25L74.5396 64.25H0.639648L37.5896 0.25Z"
                fill="currentColor"
              ></path>
            </svg>
          </Link>
      </footer>
    </div>
    </>
  )
} 