-- Database Schema for AI Platform
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Workspaces table
CREATE TABLE IF NOT EXISTS workspaces (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  owner_id TEXT NOT NULL,
  plan TEXT DEFAULT 'free' CHECK (plan IN ('free', 'pro', 'enterprise')),
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Models table
CREATE TABLE IF NOT EXISTS models (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  provider TEXT NOT NULL CHECK (provider IN ('openai', 'anthropic', 'ollama')),
  model_type TEXT NOT NULL CHECK (model_type IN ('llm', 'embedding', 'fine-tuned')),
  model_id TEXT NOT NULL,
  base_model TEXT,
  description TEXT,
  context_window INTEGER NOT NULL,
  pricing_input DECIMAL(10, 4) NOT NULL, -- cents per 1k tokens
  pricing_output DECIMAL(10, 4) NOT NULL, -- cents per 1k tokens
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(workspace_id, model_id)
);

-- API Keys table
CREATE TABLE IF NOT EXISTS api_keys (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE NOT NULL,
  user_id TEXT NOT NULL,
  key_hash TEXT UNIQUE NOT NULL,
  key_prefix TEXT NOT NULL,
  name TEXT NOT NULL,
  permissions TEXT[] DEFAULT ARRAY['read', 'write'],
  rate_limit INTEGER DEFAULT 100,
  last_used_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Usage Logs table
CREATE TABLE IF NOT EXISTS usage_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE NOT NULL,
  api_key_id UUID REFERENCES api_keys(id) ON DELETE SET NULL,
  model_id UUID REFERENCES models(id) ON DELETE SET NULL,
  endpoint TEXT NOT NULL,
  method TEXT NOT NULL,
  tokens_input INTEGER DEFAULT 0,
  tokens_output INTEGER DEFAULT 0,
  cost_cents DECIMAL(10, 2) DEFAULT 0,
  duration_ms INTEGER DEFAULT 0,
  status_code INTEGER NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Workspace Members table (for team collaboration)
CREATE TABLE IF NOT EXISTS workspace_members (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE NOT NULL,
  user_id TEXT NOT NULL,
  role TEXT DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member')),
  invited_by TEXT,
  invited_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  joined_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(workspace_id, user_id)
);

-- Create indexes for better performance
CREATE INDEX idx_usage_logs_workspace_id ON usage_logs(workspace_id);
CREATE INDEX idx_usage_logs_created_at ON usage_logs(created_at);
CREATE INDEX idx_api_keys_key_hash ON api_keys(key_hash);
CREATE INDEX idx_models_workspace_id ON models(workspace_id);
CREATE INDEX idx_workspace_members_user_id ON workspace_members(user_id);

-- Row Level Security (RLS) Policies
ALTER TABLE workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE models ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE workspace_members ENABLE ROW LEVEL SECURITY;

-- Workspaces policies
CREATE POLICY "Users can view their own workspaces"
  ON workspaces FOR SELECT
  USING (owner_id = auth.uid()::text OR 
         id IN (SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()::text));

CREATE POLICY "Users can create workspaces"
  ON workspaces FOR INSERT
  WITH CHECK (owner_id = auth.uid()::text);

CREATE POLICY "Users can update their own workspaces"
  ON workspaces FOR UPDATE
  USING (owner_id = auth.uid()::text);

-- Models policies
CREATE POLICY "Users can view models in their workspaces"
  ON models FOR SELECT
  USING (workspace_id IN (SELECT id FROM workspaces WHERE owner_id = auth.uid()::text OR 
         id IN (SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()::text)));

CREATE POLICY "Users can create models in their workspaces"
  ON models FOR INSERT
  WITH CHECK (workspace_id IN (SELECT id FROM workspaces WHERE owner_id = auth.uid()::text));

CREATE POLICY "Users can update models in their workspaces"
  ON models FOR UPDATE
  USING (workspace_id IN (SELECT id FROM workspaces WHERE owner_id = auth.uid()::text));

-- API Keys policies
CREATE POLICY "Users can view their own API keys"
  ON api_keys FOR SELECT
  USING (user_id = auth.uid()::text);

CREATE POLICY "Users can create API keys"
  ON api_keys FOR INSERT
  WITH CHECK (user_id = auth.uid()::text);

CREATE POLICY "Users can update their own API keys"
  ON api_keys FOR UPDATE
  USING (user_id = auth.uid()::text);

-- Usage Logs policies
CREATE POLICY "Users can view usage logs in their workspaces"
  ON usage_logs FOR SELECT
  USING (workspace_id IN (SELECT id FROM workspaces WHERE owner_id = auth.uid()::text OR 
         id IN (SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()::text)));

-- Workspace Members policies
CREATE POLICY "Users can view workspace members"
  ON workspace_members FOR SELECT
  USING (workspace_id IN (SELECT id FROM workspaces WHERE owner_id = auth.uid()::text OR 
         user_id = auth.uid()::text));

CREATE POLICY "Workspace owners can add members"
  ON workspace_members FOR INSERT
  WITH CHECK (workspace_id IN (SELECT id FROM workspaces WHERE owner_id = auth.uid()::text));

-- Functions and Triggers

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers to tables
CREATE TRIGGER update_workspaces_updated_at
  BEFORE UPDATE ON workspaces
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_models_updated_at
  BEFORE UPDATE ON models
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_api_keys_updated_at
  BEFORE UPDATE ON api_keys
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to get workspace usage stats
CREATE OR REPLACE FUNCTION get_workspace_usage(
  workspace_uuid UUID,
  start_date TIMESTAMP WITH TIME ZONE DEFAULT NULL,
  end_date TIMESTAMP WITH TIME ZONE DEFAULT NULL
)
RETURNS TABLE (
  total_calls BIGINT,
  total_tokens BIGINT,
  total_cost DECIMAL,
  avg_duration DECIMAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*) as total_calls,
    COALESCE(SUM(usage_logs.tokens_input + usage_logs.tokens_output), 0) as total_tokens,
    COALESCE(SUM(usage_logs.cost_cents), 0) as total_cost,
    COALESCE(AVG(usage_logs.duration_ms), 0) as avg_duration
  FROM usage_logs
  WHERE usage_logs.workspace_id = workspace_uuid
    AND (start_date IS NULL OR usage_logs.created_at >= start_date)
    AND (end_date IS NULL OR usage_logs.created_at <= end_date);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Insert default data for testing (optional)
-- Uncomment the following to add sample data

/*
-- Sample workspace
INSERT INTO workspaces (id, name, slug, owner_id, plan)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'Demo Workspace',
  'demo-workspace',
  'user_2test',
  'pro'
);

-- Sample models
INSERT INTO models (workspace_id, name, provider, model_type, model_id, description, context_window, pricing_input, pricing_output)
VALUES
  ('00000000-0000-0000-0000-000000000001', 'GPT-4', 'openai', 'llm', 'gpt-4', 'Most capable GPT-4 model', 8192, 3, 6),
  ('00000000-0000-0000-0000-000000000001', 'Claude 3 Opus', 'anthropic', 'llm', 'claude-3-opus', 'Most powerful Claude model', 100000, 1.5, 7.5);

-- Sample API key
INSERT INTO api_keys (workspace_id, user_id, key_hash, key_prefix, name)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'user_2test',
  'oc_test_demo123456789',
  'oc_test',
  'Demo API Key'
);
*/

-- Grant necessary permissions
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO postgres;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO postgres;
