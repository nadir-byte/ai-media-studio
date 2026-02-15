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

export default clerkMiddleware(async (auth, req) => {
  // Public routes don't need auth
  if (isPublicRoute(req)) {
    return
  }

  // Check if user is authenticated - Clerk handles the rest
  const { userId } = auth()
  if (!userId) {
    // Let Clerk handle the auth redirect
    return
  }

  // User is authenticated, let them through
  // Subscription checks happen in page components, not middleware
})

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
}
