'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { 
  Plus, 
  Copy, 
  Trash2, 
  Eye, 
  EyeOff,
  Key,
  MoreVertical,
  Sparkles,
  ExternalLink,
  Info
} from 'lucide-react'
import { useToast } from '@/components/ui/toaster'

// Mock data for demonstration
const mockApiKeys: Array<{
  id: string
  name: string
  key: string
  prefix: string
  createdAt: string
  lastUsed: string | null
  isActive: boolean
}> = [
  {
    id: '1',
    name: 'Production API Key',
    key: 'oc_live_xxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    prefix: 'oc_live_xxxx',
    createdAt: '2024-01-15',
    lastUsed: '2024-01-20',
    isActive: true,
  },
  {
    id: '2',
    name: 'Development Key',
    key: 'oc_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    prefix: 'oc_test_xxxx',
    createdAt: '2024-01-10',
    lastUsed: '2024-01-19',
    isActive: true,
  },
]

export default function ApiKeysPage() {
  const [apiKeys, setApiKeys] = useState(mockApiKeys)
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({})
  const [isCreating, setIsCreating] = useState(false)
  const [newKeyName, setNewKeyName] = useState('')
  const { toast } = useToast()

  const toggleShowKey = (id: string) => {
    setShowKeys(prev => ({ ...prev, [id]: !prev[id] }))
  }

  const copyToClipboard = (key: string) => {
    navigator.clipboard.writeText(key)
    toast({
      title: 'Copied!',
      description: 'API key copied to clipboard',
    })
  }

  const createKey = () => {
    if (!newKeyName.trim()) return

    const newKey = {
      id: Date.now().toString(),
      name: newKeyName,
      key: `oc_live_${Math.random().toString(36).substring(2, 34)}`,
      prefix: `oc_live_${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date().toISOString().split('T')[0],
      lastUsed: null,
      isActive: true,
    }

    setApiKeys([...apiKeys, newKey])
    setNewKeyName('')
    setIsCreating(false)
    
    toast({
      title: 'API Key Created',
      description: 'Your new API key has been created successfully',
    })
  }

  const deleteKey = (id: string) => {
    setApiKeys(apiKeys.filter(key => key.id !== id))
    toast({
      title: 'Key Deleted',
      description: 'The API key has been revoked',
      variant: 'destructive',
    })
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">API Keys</h1>
          <p className="text-muted-foreground mt-1">
            Manage your API keys for authentication
          </p>
        </div>
        <Button onClick={() => setIsCreating(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Key
        </Button>
      </div>

      {/* Free API Providers Info */}
      <Card className="bg-primary/5 border-primary/20">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <CardTitle>Free API Providers Available</CardTitle>
          </div>
          <CardDescription>
            Connect with these providers to start building immediately. Start free, upgrade when ready.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            <div className="flex items-center justify-between p-3 bg-background rounded-lg border">
              <div>
                <p className="font-medium text-sm">Replicate</p>
                <p className="text-xs text-muted-foreground">$5 free credits</p>
              </div>
              <a href="https://replicate.com" target="_blank" rel="noopener noreferrer">
                <Button variant="ghost" size="sm">
                  Sign up <ExternalLink className="h-3 w-3 ml-1" />
                </Button>
              </a>
            </div>
            <div className="flex items-center justify-between p-3 bg-background rounded-lg border">
              <div>
                <p className="font-medium text-sm">OpenRouter</p>
                <p className="text-xs text-muted-foreground">Many free models</p>
              </div>
              <a href="https://openrouter.ai" target="_blank" rel="noopener noreferrer">
                <Button variant="ghost" size="sm">
                  Sign up <ExternalLink className="h-3 w-3 ml-1" />
                </Button>
              </a>
            </div>
            <div className="flex items-center justify-between p-3 bg-background rounded-lg border">
              <div>
                <p className="font-medium text-sm">Hugging Face</p>
                <p className="text-xs text-muted-foreground">Free inference</p>
              </div>
              <a href="https://huggingface.co" target="_blank" rel="noopener noreferrer">
                <Button variant="ghost" size="sm">
                  Sign up <ExternalLink className="h-3 w-3 ml-1" />
                </Button>
              </a>
            </div>
            <div className="flex items-center justify-between p-3 bg-background rounded-lg border">
              <div>
                <p className="font-medium text-sm">Fal AI</p>
                <p className="text-xs text-muted-foreground">Free tier</p>
              </div>
              <a href="https://fal.ai" target="_blank" rel="noopener noreferrer">
                <Button variant="ghost" size="sm">
                  Sign up <ExternalLink className="h-3 w-3 ml-1" />
                </Button>
              </a>
            </div>
          </div>
          <div className="mt-4 flex items-start gap-2 text-sm text-muted-foreground">
            <Info className="h-4 w-4 shrink-0 mt-0.5" />
            <p>
              Need more options? Visit the <a href="/dashboard/api-providers" className="text-primary hover:underline">API Providers</a> page for a complete list with detailed free tier information.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Create Key Dialog */}
      {isCreating && (
        <Card>
          <CardHeader>
            <CardTitle>Create New API Key</CardTitle>
            <CardDescription>Generate a new API key for your applications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="keyName">Key Name</Label>
                <Input
                  id="keyName"
                  placeholder="e.g., Production App"
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                />
              </div>
              <div className="flex space-x-2">
                <Button onClick={createKey}>Create Key</Button>
                <Button variant="outline" onClick={() => setIsCreating(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* API Keys List */}
      <div className="space-y-4">
        {apiKeys.map((apiKey) => (
          <Card key={apiKey.id}>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center space-x-2">
                    <Key className="h-4 w-4 text-primary" />
                    <h3 className="font-semibold">{apiKey.name}</h3>
                    <Badge variant={apiKey.isActive ? 'default' : 'secondary'}>
                      {apiKey.isActive ? 'Active' : 'Revoked'}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <code className="text-sm bg-muted px-3 py-1 rounded font-mono">
                      {showKeys[apiKey.id] ? apiKey.key : `${apiKey.prefix}....................................`}
                    </code>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => toggleShowKey(apiKey.id)}
                    >
                      {showKeys[apiKey.id] ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => copyToClipboard(apiKey.key)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <span>Created: {apiKey.createdAt}</span>
                    {apiKey.lastUsed && <span>Last used: {apiKey.lastUsed}</span>}
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  className="text-destructive hover:text-destructive"
                  onClick={() => deleteKey(apiKey.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {apiKeys.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Key className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No API keys yet</h3>
            <p className="text-sm text-muted-foreground text-center max-w-sm mb-4">
              Create your first API key to start using the platform. 
              <span className="text-primary font-medium"> Remember: you can start with free API providers!</span>
            </p>
            <div className="flex gap-2">
              <Button onClick={() => setIsCreating(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Key
              </Button>
              <Button variant="outline" asChild>
                <a href="/dashboard/api-providers">
                  <Sparkles className="h-4 w-4 mr-2" />
                  View Free Providers
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
