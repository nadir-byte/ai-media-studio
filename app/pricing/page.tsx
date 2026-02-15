import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Box, 
  Check,
  ArrowRight,
  Server,
  Cloud,
  Download,
  Rocket,
  Shield,
  Zap,
  Clock,
  HeadphonesIcon,
  RefreshCw
} from 'lucide-react'

const selfHostedFeatures = [
  { icon: Code, text: 'Full source code access' },
  { icon: Server, text: 'Docker & Docker Compose support' },
  { icon: Shield, text: 'Your own infrastructure' },
  { icon: RefreshCw, text: 'Lifetime updates' },
  { icon: HeadphonesIcon, text: 'Community support' },
  { icon: Zap, text: 'Deploy anywhere you want' },
]

const hostedFeatures = [
  { icon: Rocket, text: 'No setup required' },
  { icon: Cloud, text: 'We handle everything' },
  { icon: Shield, text: 'Secure API key storage' },
  { icon: RefreshCw, text: 'Automatic updates' },
  { icon: Clock, text: '99.9% uptime SLA' },
  { icon: HeadphonesIcon, text: 'Priority email support' },
]

function Code(props: any) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  )
}

const faqs = [
  {
    question: 'What\'s the difference between Self-Hosted and Hosted?',
    answer: 'Self-Hosted gives you full source code to run on your own servers (VPS, AWS, etc.). Hosted means we run everything for you - just sign up and start using it immediately.',
  },
  {
    question: 'Is this really a one-time payment?',
    answer: 'Yes! Both options are lifetime access with a single payment. No subscriptions, no recurring fees.',
  },
  {
    question: 'What does "lifetime updates" include?',
    answer: 'You\'ll receive all future updates and new features at no additional cost. We\'re constantly improving the platform.',
  },
  {
    question: 'Can I self-host on any platform?',
    answer: 'Yes! Use Docker on any VPS (DigitalOcean, Linode, AWS, GCP, Azure), your own servers, or even locally. Full documentation included.',
  },
  {
    question: 'What\'s included in the Hosted plan?',
    answer: 'We manage infrastructure, security, backups, and updates. You just sign up, add your API keys, and start using the platform.',
  },
  {
    question: 'Do you offer refunds?',
    answer: 'Yes, we offer a 14-day money-back guarantee if you\'re not satisfied.',
  },
]

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      {/* Navigation */}
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Box className="h-8 w-8 text-primary" />
            <span className="font-bold text-xl">AI Media Studio</span>
          </Link>
          <div className="flex items-center space-x-4">
            <Link href="/sign-in">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/sign-up">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="container mx-auto px-4 py-16 text-center">
        <Badge variant="outline" className="mb-4">
          <Zap className="h-3 w-3 mr-1" />
          Lifetime Access
        </Badge>
        <h1 className="text-4xl md:text-5xl font-bold mb-6">
          Simple, Transparent Pricing
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          One-time payment. Lifetime access. No subscriptions or hidden fees.
        </p>
      </section>

      {/* Pricing Cards */}
      <section className="container mx-auto px-4 py-8">
        <div className="grid gap-8 md:grid-cols-2 max-w-5xl mx-auto">
          {/* Self-Hosted */}
          <Card id="self-hosted" className="relative">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto mb-4">
                <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
                  <Server className="h-8 w-8 text-muted-foreground" />
                </div>
              </div>
              <CardTitle className="text-2xl">Self-Hosted</CardTitle>
              <CardDescription>Full control over your infrastructure</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center mb-6">
                <span className="text-5xl font-bold">$99</span>
                <span className="text-muted-foreground"> lifetime</span>
              </div>
              
              <ul className="space-y-3 mb-6">
                {selfHostedFeatures.map((feature) => {
                  const Icon = feature.icon
                  return (
                    <li key={feature.text} className="flex items-start gap-3">
                      <Icon className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <span className="text-sm">{feature.text}</span>
                    </li>
                  )
                })}
              </ul>
              
              <Button className="w-full" variant="outline" size="lg">
                <Download className="mr-2 h-4 w-4" />
                Buy Now - $99
              </Button>
              <p className="text-xs text-muted-foreground text-center mt-2">
                Payment via Gumroad • Instant download
              </p>
            </CardContent>
          </Card>

          {/* Hosted */}
          <Card id="hosted" className="relative border-primary shadow-lg">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <Badge>Recommended</Badge>
            </div>
            <CardHeader className="text-center pb-4">
              <div className="mx-auto mb-4">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <Cloud className="h-8 w-8 text-primary" />
                </div>
              </div>
              <CardTitle className="text-2xl">Hosted</CardTitle>
              <CardDescription>We handle everything for you</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center mb-6">
                <span className="text-5xl font-bold">$199</span>
                <span className="text-muted-foreground"> lifetime</span>
              </div>
              
              <ul className="space-y-3 mb-6">
                {hostedFeatures.map((feature) => {
                  const Icon = feature.icon
                  return (
                    <li key={feature.text} className="flex items-start gap-3">
                      <Icon className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <span className="text-sm">{feature.text}</span>
                    </li>
                  )
                })}
              </ul>
              
              <Button className="w-full" size="lg">
                <Rocket className="mr-2 h-4 w-4" />
                Get Started - $199
              </Button>
              <p className="text-xs text-muted-foreground text-center mt-2">
                Payment via Gumroad • Instant access
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Feature Comparison Table */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-center mb-8">Feature Comparison</h2>
        <Card className="max-w-4xl mx-auto overflow-hidden">
          <CardContent className="p-0">
            <table className="w-full">
              <thead className="bg-muted">
                <tr>
                  <th className="p-4 text-left font-semibold">Feature</th>
                  <th className="p-4 text-center font-semibold">
                    <div className="flex items-center justify-center gap-2">
                      <Server className="h-4 w-4" />
                      Self-Hosted
                    </div>
                  </th>
                  <th className="p-4 text-center font-semibold bg-primary/5">
                    <div className="flex items-center justify-center gap-2">
                      <Cloud className="h-4 w-4" />
                      Hosted
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                <tr>
                  <td className="p-4">Full Source Code</td>
                  <td className="p-4 text-center"><Check className="h-5 w-5 text-primary mx-auto" /></td>
                  <td className="p-4 text-center bg-primary/5"><Check className="h-5 w-5 text-primary mx-auto" /></td>
                </tr>
                <tr>
                  <td className="p-4">Docker Support</td>
                  <td className="p-4 text-center"><Check className="h-5 w-5 text-primary mx-auto" /></td>
                  <td className="p-4 text-center bg-primary/5"><Check className="h-5 w-5 text-primary mx-auto" /></td>
                </tr>
                <tr>
                  <td className="p-4">Lifetime Updates</td>
                  <td className="p-4 text-center"><Check className="h-5 w-5 text-primary mx-auto" /></td>
                  <td className="p-4 text-center bg-primary/5"><Check className="h-5 w-5 text-primary mx-auto" /></td>
                </tr>
                <tr>
                  <td className="p-4">Deploy Anywhere</td>
                  <td className="p-4 text-center"><Check className="h-5 w-5 text-primary mx-auto" /></td>
                  <td className="p-4 text-center bg-primary/5 text-muted-foreground">Our servers</td>
                </tr>
                <tr>
                  <td className="p-4">Managed Infrastructure</td>
                  <td className="p-4 text-center text-muted-foreground">—</td>
                  <td className="p-4 text-center bg-primary/5"><Check className="h-5 w-5 text-primary mx-auto" /></td>
                </tr>
                <tr>
                  <td className="p-4">Automatic Updates</td>
                  <td className="p-4 text-center text-muted-foreground">Manual</td>
                  <td className="p-4 text-center bg-primary/5"><Check className="h-5 w-5 text-primary mx-auto" /></td>
                </tr>
                <tr>
                  <td className="p-4">Secure API Key Storage</td>
                  <td className="p-4 text-center text-muted-foreground">Self-managed</td>
                  <td className="p-4 text-center bg-primary/5"><Check className="h-5 w-5 text-primary mx-auto" /></td>
                </tr>
                <tr>
                  <td className="p-4">99.9% Uptime SLA</td>
                  <td className="p-4 text-center text-muted-foreground">—</td>
                  <td className="p-4 text-center bg-primary/5"><Check className="h-5 w-5 text-primary mx-auto" /></td>
                </tr>
                <tr>
                  <td className="p-4">Support</td>
                  <td className="p-4 text-center text-muted-foreground">Community</td>
                  <td className="p-4 text-center bg-primary/5"><Check className="h-5 w-5 text-primary mx-auto" /> Priority</td>
                </tr>
                <tr>
                  <td className="p-4">Setup Time</td>
                  <td className="p-4 text-center text-muted-foreground">~30 min</td>
                  <td className="p-4 text-center bg-primary/5">Instant</td>
                </tr>
                <tr className="bg-muted/50">
                  <td className="p-4 font-semibold">Price</td>
                  <td className="p-4 text-center font-bold text-lg">$99</td>
                  <td className="p-4 text-center font-bold text-lg bg-primary/5">$199</td>
                </tr>
              </tbody>
            </table>
          </CardContent>
        </Card>
      </section>

      {/* FAQ Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h2>
        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="text-lg">{faq.question}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{faq.answer}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 py-16">
        <Card className="max-w-2xl mx-auto">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-muted-foreground mb-6">
              Join developers building with AI. Lifetime access, no subscriptions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="outline" size="lg">
                <Server className="mr-2 h-4 w-4" />
                Self-Hosted - $99
              </Button>
              <Button size="lg">
                <Cloud className="mr-2 h-4 w-4" />
                Hosted - $199
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted">
        <div className="container mx-auto px-4 py-8 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} AI Media Studio. All rights reserved.</p>
          <div className="flex justify-center gap-4 mt-2">
            <Link href="#">Privacy</Link>
            <Link href="#">Terms</Link>
            <Link href="#">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
