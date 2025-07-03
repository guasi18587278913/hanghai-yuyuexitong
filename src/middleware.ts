import { updateSession } from '@/lib/supabase/middleware'
import { type NextRequest, NextResponse } from 'next/server'

export async function middleware(request: NextRequest) {
  const { user, response } = await updateSession(request)
  const { pathname } = request.nextUrl

  // Define protected routes and their required roles
  const roleBasedRoutes = {
    '/admin': 'admin',
    '/coach': 'coach',
    '/student': 'student',
  }

  const rolePaths = Object.keys(roleBasedRoutes)
  const userRole = user?.user_metadata?.role

  // If user is not logged in
  if (!user) {
    // If trying to access a protected route, redirect to home
    if (rolePaths.some((path) => pathname.startsWith(path))) {
      return NextResponse.redirect(new URL('/', request.url))
    }
    return response // Allow access to public pages
  }

  // If user is logged in
  if (user) {
    // If at the root, redirect to their dashboard
    if (pathname === '/') {
      const redirectUrl = new URL(`/${userRole}`, request.url)
      return NextResponse.redirect(redirectUrl)
    }

    // Check if the user is trying to access a role-specific page
    for (const [path, requiredRole] of Object.entries(roleBasedRoutes)) {
      if (pathname.startsWith(path) && userRole !== requiredRole) {
        // If role doesn't match, redirect to their own dashboard
        const redirectUrl = new URL(`/${userRole}`, request.url)
        return NextResponse.redirect(redirectUrl)
      }
    }
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - api (API routes)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|api).*)',
  ],
} 