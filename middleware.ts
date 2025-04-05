import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request })
  const isAuthenticated = !!token
  
  // Protected routes patterns
  const protectedPaths = ['/dashboard', '/resources/create', '/assessments/create']
  const isProtectedPath = protectedPaths.some(path => 
    request.nextUrl.pathname.startsWith(path)
  )
  
  if (isProtectedPath && !isAuthenticated) {
    const redirectUrl = new URL('/auth/signin', request.url)
    redirectUrl.searchParams.set('callbackUrl', request.nextUrl.pathname)
    return NextResponse.redirect(redirectUrl)
  }
  
  // Role-based authorization
  if (isAuthenticated && token.role) {
    // Admin-only paths
    const adminPaths = ['/admin']
    const isAdminPath = adminPaths.some(path => 
      request.nextUrl.pathname.startsWith(path)
    )
    
    if (isAdminPath && token.role !== 'ADMINISTRATOR') {
      return NextResponse.redirect(new URL('/unauthorized', request.url))
    }
    
    // Specialist-only paths
    const specialistPaths = ['/dashboard/cases', '/dashboard/interventions']
    const isSpecialistPath = specialistPaths.some(path => 
      request.nextUrl.pathname.startsWith(path)
    )
    
    if (isSpecialistPath && token.role !== 'SPECIALIST' && token.role !== 'ADMINISTRATOR') {
      return NextResponse.redirect(new URL('/unauthorized', request.url))
    }
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|auth/signin|auth/signup).*)',
  ],
}