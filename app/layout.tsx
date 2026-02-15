import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ClerkProvider } from '@clerk/nextjs'
import { ConvexClientProvider } from '@/providers/ConvexClientProvider'
import { Toaster } from '@/components/ui/toaster'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AI Platform - Deploy and Manage AI Models',
  description: 'Self-hostable AI platform for deploying, managing, and monitoring LLMs, embeddings models, and custom fine-tuned models with powerful API gateway and usage analytics.',
  keywords: 'AI, LLM, OpenAI, Anthropic, Ollama, embeddings, model hosting, API gateway',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <ConvexClientProvider>
        <html lang="en" suppressHydrationWarning>
          <body className={inter.className}>
            {children}
            <Toaster />
          </body>
        </html>
      </ConvexClientProvider>
    </ClerkProvider>
  )
}
