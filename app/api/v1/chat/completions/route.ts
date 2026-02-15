import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin as supabase } from '@/lib/supabase'

// Rate limiting configuration
const RATE_LIMITS: Record<string, number> = {
  free: 100,      // requests per minute
  pro: 1000,
  enterprise: 10000,
}

// Token cost calculation (in cents per 1k tokens)
const TOKEN_COSTS: Record<string, { input: number; output: number }> = {
  'gpt-4': { input: 3, output: 6 },
  'gpt-3.5-turbo': { input: 0.05, output: 0.1 },
  'claude-3-opus': { input: 1.5, output: 7.5 },
  'claude-3-sonnet': { input: 0.3, output: 1.5 },
}

async function checkRateLimit(
  workspaceId: string,
  plan: string
): Promise<{ allowed: boolean; remaining: number }> {
  const windowStart = new Date()
  windowStart.setMinutes(windowStart.getMinutes() - 1)

  const { count } = await supabase
    .from('usage_logs')
    .select('*', { count: 'exact', head: true })
    .eq('workspace_id', workspaceId)
    .gte('created_at', windowStart.toISOString())

  const limit = RATE_LIMITS[plan] || RATE_LIMITS.free
  const current = count || 0

  return {
    allowed: current < limit,
    remaining: Math.max(0, limit - current),
  }
}

async function logUsage(
  workspaceId: string,
  apiKeyId: string,
  modelId: string,
  endpoint: string,
  method: string,
  tokensInput: number,
  tokensOutput: number,
  durationMs: number,
  statusCode: number
) {
  const costs = TOKEN_COSTS[modelId] || { input: 0, output: 0 }
  const costCents = 
    (tokensInput / 1000) * costs.input + 
    (tokensOutput / 1000) * costs.output

  await supabase.from('usage_logs').insert({
    workspace_id: workspaceId,
    api_key_id: apiKeyId,
    model_id: modelId,
    endpoint,
    method,
    tokens_input: tokensInput,
    tokens_output: tokensOutput,
    cost_cents: Math.ceil(costCents),
    duration_ms: durationMs,
    status_code: statusCode,
  })
}

export async function POST(request: NextRequest) {
  const startTime = Date.now()
  
  try {
    // Extract API key from header
    const apiKey = request.headers.get('x-api-key') || 
                   request.headers.get('authorization')?.replace('Bearer ', '')

    if (!apiKey) {
      return NextResponse.json(
        { error: 'Missing API key' },
        { status: 401 }
      )
    }

    // Validate API key
    const { data: keyData, error: keyError } = await supabase
      .from('api_keys')
      .select('*, workspaces(*)')
      .eq('key_hash', apiKey)
      .eq('is_active', true)
      .single()

    if (keyError || !keyData) {
      return NextResponse.json(
        { error: 'Invalid API key' },
        { status: 401 }
      )
    }

    const workspace = keyData.workspaces as any

    // Check rate limit
    const rateCheck = await checkRateLimit(workspace.id, workspace.plan)
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { 
          error: 'Rate limit exceeded',
          retryAfter: 60,
        },
        { 
          status: 429,
          headers: {
            'X-RateLimit-Limit': RATE_LIMITS[workspace.plan].toString(),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': '60',
          }
        }
      )
    }

    // Parse request body
    const body = await request.json()
    const { model, messages, stream = false, ...params } = body

    if (!model || !messages) {
      return NextResponse.json(
        { error: 'Missing required fields: model, messages' },
        { status: 400 }
      )
    }

    // Get model configuration
    const { data: modelConfig, error: modelError } = await supabase
      .from('models')
      .select('*')
      .eq('model_id', model)
      .eq('workspace_id', workspace.id)
      .eq('is_active', true)
      .single()

    if (modelError || !modelConfig) {
      return NextResponse.json(
        { error: 'Model not found or inactive' },
        { status: 404 }
      )
    }

    // Forward to model provider (simplified - in production, you'd route to OpenAI, Anthropic, etc.)
    // This is where you'd integrate with actual AI providers
    
    // Mock response for demonstration
    const response = {
      id: `chatcmpl-${Date.now()}`,
      object: 'chat.completion',
      created: Math.floor(Date.now() / 1000),
      model: model,
      choices: [
        {
          index: 0,
          message: {
            role: 'assistant',
            content: `This is a response from ${modelConfig.name}. In production, this would be forwarded to the actual AI provider (${modelConfig.provider}).`,
          },
          finish_reason: 'stop',
        },
      ],
      usage: {
        prompt_tokens: 100,
        completion_tokens: 50,
        total_tokens: 150,
      },
    }

    // Log usage
    await logUsage(
      workspace.id,
      keyData.id,
      modelConfig.id,
      '/api/v1/chat/completions',
      'POST',
      response.usage.prompt_tokens,
      response.usage.completion_tokens,
      Date.now() - startTime,
      200
    )

    // Return response with rate limit headers
    return NextResponse.json(response, {
      headers: {
        'X-RateLimit-Limit': RATE_LIMITS[workspace.plan].toString(),
        'X-RateLimit-Remaining': rateCheck.remaining.toString(),
        'X-RateLimit-Reset': '60',
      },
    })
  } catch (error) {
    console.error('API Error:', error)
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Support streaming
export async function GET(request: NextRequest) {
  return NextResponse.json({
    message: 'AI Platform API Gateway',
    version: '1.0.0',
    endpoints: {
      'POST /api/v1/chat/completions': 'Chat completions',
      'POST /api/v1/embeddings': 'Generate embeddings',
      'GET /api/v1/models': 'List available models',
    },
  })
}
