# AI Media Studio

A self-hostable AI model hosting and management platform built with Next.js, Clerk, Supabase, and Stripe.

[![Deploy to Railway](https://railway.app/button.svg)](https://railway.app/template/placeholder)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fyourusername%2Fai-platform&env=NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,CLERK_SECRET_KEY,NEXT_PUBLIC_SUPABASE_URL,NEXT_PUBLIC_SUPABASE_ANON_KEY,SUPABASE_SERVICE_ROLE_KEY,NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,STRIPE_SECRET_KEY,STRIPE_WEBHOOK_SECRET,STRIPE_PRO_PRICE_ID,STRIPE_ENTERPRISE_PRICE_ID,OPENAI_API_KEY,ANTHROPIC_API_KEY,LICENSE_KEY&project-name=ai-media-studio&repository-name=ai-media-studio)

---

## Choose Your Option

AI Media Studio is available in two options:

| Feature | Self-Hosted ($99) | Hosted ($199) |
|---------|-------------------|---------------|
| **Setup** | You deploy | We handle everything |
| **Infrastructure** | Your servers | Our managed infrastructure |
| **Updates** | Manual | Automatic |
| **Support** | Community | Priority |
| **API Keys** | Self-managed | Secure storage |
| **Uptime SLA** | — | 99.9% |
| **Price** | $99 lifetime | $199 lifetime |

### 🖥️ Self-Hosted - $99 Lifetime

**Perfect for:** Developers who want full control over their infrastructure

**Includes:**
- ✅ Full source code
- ✅ Docker support
- ✅ Deploy anywhere (VPS, AWS, GCP, Azure, local)
- ✅ Lifetime updates
- ✅ Community support

[Download Now →](#self-hosted-setup)

### ☁️ Hosted - $199 Lifetime

**Perfect for:** Teams who want to get started immediately without managing servers

**Includes:**
- ✅ No setup required
- ✅ We handle everything
- ✅ Secure API key storage
- ✅ Automatic updates
- ✅ 99.9% uptime SLA
- ✅ Priority support

[Get Started →](#hosted-setup)

---

## Hosted Setup

Getting started with the hosted version is simple:

1. **Purchase Access**
   - Visit our [pricing page](/pricing) and select "Hosted - $199"
   - Complete payment via Gumroad

2. **Create Your Account**
   - You'll receive an invite link to create your account
   - Sign in to your dedicated instance

3. **Add Your API Keys**
   - Go to Settings → API Keys
   - Add your OpenAI, Anthropic, or other provider keys
   - Keys are stored securely with encryption

4. **Start Building**
   - Access the API at `https://api.aimediastudio.com`
   - Use the playground to test models
   - View analytics and manage usage

**That's it!** We handle infrastructure, security, backups, and updates.

---

## Self-Hosted Setup

### Quick Start with Docker

The fastest way to get started:

```bash
# 1. Clone the repository
git clone https://github.com/yourusername/ai-platform.git
cd ai-platform

# 2. Copy and configure environment variables
cp .env.example .env
# Edit .env with your API keys (see Configuration below)

# 3. Start with Docker Compose
docker-compose up -d

# 4. Visit http://localhost:3000
```

### Prerequisites

Before deploying, you'll need accounts on:

- **Clerk** - Authentication (free tier available)
- **Supabase** - Database (free tier available)
- **Stripe** - Billing (optional, if you want paid plans)
- **AI Providers** - OpenAI, Anthropic, etc.

### Configuration

1. **Copy the example environment file:**
   ```bash
   cp .env.example .env
   ```

2. **Set up Clerk (Authentication):**
   - Go to [Clerk Dashboard](https://dashboard.clerk.com/)
   - Create a new application
   - Copy these keys to `.env`:
     - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
     - `CLERK_SECRET_KEY`
   - Enable Organizations in Clerk for team workspaces

3. **Set up Supabase (Database):**
   - Go to [Supabase Dashboard](https://app.supabase.com/)
   - Create a new project
   - Copy these keys to `.env`:
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
     - `SUPABASE_SERVICE_ROLE_KEY` (Settings → API)
   - Run the database schema:
     ```bash
     # In Supabase SQL Editor, run the contents of:
     database/schema.sql
     ```

4. **Set up Stripe (Optional - for billing):**
   - Go to [Stripe Dashboard](https://dashboard.stripe.com/)
   - Get API keys from Developers → API Keys
   - Add to `.env`:
     - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
     - `STRIPE_SECRET_KEY`
   - Create products and copy price IDs
   - Set up webhook at `/api/webhooks/stripe`

5. **Add AI Provider Keys:**
   ```bash
   OPENAI_API_KEY=sk-...
   ANTHROPIC_API_KEY=sk-ant-...
   ```

6. **Add License Key:**
   ```bash
   LICENSE_KEY=your-license-key-here
   ```

### Deployment Options

#### Docker (Recommended)

```bash
# Build and run
docker-compose up -d

# View logs
docker-compose logs -f app

# Stop
docker-compose down

# Update
git pull && docker-compose up -d --build
```

#### Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fyourusername%2Fai-platform)

1. Click the deploy button above
2. Fill in environment variables during setup
3. Your app will be live in minutes

#### Railway

[![Deploy to Railway](https://railway.app/button.svg)](https://railway.app/template/placeholder)

1. Click the deploy button above
2. Configure environment variables
3. Railway handles the infrastructure

#### Manual Deployment

```bash
# Install dependencies
npm install

# Build the application
npm run build

# Start the server
npm run start
```

---

## Features

- 🔐 **Authentication**: Secure auth with Clerk, including team workspaces
- 🤖 **Model Management**: Deploy and manage LLMs, embeddings, and custom models
  - OpenAI (GPT-4, GPT-3.5)
  - Anthropic (Claude 3)
  - Local models via Ollama
- 🚀 **API Gateway**: 
  - Rate limiting
  - Usage tracking
  - API key management
  - Detailed logging
- 📊 **Dashboard**: 
  - Usage analytics
  - Cost tracking
  - Performance metrics
- 💬 **Playground**: Built-in AI chat interface for testing models
- 💳 **Stripe Integration**: Usage-based billing with multiple plans
- 🎨 **Modern UI**: shadcn/ui with dark mode support
- 📱 **Responsive**: Works on desktop and mobile
- 🐳 **Docker Support**: Easy self-hosting with Docker

---

## Project Structure

```
ai-platform/
├── app/
│   ├── (auth)/           # Authentication pages
│   ├── dashboard/        # Main app pages
│   │   ├── page.tsx      # Dashboard home
│   │   ├── models/       # Model management
│   │   ├── api-keys/     # API key management
│   │   ├── analytics/    # Usage analytics
│   │   ├── playground/   # AI chat interface
│   │   ├── billing/      # Subscription management
│   │   └── settings/     # User settings
│   ├── api/
│   │   ├── v1/           # API Gateway endpoints
│   │   └── webhooks/     # Stripe & Clerk webhooks
│   ├── pricing/          # Pricing page
│   ├── layout.tsx
│   └── page.tsx          # Landing page
├── components/
│   ├── ui/               # shadcn/ui components
│   └── dashboard-nav.tsx # Sidebar navigation
├── lib/
│   ├── supabase.ts       # Database client
│   ├── stripe.ts         # Stripe utilities
│   ├── auth.ts           # Auth helpers
│   └── utils.ts          # Utility functions
├── database/
│   └── schema.sql        # Database schema
├── Dockerfile            # Docker configuration
├── docker-compose.yml    # Docker Compose setup
└── middleware.ts         # Auth middleware
```

---

## API Endpoints

### Chat Completions
```bash
POST /api/v1/chat/completions
Headers:
  Authorization: Bearer YOUR_API_KEY
  Content-Type: application/json

Body:
{
  "model": "gpt-4",
  "messages": [
    {"role": "user", "content": "Hello!"}
  ]
}
```

### List Models
```bash
GET /api/v1/models
Headers:
  Authorization: Bearer YOUR_API_KEY
```

---

## Environment Variables

See `.env.example` for all required variables:

```bash
# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/onboarding

# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Stripe (optional)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_PRO_PRICE_ID=
STRIPE_ENTERPRISE_PRICE_ID=

# AI Providers
OPENAI_API_KEY=
ANTHROPIC_API_KEY=

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000

# License
LICENSE_KEY=your-license-key-here
```

---

## Support

- **Documentation**: [docs.aiplatform.com](https://docs.aiplatform.com)
- **Issues**: [GitHub Issues](https://github.com/yourusername/ai-platform/issues)
- **Email**: support@aiplatform.com

### Hosted Users
Priority support with faster response times.

### Self-Hosted Users
Community support via GitHub Issues and Discussions.

---

## License

This project requires a valid license key. Purchase options:

- **Self-Hosted**: $99 lifetime - [Get License](/pricing#self-hosted)
- **Hosted**: $199 lifetime - [Get Access](/pricing#hosted)

---

## Contributing

Contributions are welcome! Please read our contributing guidelines before submitting PRs.
