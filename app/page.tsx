import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Box, 
  Zap, 
  Shield, 
  BarChart3, 
  Code,
  Check,
  ArrowRight,
  MessageSquare,
  Key,
  Server,
  Cloud,
  Download,
  Rocket,
  Sparkles,
  ExternalLink
} from 'lucide-react'

const features = [
  {
    icon: Box,
    title: 'Multi-Model Support',
    description: 'Deploy and manage LLMs from OpenAI, Anthropic, or run local models via Ollama. Fine-tune and customize to your needs.',
  },
  {
    icon: Zap,
    title: 'Powerful API Gateway',
    description: 'Built-in rate limiting, usage tracking, and API key management. Monitor and control access with ease.',
  },
  {
    icon: Shield,
    title: 'Enterprise Security',
    description: 'Secure by design with API key authentication, rate limiting, and detailed audit logs.',
  },
  {
    icon: BarChart3,
    title: 'Advanced Analytics',
    description: 'Track usage, costs, and performance in real-time. Make data-driven decisions with detailed insights.',
  },
  {
    icon: MessageSquare,
    title: 'Interactive Playground',
    description: 'Test and experiment with your models in our built-in chat interface before going live.',
  },
  {
    icon: Key,
    title: 'Team Collaboration',
    description: 'Invite team members, manage permissions, and collaborate on model deployments.',
  },
]

const pricing = [
  {
    name: 'Self-Hosted',
    icon: Server,
    price: '$99',
    period: 'lifetime',
    description: 'Full control over your infrastructure',
    features: [
      'Full source code',
      'Docker support',
      'Your own infrastructure',
      'Lifetime updates',
      'Self-managed security',
      'Community support',
      'Deploy anywhere',
    ],
    cta: 'Download Now',
    ctaLink: '/pricing#self-hosted',
    popular: false,
  },
  {
    name: 'Hosted',
    icon: Cloud,
    price: '$199',
    period: 'lifetime',
    description: 'We handle everything for you',
    features: [
      'No setup required',
      'We handle everything',
      'Secure API key storage',
      'Automatic updates',
      '99.9% uptime SLA',
      'Priority support',
      'Managed infrastructure',
    ],
    cta: 'Get Started',
    ctaLink: '/pricing#hosted',
    popular: true,
  },
]

const freeApiProviders = [
  {
    name: 'Replicate',
    freeTier: '$5 free credits for new users',
    description: 'Run AI models in the cloud',
    signupUrl: 'https://replicate.com',
  },
  {
    name: 'Fal AI',
    freeTier: 'Free tier available',
    description: 'Fast image and video generation',
    signupUrl: 'https://fal.ai',
  },
  {
    name: 'OpenRouter',
    freeTier: 'Pay-per-use, access to many free models',
    description: 'Unified API for LLMs',
    signupUrl: 'https://openrouter.ai',
  },
  {
    name: 'Stability AI',
    freeTier: 'Free credits for image generation',
    description: 'Image generation models',
    signupUrl: 'https://stability.ai',
  },
  {
    name: 'Together AI',
    freeTier: 'Image model inference',
    description: 'Fast inference for open models',
    signupUrl: 'https://together.ai',
  },
  {
    name: 'Hugging Face',
    freeTier: 'Free inference API',
    description: 'Access thousands of models',
    signupUrl: 'https://huggingface.co',
  },
  {
    name: 'Leonardo AI',
    freeTier: 'Daily free generations',
    description: 'Creative image generation',
    signupUrl: 'https://leonardo.ai',
  },
  {
    name: 'Runway',
    freeTier: 'Limited free video generation',
    description: 'Video and image generation',
    signupUrl: 'https://runwayml.com',
  },
]

