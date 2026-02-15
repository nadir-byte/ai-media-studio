'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  ExternalLink,
  Sparkles,
  Zap,
  Clock,
  Gift,
  Info
} from 'lucide-react'

const apiProviders = [
  {
    name: 'Replicate',
    description: 'Run AI models in the cloud with a simple API',
    freeTier: '$5 free credits',
    resetPeriod: 'One-time signup bonus',
    features: ['Image generation', 'Video generation', 'Audio models', 'Custom models'],
    signupUrl: 'https://replicate.com',
    docsUrl: 'https://replicate.com/docs',
    popular: true,
  },
  {
    name: 'Fal AI',
    description: 'Fast image and video generation API',
    freeTier: 'Free tier available',
    resetPeriod: 'Monthly reset',
    features: ['Image generation', 'Video generation', 'Real-time processing'],
    signupUrl: 'https://fal.ai',
    docsUrl: 'https://fal.ai/docs',
    popular: false,
  },
  {
    name: 'OpenRouter',
    description: 'Unified API for LLMs with access to many providers',
    freeTier: 'Pay-per-use, many free models',
    resetPeriod: 'Various - check model details',
    features: ['100+ models', 'Free tier models', 'Standardized API', 'Fallback routing'],
    signupUrl: 'https://openrouter.ai',
    docsUrl: 'https://openrouter.ai/docs',
    popular: true,
  },
  {
    name: 'Stability AI',
    description: 'State-of-the-art image generation models',
    freeTier: 'Free credits on signup',
    resetPeriod: 'One-time signup bonus',
    features: ['SDXL', 'Stable Diffusion 3', 'Image upscaling', 'Image editing'],
    signupUrl: 'https://platform.stability.ai',
    docsUrl: 'https://platform.stability.ai/docs',
    popular: false,
  },
  {
    name: 'Together AI',
    description: 'Fast inference for open-source models',
    freeTier: 'Image models available',
    resetPeriod: 'Check current promotions',
    features: ['Fast inference', 'Open models', 'Fine-tuning', 'Custom endpoints'],
    signupUrl: 'https://together.ai',
    docsUrl: 'https://docs.together.ai',
    popular: false,
  },
  {
    name: 'Hugging Face',
    description: 'Access thousands of open-source models',
    freeTier: 'Free inference API',
    resetPeriod: 'Rate limited, no credits needed',
    features: ['20,000+ models', 'Free tier', 'Community models', 'Inference API'],
    signupUrl: 'https://huggingface.co',
    docsUrl: 'https://huggingface.co/docs/api-inference',
    popular: true,
  },
  {
    name: 'Leonardo AI',
    description: 'Creative image generation platform',
    freeTier: 'Daily free credits',
    resetPeriod: 'Resets daily',
    features: ['150+ tokens/day', 'Multiple models', 'Alchemy upscaler', 'Motion'],
    signupUrl: 'https://leonardo.ai',
    docsUrl: 'https://docs.leonardo.ai',
    popular: false,
  },
  {
    name: 'Runway',
    description: 'Video and image generation tools',
    freeTier: 'Limited free tier',
    resetPeriod: 'Check current plan',
    features: ['Gen-2 video', 'Image generation', 'Video editing', 'Motion brush'],
    signupUrl: 'https://runwayml.com',
    docsUrl: 'https://docs.runwayml.com',
    popular: false,
  },
]

export default function ApiProvidersPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">API Providers</h1>
        <p className="text-muted-foreground mt-1">
          Connect with these providers to power your AI workflows. Start free and upgrade when ready.
        </p>
      </div>

      {/* Info Banner */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold mb-1">Start Free, Upgrade When Ready</h3>
              <p className="text-sm text-muted-foreground">
                All providers listed offer free tiers to get you started. You only pay for what you use, 
                and many offer generous free limits perfect for development and small projects.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Providers Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {apiProviders.map((provider) => (
          <Card key={provider.name} className={`hover:shadow-lg transition-shadow ${provider.popular ? 'border-primary/50' : ''}`}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <CardTitle className="text-xl">{provider.name}</CardTitle>
                    {provider.popular && (
                      <Badge variant="default" className="text-xs">
                        <Zap className="h-3 w-3 mr-1" />
                        Popular
                      </Badge>
                    )}
                  </div>
                  <CardDescription>{provider.description}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Free Tier Info */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Gift className="h-4 w-4 text-primary" />
                  <span className="font-medium text-sm">Free Tier</span>
                </div>
                <Badge variant="secondary" className="text-sm">
                  {provider.freeTier}
                </Badge>
              </div>

              {/* Reset Period */}
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>{provider.resetPeriod}</span>
              </div>

              {/* Features */}
              <div className="pt-2">
                <p className="text-sm font-medium mb-2">Key Features:</p>
                <div className="flex flex-wrap gap-2">
                  {provider.features.map((feature) => (
                    <Badge key={feature} variant="outline" className="text-xs">
                      {feature}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <Button size="sm" className="flex-1" asChild>
                  <a href={provider.signupUrl} target="_blank" rel="noopener noreferrer">
                    Sign Up
                    <ExternalLink className="h-4 w-4 ml-1" />
                  </a>
                </Button>
                <Button size="sm" variant="outline" asChild>
                  <a href={provider.docsUrl} target="_blank" rel="noopener noreferrer">
                    Docs
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Help Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Info className="h-5 w-5" />
            <CardTitle>Need Help Choosing?</CardTitle>
          </div>
          <CardDescription>
            Tips for selecting the right provider for your needs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">•</span>
              <span><strong>Image Generation:</strong> Start with Replicate ($5 free) or Hugging Face (completely free tier)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">•</span>
              <span><strong>LLMs:</strong> OpenRouter offers many free models with a unified API</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">•</span>
              <span><strong>Video:</strong> Runway and Fal AI both offer video generation capabilities</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">•</span>
              <span><strong>Multiple Providers:</strong> You can connect multiple providers and use the best one for each task</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
