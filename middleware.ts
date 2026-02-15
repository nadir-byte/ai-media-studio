import { clerkMiddleware } from '@clerk/nextjs/server'

export default clerkMiddleware({
  // Public routes that don't require authentication
  publicRoutes: ['/', '/sign-in', '/sign-up', '/api/webhook'],
})

export const config = {
  matcher: ['/((?!_next|.*\\..*).*)'],
}