const codeExample = `// Initialize the client
const response = await fetch('https://api.aiplatform.com/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    model: 'gpt-4',
    messages: [
      { role: 'user', content: 'Hello, AI!' }
    ],
  }),
})

const data = await response.json()
console.log(data.choices[0].message.content)`

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      {/* Navigation */}
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Box className="h-8 w-8 text-primary" />
            <span className="font-bold text-xl">AI Media Studio</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/sign-in">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/pricing">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <Badge variant="outline" className="mb-4">
          <Zap className="h-3 w-3 mr-1" />
          Lifetime Access
        </Badge>
        <h1 className="text-5xl font-bold mb-6 max-w-4xl mx-auto">
          Deploy, Manage, and Scale{' '}
          <span className="text-primary">AI Models</span>
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Self-hostable AI platform for deploying LLMs, embeddings, and custom models. 
          Built-in API gateway, analytics, and usage-based billing.
        </p>
        <div className="flex items-center justify-center space-x-4">
          <Link href="/pricing">
            <Button size="lg" className="text-lg">
              View Pricing
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <Link href="#features">
            <Button size="lg" variant="outline" className="text-lg">
              Learn More
            </Button>
          </Link>
        </div>
      </section>

      {/* Two Options Banner */}
      <section className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold mb-2">Choose Your Deployment</h2>
              <p className="text-muted-foreground mb-6">
                Two simple options to fit your needs
              </p>
              <div className="flex items-center justify-center gap-8 flex-wrap">
                <div className="flex items-center gap-2">
                  <Server className="h-5 w-5 text-primary" />
                  <span className="font-medium">Self-Hosted - $99</span>
                </div>
                <div className="flex items-center gap-2">
                  <Cloud className="h-5 w-5 text-primary" />
                  <span className="font-medium">Hosted - $199</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Code Example */}
      <section className="container mx-auto px-4 py-16">
        <Card className="max-w-4xl mx-auto overflow-hidden">
          <div className="bg-muted p-4 border-b">
            <div className="flex items-center space-x-2">
              <div className="h-3 w-3 rounded-full bg-red-500"></div>
              <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
              <div className="h-3 w-3 rounded-full bg-green-500"></div>
              <span className="ml-2 text-sm text-muted-foreground">api-example.js</span>
            </div>
          </div>
          <CardContent className="p-6">
            <pre className="text-sm overflow-x-auto">
              <code className="text-muted-foreground">{codeExample}</code>
            </pre>
          </CardContent>
        </Card>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Everything You Need</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A complete platform for managing AI models at scale
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <Card key={feature.title} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </section>

      {/* Free API Providers Section */}
      <section id="free-apis" className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4">
            <Sparkles className="h-3 w-3 mr-1" />
            Start Free
          </Badge>
          <h2 className="text-3xl font-bold mb-4">Free API Providers</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Connect with these providers to start building immediately. <span className="text-primary font-semibold">Start free, upgrade when ready.</span>
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto">
          {freeApiProviders.map((provider) => (
            <Card key={provider.name} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">{provider.name}</CardTitle>
                <CardDescription>{provider.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Badge variant="secondary" className="mb-3">
                  {provider.freeTier}
                </Badge>
                <a
                  href={provider.signupUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary flex items-center hover:underline"
                >
                  Sign up <ExternalLink className="h-3 w-3 ml-1" />
                </a>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="text-center mt-12">
          <Link href="/pricing">
            <Button size="lg" className="text-lg">
              Start generating for free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4">
            <Rocket className="h-3 w-3 mr-1" />
            One-Time Payment
          </Badge>
          <h2 className="text-3xl font-bold mb-4">Choose Your Plan</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Lifetime access. No subscriptions. No hidden fees.
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-2 max-w-4xl mx-auto">
          {pricing.map((plan) => {
            const Icon = plan.icon
            return (
              <Card 
                key={plan.name} 
                className={`relative ${plan.popular ? 'border-primary shadow-lg scale-105' : ''}`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge>Recommended</Badge>
                  </div>
                )}
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4">
                    <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                      <Icon className="h-8 w-8 text-primary" />
                    </div>
                  </div>
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center mb-6">
                    <span className="text-5xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground">/{plan.period}</span>
                  </div>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start">
                        <Check className="h-5 w-5 text-primary shrink-0 mr-2" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link href={plan.ctaLink} className="block">
                    <Button 
                      className="w-full" 
                      variant={plan.popular ? 'default' : 'outline'}
                    >
                      {plan.popular && <Rocket className="mr-2 h-4 w-4" />}
                      {!plan.popular && <Download className="mr-2 h-4 w-4" />}
                      {plan.cta}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </section>

      {/* Feature Comparison */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Compare Plans</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Which option is right for you?
          </p>
        </div>
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
                  <td className="p-4">Source Code</td>
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
                  <td className="p-4">Managed Infrastructure</td>
                  <td className="p-4 text-center text-muted-foreground">—</td>
                  <td className="p-4 text-center bg-primary/5"><Check className="h-5 w-5 text-primary mx-auto" /></td>
                </tr>
                <tr>
                  <td className="p-4">Automatic Updates</td>
                  <td className="p-4 text-center text-muted-foreground">—</td>
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
                  <td className="p-4">Priority Support</td>
                  <td className="p-4 text-center text-muted-foreground">Community</td>
                  <td className="p-4 text-center bg-primary/5"><Check className="h-5 w-5 text-primary mx-auto" /></td>
                </tr>
                <tr className="bg-muted/50">
                  <td className="p-4 font-semibold">Price</td>
                  <td className="p-4 text-center font-bold">$99 lifetime</td>
                  <td className="p-4 text-center font-bold bg-primary/5">$199 lifetime</td>
                </tr>
              </tbody>
            </table>
          </CardContent>
        </Card>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <Card className="max-w-4xl mx-auto">
          <CardContent className="p-12 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              One-time payment. Lifetime access. No subscriptions.
            </p>
            <div className="flex items-center justify-center space-x-4">
              <Link href="/pricing">
                <Button size="lg" className="text-lg">
                  View Pricing
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="https://docs.aiplatform.com" target="_blank">
                <Button size="lg" variant="outline" className="text-lg">
                  <Code className="mr-2 h-5 w-5" />
                  Documentation
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted">
        <div className="container mx-auto px-4 py-12">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Box className="h-6 w-6 text-primary" />
                <span className="font-bold">AI Media Studio</span>
              </div>
              <p className="text-sm text-muted-foreground">
                The complete platform for deploying and managing AI models.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#features">Features</Link></li>
                <li><Link href="#pricing">Pricing</Link></li>
                <li><Link href="/dashboard/playground">Playground</Link></li>
                <li><Link href="#">Changelog</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#">Documentation</Link></li>
                <li><Link href="#">API Reference</Link></li>
                <li><Link href="#">Blog</Link></li>
                <li><Link href="#">Community</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#">About</Link></li>
                <li><Link href="#">Careers</Link></li>
                <li><Link href="#">Privacy</Link></li>
                <li><Link href="#">Terms</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} AI Media Studio. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
