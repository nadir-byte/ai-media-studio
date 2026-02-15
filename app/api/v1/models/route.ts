import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin as supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  const apiKey = request.headers.get('x-api-key') || 
                 request.headers.get('authorization')?.replace('Bearer ', '')

  if (!apiKey) {
    return NextResponse.json(
      { error: 'Missing API key' },
      { status: 401 }
    )
  }

  // Validate API key and get workspace
  const { data: keyData } = await supabase
    .from('api_keys')
    .select('workspace_id')
    .eq('key_hash', apiKey)
    .eq('is_active', true)
    .single()

  if (!keyData) {
    return NextResponse.json(
      { error: 'Invalid API key' },
      { status: 401 }
    )
  }

  // Get all active models for workspace
  const { data: models } = await supabase
    .from('models')
    .select('*')
    .eq('workspace_id', keyData.workspace_id)
    .eq('is_active', true)

  return NextResponse.json({
    object: 'list',
    data: models?.map(model => ({
      id: model.model_id,
      object: 'model',
      created: Math.floor(new Date(model.created_at).getTime() / 1000),
      owned_by: model.provider,
      permission: [],
      root: model.base_model || model.model_id,
      parent: null,
    })) || [],
  })
}
