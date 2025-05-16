'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card } from '@/components/ui/card'
import { useToast } from '@/components/ui/use-toast'
import { Loader2, SendIcon, PlusIcon, CheckIcon } from 'lucide-react'

interface AIAssistantProps {
  code: string
  model: string
  onSuggestion: (suggestion: string) => void
}

interface Message {
  role: 'user' | 'assistant'
  content: string
}

export function AIAssistant({ code, model, onSuggestion }: AIAssistantProps) {
  const { toast } = useToast()
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Hello! I\'m your AI coding assistant. How can I help you with your code today?'
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  
  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])
  
  const sendMessage = async () => {
    if (!input.trim()) return
    
    // Add user message to chat
    const userMessage: Message = { role: 'user', content: input }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)
    
    try {
      // Send message to API
      const response = await fetch('/api/ai-lab/assistant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          code,
          model,
        }),
      })
      
      if (!response.ok) {
        throw new Error('Failed to get response from AI assistant')
      }
      
      const data = await response.json()
      
      // Add AI response to chat
      setMessages(prev => [...prev, { role: 'assistant', content: data.response }])
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'An error occurred',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }
  
  const applySuggestion = (content: string) => {
    // Extract code blocks from markdown
    const codeBlockRegex = /```(?:javascript|js|typescript|ts)?\n([\s\S]*?)```/g
    
    // Use a different approach instead of spread operator with matchAll
    const matches = []
    let match
    while ((match = codeBlockRegex.exec(content)) !== null) {
      matches.push(match)
    }
    
    if (matches.length > 0) {
      // Use the first code block found
      onSuggestion(matches[0][1])
      toast({
        title: 'Code applied',
        description: 'The suggested code has been added to your editor',
      })
    } else {
      toast({
        title: 'No code found',
        description: 'No code blocks were found in the suggestion',
        variant: 'destructive',
      })
    }
  }
  
  const askForHelp = async () => {
    if (!code.trim()) {
      toast({
        title: 'No code',
        description: 'Please write some code first',
        variant: 'destructive',
      })
      return
    }
    
    setIsLoading(true)
    
    // Create a message asking for help with the current code
    const helpMessage: Message = {
      role: 'user',
      content: 'Can you help me improve this code and explain what it does?\n\n```javascript\n' + code + '\n```'
    }
    
    setMessages(prev => [...prev, helpMessage])
    
    try {
      // Send message to API
      const response = await fetch('/api/ai-lab/assistant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, helpMessage],
          code,
          model,
        }),
      })
      
      if (!response.ok) {
        throw new Error('Failed to get response from AI assistant')
      }
      
      const data = await response.json()
      
      // Add AI response to chat
      setMessages(prev => [...prev, { role: 'assistant', content: data.response }])
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'An error occurred',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }
  
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                message.role === 'user'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted'
              }`}
            >
              <div className="prose prose-sm dark:prose-invert">
                {message.content.split('\n').map((line, i) => (
                  <p key={i} className="mb-1">
                    {line}
                  </p>
                ))}
              </div>
              
              {message.role === 'assistant' && message.content.includes('```') && (
                <Button
                  size="sm"
                  variant="secondary"
                  className="mt-2"
                  onClick={() => applySuggestion(message.content)}
                >
                  <PlusIcon className="h-4 w-4 mr-1" />
                  Apply Code
                </Button>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="border-t p-4 space-y-2">
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={askForHelp}
            disabled={isLoading}
          >
            Analyze My Code
          </Button>
        </div>
        
        <div className="flex space-x-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question about your code..."
            className="min-h-[80px]"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                sendMessage()
              }
            }}
          />
          <Button
            className="self-end"
            onClick={sendMessage}
            disabled={isLoading || !input.trim()}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <SendIcon className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}