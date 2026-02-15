import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { ConvexHttpClient } from 'convex/browser'

const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api/webhooks(.*)',
  '/api/health',
  '/pricing',
  '/pricing/self-hosted',
])

// Convex client for server-side calls
const convexClient = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!)

export default clerkMiddleware(async (auth, req) => {
  // Public routes don't need subscription check
  if (isPublicRoute(req)) {
    return
  }

  // Check if user is authenticated
  const { userId } = auth()
  if (!userId) {
    // Let Clerk handle the auth redirect
    return
  }

  // For protected routes, check subscription via Convex
  try {
    // Check if user has active subscription
    const result = await convexClient.query('subscriptions:hasActiveSubscription', {})
    
    if (!result) {
      // Redirect to pricing if no subscription
      return Response.redirect(new URL('/pricing', req.url))
    }
  } catch (error) {
    console.error('Error checking subscription:', error)
    // If we can't verify subscription, redirect to pricing
    return Response.redirect(new URL('/pricing', req.url))
  }
})

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
}
