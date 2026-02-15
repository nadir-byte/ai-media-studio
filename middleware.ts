import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api/webhooks(.*)',
  '/api/health',
  '/pricing',
  '/pricing/self-hosted',
])

export default clerkMiddleware((auth, req) => {
  // Public routes don't need auth
  if (isPublicRoute(req)) {
    return
  }

  // Protected routes - Clerk will handle auth
  auth().protect()
})

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
}
