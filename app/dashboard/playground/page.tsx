'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { 
  Send, 
  Loader2,
  Copy,
  Trash2,
  MessageSquare
} from 'lucide-react'
import { useToast } from '@/components/ui/toaster'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

const models = [
  { id: 'gpt-4', name: 'GPT-4', provider: 'OpenAI' },
  { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', provider: 'OpenAI' },
  { id: 'claude-3-opus', name: 'Claude 3 Opus', provider: 'Anthropic' },
  { id: 'claude-3-sonnet', name: 'Claude 3 Sonnet', provider: 'Anthropic' },
  { id: 'llama-2-70b', name: 'Llama 2 70B', provider: 'Ollama' },
]

export default function PlaygroundPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [selectedModel, setSelectedModel] = useState('gpt-4')
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = { role: 'user', content: input }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      const assistantMessage: Message = {
        role: 'assistant',
        content: `This is a simulated response from ${models.find(m => m.id === selectedModel)?.name}. 

In a real implementation, this would connect to your deployed model endpoint and stream the response back to you. The playground allows you to test different models and parameters before integrating them into your application.

Key features:
- Model selection
- Conversation history
- Parameter tuning
- Response streaming
- Token counting

Feel free to ask more questions!`
      }
      setMessages(prev => [...prev, assistantMessage])
      setIsLoading(false)
    }, 1500)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: 'Copied!',
      description: 'Message copied to clipboard',
    })
  }

  const clearConversation = () => {
    setMessages([])
    toast({
      title: 'Cleared',
      description: 'Conversation history has been cleared',
    })
  }

  return (
    <div className="space-y-6 h-[calc(100vh-8rem)]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Playground</h1>
          <p className="text-muted-foreground mt-1">
            Test your AI models in an interactive chat interface
          </p>
        </div>
        <Button variant="outline" onClick={clearConversation}>
          <Trash2 className="h-4 w-4 mr-2" />
          Clear
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr,300px] h-[calc(100%-5rem)]">
        {/* Chat Area */}
        <Card className="flex flex-col">
          <CardHeader className="border-b">
            <div className="flex items-center space-x-2">
              <MessageSquare className="h-5 w-5 text-primary" />
              <Select value={selectedModel} onValueChange={setSelectedModel}>
                <SelectTrigger className="w-[240px]">
                  <SelectValue placeholder="Select a model" />
                </SelectTrigger>
                <SelectContent>
                  {models.map((model) => (
                    <SelectItem key={model.id} value={model.id}>
                      <div className="flex items-center justify-between w-full">
                        <span>{model.name}</span>
                        <Badge variant="secondary" className="ml-2">
                          {model.provider}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          
          <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <MessageSquare className="h-16 w-16 text-muted-foreground mb-4 opacity-50" />
                <h3 className="text-lg font-semibold mb-2">Start a conversation</h3>
                <p className="text-sm text-muted-foreground max-w-md">
                  Select a model and type your message below to test your AI models
                </p>
              </div>
            ) : (
              messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-4 ${
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="whitespace-pre-wrap text-sm">{message.content}</div>
                      {message.role === 'assistant' && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 shrink-0"
                          onClick={() => copyToClipboard(message.content)}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-muted rounded-lg p-4">
                  <Loader2 className="h-5 w-5 animate-spin" />
                </div>
              </div>
            )}
          </CardContent>

          <div className="p-4 border-t">
            <div className="flex space-x-2">
              <Input
                placeholder="Type your message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isLoading}
              />
              <Button onClick={handleSend} disabled={isLoading || !input.trim()}>
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </Card>

        {/* Settings Panel */}
        <Card>
          <CardHeader>
            <CardTitle>Parameters</CardTitle>
            <CardDescription>Customize model behavior</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="temperature">Temperature</Label>
              <Input
                id="temperature"
                type="number"
                step="0.1"
                min="0"
                max="2"
                defaultValue="0.7"
              />
              <p className="text-xs text-muted-foreground">
                Controls randomness (0-2)
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxTokens">Max Tokens</Label>
              <Input
                id="maxTokens"
                type="number"
                min="1"
                max="4096"
                defaultValue="2048"
              />
              <p className="text-xs text-muted-foreground">
                Maximum length of response
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="topP">Top P</Label>
              <Input
                id="topP"
                type="number"
                step="0.1"
                min="0"
                max="1"
                defaultValue="0.9"
              />
              <p className="text-xs text-muted-foreground">
                Nucleus sampling threshold
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="frequencyPenalty">Frequency Penalty</Label>
              <Input
                id="frequencyPenalty"
                type="number"
                step="0.1"
                min="0"
                max="2"
                defaultValue="0"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="presencePenalty">Presence Penalty</Label>
              <Input
                id="presencePenalty"
                type="number"
                step="0.1"
                min="0"
                max="2"
                defaultValue="0"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
