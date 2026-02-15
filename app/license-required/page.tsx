import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Lock, ExternalLink } from 'lucide-react'

export default function LicenseRequiredPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
            <Lock className="h-6 w-6 text-red-600" />
          </div>
          <CardTitle className="text-2xl">License Required</CardTitle>
          <CardDescription>
            AI Platform requires a valid license key to operate.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-muted p-4 rounded-lg text-sm space-y-2">
            <p className="font-medium">Lifetime license includes:</p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1">
              <li>Self-hosted AI platform</li>
              <li>Model deployment & management</li>
              <li>API gateway & usage analytics</li>
              <li>All future updates</li>
            </ul>
          </div>
          
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Please purchase a lifetime license and add it to your{' '}
              <code className="bg-muted px-1 py-0.5 rounded text-xs">.env.local</code> file:
            </p>
            <code className="block bg-black text-green-400 p-3 rounded text-xs font-mono">
              LICENSE_KEY=AI-XXXX-XXXX-XXXX
            </code>
          </div>

          <div className="flex flex-col gap-2 pt-2">
            <Link href="https://your-store.com/ai-platform" target="_blank">
              <Button className="w-full">
                <ExternalLink className="h-4 w-4 mr-2" />
                Purchase Lifetime License ($79-99)
              </Button>
            </Link>
            <Link href="/">
              <Button variant="outline" className="w-full">
                Back to Home
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
