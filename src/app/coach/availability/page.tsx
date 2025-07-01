import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"

// This is a protected route.
// It will check for a valid session and user role on the server.
export default async function CoachAvailabilityPage() {
  const session = await getServerSession(authOptions)

  // 1. If no session, or no user, or the user is not a coach, redirect to login.
  if (!session || !session.user || (session.user as any).role !== 'COACH') {
    redirect('/login')
  }

  // 2. If the user is a coach, show the page content.
  // We'll pass the user object to a client component to manage the UI.
  const user = session.user;

  return (
    <div>
      <h1>你好, 教练 {user.name}!</h1>
      <p>在这里管理你的可预约时间。</p>
      <p>用户ID: {user.id}</p>
      {/* 
        Coming soon: A client component to manage availability
        <AvailabilityManager coachId={user.id} /> 
      */}
    </div>
  )
} 