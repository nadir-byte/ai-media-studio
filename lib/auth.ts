import { auth, currentUser } from '@clerk/nextjs/server'
import { supabaseAdmin } from './supabase'

export async function getCurrentUser() {
  const user = await currentUser()
  return user
}

export async function requireAuth() {
  const { userId } = auth()
  
  if (!userId) {
    throw new Error('Unauthorized')
  }
  
  return userId
}

export async function getOrCreateWorkspace(userId: string) {
  // Check if workspace exists
  const { data: existingWorkspace, error: fetchError } = await supabaseAdmin
    .from('workspaces')
    .select('*')
    .eq('owner_id', userId)
    .single()

  if (existingWorkspace) {
    return existingWorkspace
  }

  // Create workspace if it doesn't exist
  const { data: newWorkspace, error: createError } = await supabaseAdmin
    .from('workspaces')
    .insert({
      owner_id: userId,
      name: 'My Workspace',
      slug: `workspace-${userId}`,
      plan: 'free',
    })
    .select()
    .single()

  if (createError) {
    throw createError
  }

  return newWorkspace
}

export async function getWorkspaceUsage(workspaceId: string) {
  const startOfMonth = new Date()
  startOfMonth.setDate(1)
  startOfMonth.setHours(0, 0, 0, 0)

  const { data: usage, error } = await supabaseAdmin
    .from('usage_logs')
    .select('tokens_input, tokens_output, cost_cents')
    .eq('workspace_id', workspaceId)
    .gte('created_at', startOfMonth.toISOString())

  if (error) throw error

  const totalTokens = usage.reduce(
    (acc, log) => acc + log.tokens_input + log.tokens_output,
    0
  )
  const totalCost = usage.reduce((acc, log) => acc + log.cost_cents, 0)

  return {
    apiCalls: usage.length,
    tokens: totalTokens,
    costCents: totalCost,
  }
}
