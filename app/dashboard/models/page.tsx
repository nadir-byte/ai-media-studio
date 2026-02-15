import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Plus, 
  Box, 
  MoreVertical,
  Globe,
  Zap,
  FileText
} from 'lucide-react'
import { supabaseAdmin } from '@/lib/supabase'

async function getModels(userId: string) {
  const { data: workspace } = await supabaseAdmin
    .from('workspaces')
    .select('id')
    .eq('owner_id', userId)
    .single()

  if (!workspace) return []

  const { data: models } = await supabaseAdmin
    .from('models')
    .select('*')
    .eq('workspace_id', workspace.id)
    .order('created_at', { ascending: false })

  return models || []
}

export default async function ModelsPage() {
  const { userId } = auth()

  if (!userId) {
    redirect('/sign-in')
  }

  const models = await getModels(userId)

  const providerColors: Record<string, string> = {
    openai: 'bg-green-500/10 text-green-500',
    anthropic: 'bg-orange-500/10 text-orange-500',
    ollama: 'bg-blue-500/10 text-blue-500',
  }

  const typeIcons: Record<string, any> = {
    llm: Zap,
    embedding: FileText,
    'fine-tuned': Globe,
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Models</h1>
          <p className="text-muted-foreground mt-1">
            Deploy and manage your AI models
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Model
        </Button>
      </div>

      {/* Models Grid */}
      {models.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {models.map((model) => {
            const TypeIcon = typeIcons[model.model_type] || Box
            return (
              <Card key={model.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <TypeIcon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{model.name}</CardTitle>
                        <CardDescription className="text-xs">{model.model_id}</CardDescription>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Provider</span>
                      <Badge className={providerColors[model.provider]}>
                        {model.provider}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Type</span>
                      <span className="text-sm font-medium capitalize">{model.model_type}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Context Window</span>
                      <span className="text-sm font-medium">{model.context_window.toLocaleString()} tokens</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Status</span>
                      <Badge variant={model.is_active ? 'default' : 'secondary'}>
                        {model.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                    {model.description && (
                      <p className="text-xs text-muted-foreground pt-2 border-t">
                        {model.description}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Box className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No models yet</h3>
            <p className="text-sm text-muted-foreground text-center max-w-sm mb-4">
              Get started by deploying your first AI model. We support OpenAI, Anthropic, and local models via Ollama.
            </p>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Deploy Your First Model
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
