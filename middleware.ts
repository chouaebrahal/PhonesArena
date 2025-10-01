import { NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // Skip NextAuth routes to prevent conflicts with authentication flow
  if (request.nextUrl.pathname.startsWith('/api/auth')) {
    return NextResponse.next()
  }

  const token = await getToken({ req: request })
  const isAdminRoute = request.nextUrl.pathname.startsWith('/api/admin')
  
  if (isAdminRoute && token?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all API routes except for Auth.js routes
     */
    '/api/:path*',
  ],
}