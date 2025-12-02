import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { checkApiRateLimit } from './lib/rate-limit'

// Middleware - simple session cookie check + rate limiting
// Full validation happens in SessionChecker component and API routes
export function middleware(request: NextRequest) {
  const sessionId = request.cookies.get('session')?.value
  const { pathname } = request.nextUrl
  
  // Rate limiting สำหรับ API routes
  if (pathname.startsWith('/api/')) {
    const ip = request.ip || 
      request.headers.get('x-forwarded-for')?.split(',')[0] || 
      'unknown'
    
    const rateLimit = checkApiRateLimit(ip)
    
    if (!rateLimit.success) {
      return NextResponse.json(
        { 
          error: 'Too many requests',
          resetTime: new Date(rateLimit.resetTime).toISOString(),
        },
        { 
          status: 429,
          headers: {
            'Retry-After': String(Math.ceil((rateLimit.resetTime - Date.now()) / 1000)),
          }
        }
      )
    }
  }

  // Public paths that don't require authentication
  const publicPaths = ['/login', '/privacy', '/terms', '/api/sync', '/api/test-env']
  const isPublicPath = publicPaths.some(path => pathname.startsWith(path))

  // If no session cookie and trying to access protected route
  if (!sessionId && !isPublicPath) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('from', pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

// Configure which routes should run this middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api routes (handled separately)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}

