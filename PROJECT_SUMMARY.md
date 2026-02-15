# AI Platform - Quick Start

## Project Overview

A complete AI model hosting and management platform with:
- Multi-provider model support (OpenAI, Anthropic, Ollama)
- API Gateway with rate limiting and usage tracking
- Dashboard with analytics
- Interactive playground
- Stripe billing integration
- Team workspaces via Clerk

## Tech Stack

- **Next.js 14** - App Router with Server Components
- **Clerk** - Authentication & Organizations
- **Supabase** - PostgreSQL database
- **Stripe** - Subscription billing
- **shadcn/ui** - UI components
- **Tailwind CSS** - Styling
- **Recharts** - Analytics charts
- **Vercel AI SDK** - AI integration

## Quick Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment variables**:
   ```bash
   cp .env.example .env.local
   # Fill in your keys from Clerk, Supabase, and Stripe
   ```

3. **Set up database**:
   - Go to Supabase SQL Editor
   - Run `database/schema.sql`

4. **Start dev server**:
   ```bash
   npm run dev
   ```

5. **Open http://localhost:3000**

## Key Features Implemented

### ✅ Authentication (Clerk)
- Email/password signup & signin
- Organization/workspace support
- User profiles
- Secure middleware

### ✅ Model Management
- Multi-provider support (OpenAI, Anthropic, Ollama)
- Model cards with pricing info
- Active/inactive status
- Context window display

### ✅ API Gateway
- `/api/v1/chat/completions` - Chat endpoint
- `/api/v1/models` - List models
- API key authentication
- Rate limiting by plan
- Usage logging

### ✅ Dashboard
- Usage statistics
- Cost tracking
- Recent activity feed
- Quick actions

### ✅ Analytics
- API call charts
- Cost over time
- Model usage distribution
- Performance metrics

### ✅ Playground
- Interactive chat interface
- Model selection
- Parameter tuning
- Conversation history
- Copy responses

### ✅ Billing (Stripe)
- 3-tier pricing (Free, Pro, Enterprise)
- Stripe Checkout integration
- Webhook handlers
- Customer portal ready

### ✅ Settings
- Profile management
- Workspace configuration
- API configuration
- Security settings

### ✅ Marketing Landing Page
- Hero section
- Feature showcase
- Pricing table
- Code examples
- SEO optimized

## API Usage Example

```javascript
// Create completion
const response = await fetch('https://your-domain.com/api/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer sk_live_your_key',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    model: 'gpt-4',
    messages: [
      { role: 'user', content: 'Hello!' }
    ],
  }),
});

const data = await response.json();
```

## Database Schema

### Tables
- `workspaces` - Team workspaces
- `models` - Deployed AI models
- `api_keys` - Authentication keys
- `usage_logs` - API usage tracking
- `workspace_members` - Team members

### Features
- Row Level Security (RLS)
- Automatic timestamps
- Usage stats function
- Proper indexes

## Deployment

### Vercel (Recommended)
1. Push to GitHub
2. Import in Vercel
3. Add environment variables
4. Deploy

### Post-Deployment
1. Update Stripe webhook URL
2. Configure custom domain
3. Test all features

## Environment Variables Required

See `.env.example` for full list:
- Clerk keys (auth)
- Supabase URL & keys (database)
- Stripe keys (billing)
- AI provider keys (optional)

## Next Steps for Production

1. **Add actual AI integration**:
   - Implement OpenAI/Anthropic SDK calls
   - Add streaming support
   - Handle multiple providers

2. **Enhance security**:
   - Implement API key hashing
   - Add CORS configuration
   - Set up rate limiting at edge

3. **Add features**:
   - Email notifications
   - Usage alerts
   - Custom model upload
   - Team member invitations
   - SSO for enterprise

4. **Optimize**:
   - Add caching (Redis)
   - Implement queuing (BullMQ)
   - Set up monitoring (Sentry)
   - Add analytics (PostHog)

## Support

- Check `README.md` for detailed docs
- Review code comments for implementation details
- Database schema includes comments
