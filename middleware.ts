import { NextResponse } from 'next/server'
import { withAuth } from 'next-auth/middleware'

// Paths that require authentication
const protectedPaths = ['/dashboard', '/my-busundo', '/profile']

// Paths that require admin role
const adminPaths = ['/admin', '/api/admin']

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const path = req.nextUrl.pathname

    // Check admin routes
    if (adminPaths.some(p => path.startsWith(p))) {
      const userRole = (token as any)?.role || 'user'
      if (!['admin', 'superadmin'].includes(userRole)) {
        return NextResponse.redirect(new URL('/', req.url))
      }
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized({ req, token }) {
        const path = req.nextUrl.pathname

        // Check protected paths
        if (protectedPaths.some(p => path.startsWith(p))) {
          return token !== null
        }

        // Check admin paths
        if (adminPaths.some(p => path.startsWith(p))) {
          if (!token) return false
          const userRole = (token as any)?.role || 'user'
          return ['admin', 'superadmin'].includes(userRole)
        }

        return true
      },
    },
    pages: {
      signIn: '/login',
    },
  }
)

export const config = {
  matcher: [
    '/admin/:path*',
    '/dashboard/:path*',
    '/my-busundo',
    '/profile',
    '/api/admin/:path*',
  ],
}
