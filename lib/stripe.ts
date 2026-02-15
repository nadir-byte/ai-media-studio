import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

export const STRIPE_PLANS = {
  free: {
    name: 'Free',
    priceId: null,
    price: 0,
    features: [
      '10,000 API calls/month',
      '3 models',
      '1 workspace',
      'Basic analytics',
      'Community support',
    ],
    limits: {
      apiCalls: 10000,
      models: 3,
      workspaces: 1,
      teamMembers: 1,
    },
  },
  pro: {
    name: 'Pro',
    priceId: process.env.STRIPE_PRO_PRICE_ID!,
    price: 2900, // $29
    features: [
      '100,000 API calls/month',
      'Unlimited models',
      '5 workspaces',
      'Advanced analytics',
      'Priority support',
      'Team collaboration',
      'Custom rate limits',
    ],
    limits: {
      apiCalls: 100000,
      models: -1, // unlimited
      workspaces: 5,
      teamMembers: 10,
    },
  },
  enterprise: {
    name: 'Enterprise',
    priceId: process.env.STRIPE_ENTERPRISE_PRICE_ID!,
    price: 9900, // $99
    features: [
      'Unlimited API calls',
      'Unlimited models',
      'Unlimited workspaces',
      'Custom analytics',
      '24/7 support',
      'SLA guarantee',
      'Dedicated infrastructure',
      'SSO & SAML',
    ],
    limits: {
      apiCalls: -1,
      models: -1,
      workspaces: -1,
      teamMembers: -1,
    },
  },
} as const

export type PlanType = keyof typeof STRIPE_PLANS

export async function createCustomer(email: string, name: string) {
  return stripe.customers.create({
    email,
    name,
  })
}

export async function createCheckoutSession(
  customerId: string,
  priceId: string,
  successUrl: string,
  cancelUrl: string
) {
  return stripe.checkout.sessions.create({
    customer: customerId,
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    success_url: successUrl,
    cancel_url: cancelUrl,
    billing_address_collection: 'auto',
  })
}

export async function createBillingPortalSession(
  customerId: string,
  returnUrl: string
) {
  return stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  })
}

export async function getSubscription(subscriptionId: string) {
  return stripe.subscriptions.retrieve(subscriptionId)
}

export async function cancelSubscription(subscriptionId: string) {
  return stripe.subscriptions.cancel(subscriptionId)
}

export { stripe }
