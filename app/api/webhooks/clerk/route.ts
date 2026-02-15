import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin as supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, email, firstName, lastName } = body

    if (!userId || !email) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Check if workspace already exists
    const { data: existingWorkspace } = await supabase
      .from('workspaces')
      .select('*')
      .eq('owner_id', userId)
      .single()

    if (existingWorkspace) {
      return NextResponse.json({ workspace: existingWorkspace })
    }

    // Create new workspace
    const slug = `workspace-${userId.substring(0, 8)}`
    
    const { data: workspace, error } = await supabase
      .from('workspaces')
      .insert({
        owner_id: userId,
        name: `${firstName || 'My'} Workspace`,
        slug,
        plan: 'free',
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating workspace:', error)
      return NextResponse.json(
        { error: 'Failed to create workspace' },
        { status: 500 }
      )
    }

    // Add default models for the workspace
    const defaultModels = [
      {
        workspace_id: workspace.id,
        name: 'GPT-4',
        provider: 'openai',
        model_type: 'llm',
        model_id: 'gpt-4',
        description: 'Most capable GPT-4 model',
        context_window: 8192,
        pricing_input: 3,
        pricing_output: 6,
        is_active: true,
      },
      {
        workspace_id: workspace.id,
        name: 'GPT-3.5 Turbo',
        provider: 'openai',
        model_type: 'llm',
        model_id: 'gpt-3.5-turbo',
        description: 'Fast and efficient model',
        context_window: 4096,
        pricing_input: 0.05,
        pricing_output: 0.1,
        is_active: true,
      },
      {
        workspace_id: workspace.id,
        name: 'Claude 3 Sonnet',
        provider: 'anthropic',
        model_type: 'llm',
        model_id: 'claude-3-sonnet',
        description: 'Balanced performance and cost',
        context_window: 100000,
        pricing_input: 0.3,
        pricing_output: 1.5,
        is_active: true,
      },
    ]

    await supabase.from('models').insert(defaultModels)

    return NextResponse.json({ workspace })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
