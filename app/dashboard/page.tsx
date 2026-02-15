import { auth, currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowUpRight, 
  Box, 
  Key, 
  TrendingUp, 
  DollarSign,
  Zap,
  Activity
} from 'lucide-react'
import { supabaseAdmin } from '@/lib/supabase'
import { formatPrice, formatNumber } from '@/lib/utils'

async function getDashboardData(userId: string) {
  // Get workspace
  const { data: workspace } = await supabaseAdmin
    .from('workspaces')
    .select('*')
    .eq('owner_id', userId)
    .single()

  if (!workspace) return null

  // Get usage stats
  const startOfMonth = new Date()
  startOfMonth.setDate(1)
  startOfMonth.setHours(0, 0, 0, 0)

  const { data: usageLogs } = await supabaseAdmin
    .from('usage_logs')
    .select('*')
    .eq('workspace_id', workspace.id)
    .gte('created_at', startOfMonth.toISOString())

  const totalCalls = usageLogs?.length || 0
  const totalTokens = usageLogs?.reduce((acc, log) => acc + log.tokens_input + log.tokens_output, 0) || 0
  const totalCost = usageLogs?.reduce((acc, log) => acc + log.cost_cents, 0) || 0

  // Get models count
  const { count: modelsCount } = await supabaseAdmin
    .from('models')
    .select('*', { count: 'exact', head: true })
    .eq('workspace_id', workspace.id)

  // Get API keys count
  const { count: apiKeysCount } = await supabaseAdmin
    .from('api_keys')
    .select('*', { count: 'exact', head: true })
    .eq('workspace_id', workspace.id)
    .eq('is_active', true)

  // Get recent activity
  const { data: recentActivity } = await supabaseAdmin
    .from('usage_logs')
    .select('*, models(name)')
    .eq('workspace_id', workspace.id)
    .order('created_at', { ascending: false })
    .limit(5)

  return {
    workspace,
    stats: {
      totalCalls,
      totalTokens,
      totalCost,
      modelsCount: modelsCount || 0,
      apiKeysCount: apiKeysCount || 0,
    },
    recentActivity: recentActivity || [],
  }
}

export default async function DashboardPage() {
  const { userId } = auth()
  const user = await currentUser()

  if (!userId || !user) {
    redirect('/sign-in')
  }

  const data = await getDashboardData(userId)

  if (!data) {
    redirect('/onboarding')
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Welcome back, {user.firstName || 'there'}!</h1>
        <p className="text-muted-foreground mt-1">
          Here's an overview of your AI platform usage
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">API Calls</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(data.stats.totalCalls)}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tokens Used</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(data.stats.totalTokens)}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cost</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPrice(data.stats.totalCost)}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Models</CardTitle>
            <Box className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.stats.modelsCount}</div>
            <p className="text-xs text-muted-foreground">Deployed models</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Key className="h-5 w-5 mr-2" />
              API Keys
            </CardTitle>
            <CardDescription>
              {data.stats.apiKeysCount} active keys
            </CardDescription>
          </CardHeader>
          <CardContent>
            <a href="/dashboard/api-keys" className="text-sm text-primary flex items-center">
              Manage keys <ArrowUpRight className="h-4 w-4 ml-1" />
            </a>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Box className="h-5 w-5 mr-2" />
              Models
            </CardTitle>
            <CardDescription>
              {data.stats.modelsCount} models deployed
            </CardDescription>
          </CardHeader>
          <CardContent>
            <a href="/dashboard/models" className="text-sm text-primary flex items-center">
              View models <ArrowUpRight className="h-4 w-4 ml-1" />
            </a>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2" />
              Analytics
            </CardTitle>
            <CardDescription>
              Usage insights and metrics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <a href="/dashboard/analytics" className="text-sm text-primary flex items-center">
              View analytics <ArrowUpRight className="h-4 w-4 ml-1" />
            </a>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Your latest API requests</CardDescription>
        </CardHeader>
        <CardContent>
          {data.recentActivity.length > 0 ? (
            <div className="space-y-4">
              {data.recentActivity.map((activity: any) => (
                <div key={activity.id} className="flex items-center justify-between py-2 border-b last:border-0">
                  <div className="flex items-center space-x-3">
                    <div className="h-2 w-2 rounded-full bg-primary" />
                    <div>
                      <p className="text-sm font-medium">{activity.models?.name || 'Unknown Model'}</p>
                      <p className="text-xs text-muted-foreground">
                        {activity.endpoint} • {activity.method}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{formatNumber(activity.tokens_input + activity.tokens_output)} tokens</p>
                    <p className="text-xs text-muted-foreground">{formatPrice(activity.cost_cents)}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Activity className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No activity yet</p>
              <p className="text-sm">Make your first API call to see usage here</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
