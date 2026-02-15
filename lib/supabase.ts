import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder'

// Helper to safely create client
function createSafeClient(url: string, key: string, options?: any): SupabaseClient {
  try {
    return createClient(url, key, options)
  } catch (e) {
    console.warn('Supabase client creation failed:', e)
    // Return a dummy client for build-time
    return {} as SupabaseClient
  }
}

export const supabase = createSafeClient(supabaseUrl, supabaseAnonKey)

// Service role client for server-side operations
export const supabaseAdmin = createSafeClient(
  supabaseUrl,
  process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder',
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
)

// Types
export interface ApiKey {
  id: string
  user_id: string
  key_hash: string
  key_prefix: string
  name: string
  permissions: string[]
  rate_limit: number
  created_at: string
  last_used_at: string | null
  is_active: boolean
}

export interface UsageLog {
  id: string
  user_id: string
  api_key_id: string
  model_id: string
  endpoint: string
  method: string
  tokens_input: number
  tokens_output: number
  cost_cents: number
  duration_ms: number
  status_code: number
  created_at: string
}

export interface Model {
  id: string
  name: string
  provider: 'openai' | 'anthropic' | 'ollama'
  model_type: 'llm' | 'embedding' | 'fine-tuned'
  model_id: string
  base_model?: string
  description: string
  context_window: number
  pricing_input: number // cents per 1k tokens
  pricing_output: number // cents per 1k tokens
  is_active: boolean
  created_at: string
}

export interface Workspace {
  id: string
  name: string
  slug: string
  owner_id: string
  plan: 'free' | 'pro' | 'enterprise'
  stripe_customer_id?: string
  stripe_subscription_id?: string
  created_at: string
}

export interface WorkspaceMember {
  id: string
  workspace_id: string
  user_id: string
  role: 'owner' | 'admin' | 'member'
  created_at: string
}
