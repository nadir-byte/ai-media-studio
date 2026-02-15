'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Check, 
  Zap,
  Building2,
  Sparkles
} from 'lucide-react'

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'Perfect for getting started',
    icon: Zap,
    features: [
      '10,000 API calls/month',
      '3 models',
      '1 workspace',
      'Basic analytics',
      'Community support',
      'Rate limit: 100 req/min',
    ],
    current: true,
  },
  {
    name: 'Pro',
    price: '$29',
    period: 'per month',
    description: 'For growing teams and products',
    icon: Sparkles,
    features: [
      '100,000 API calls/month',
      'Unlimited models',
      '5 workspaces',
      'Advanced analytics',
      'Priority email support',
      'Team collaboration',
      'Custom rate limits',
      'API webhooks',
    ],
    popular: true,
  },
  {
    name: 'Enterprise',
    price: '$99',
    period: 'per month',
    description: 'For large-scale deployments',
    icon: Building2,
    features: [
      'Unlimited API calls',
      'Unlimited models',
      'Unlimited workspaces',
      'Custom analytics & reports',
      '24/7 dedicated support',
      'SLA guarantee',
      'Dedicated infrastructure',
      'SSO & SAML',
      'Custom integrations',
    ],
  },
]

export default function BillingPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Billing & Plans</h1>
        <p className="text-muted-foreground mt-1">
          Manage your subscription and billing
        </p>
      </div>

      {/* Current Plan */}
      <Card className="border-primary">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Current Plan: Free</CardTitle>
              <CardDescription>
                You're on the free plan with limited features
              </CardDescription>
            </div>
            <Badge variant="default">Active</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">
                Usage this month: 2,450 / 10,000 API calls (24.5%)
              </p>
            </div>
            <Button variant="outline">Manage Subscription</Button>
          </div>
        </CardContent>
      </Card>

      {/* Plans Grid */}
      <div className="grid gap-6 md:grid-cols-3">
        {plans.map((plan) => {
          const Icon = plan.icon
          return (
            <Card 
              key={plan.name} 
              className={`relative ${plan.popular ? 'border-primary shadow-lg scale-105' : ''}`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-primary">Most Popular</Badge>
                </div>
              )}
              
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                      plan.popular ? 'bg-primary text-primary-foreground' : 'bg-muted'
                    }`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle>{plan.name}</CardTitle>
                    </div>
                  </div>
                </div>
                <CardDescription className="mt-3">{plan.description}</CardDescription>
              </CardHeader>

              <CardContent>
                <div className="mb-6">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground ml-1">/{plan.period}</span>
                </div>

                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start">
                      <Check className="h-5 w-5 text-primary shrink-0 mr-2" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button 
                  className="w-full" 
                  variant={plan.current ? 'outline' : 'default'}
                  disabled={plan.current}
                >
                  {plan.current ? 'Current Plan' : 'Upgrade'}
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Billing History */}
      <Card>
        <CardHeader>
          <CardTitle>Billing History</CardTitle>
          <CardDescription>Your recent invoices</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-2 border-b">
              <div>
                <p className="font-medium">Free Plan</p>
                <p className="text-sm text-muted-foreground">Started Jan 15, 2024</p>
              </div>
              <Badge variant="secondary">$0.00</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
