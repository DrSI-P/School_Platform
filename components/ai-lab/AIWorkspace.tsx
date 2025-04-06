'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { CodeEditor } from '@/components/ai-lab/CodeEditor'
import { AIAssistant } from '@/components/ai-lab/AIAssistant'
import { OutputDisplay } from '@/components/ai-lab/OutputDisplay'
import { ModelSelector } from '@/components/ai-lab/ModelSelector'
import { useToast } from '@/components/ui/use-toast'
import { useSession } from 'next-auth/react'
import { saveLabSession } from '@/lib/api/lab-sessions'

export default function AIWorkspace() {
  const { data: session } = useSession()
  const { toast } = useToast()
  const [code, setCode] = useState('')
  const [output, setOutput] = useState('')
  const [isRunning, setIsRunning] = useState(false)
  const [selectedModel, setSelectedModel] = useState('gpt-4o')
  const [sessionTitle, setSessionTitle] = useState('Untitled Session')
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState('code')
  
  // Initialize with a simple example
  useEffect(() => {
    if (!code) {
      setCode(`// Welcome to the AI Lab
// Try writing some code and use the AI assistant for help

function analyzeText(text) {
  // TODO: Implement sentiment analysis
  return {
    sentiment: "positive",
    keywords: ["example", "analysis"],
    summary: "This is a placeholder for text analysis"
  };
}

// Example usage
const result = analyzeText("I love learning about artificial intelligence!");
console.log(result);
`)
    }
  }, [])

  const runCode = async () => {
    setIsRunning(true)
    setOutput('Running code...')
    
    try {
      // Create a sandbox environment for running the code safely
      const response = await fetch('/api/ai-lab/run-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      })
      
      const data = await response.json()
      
      if (response.ok) {
        setOutput(data.output)
      } else {
        setOutput(`Error: ${data.error}`)
      }
    } catch (error: any) {
      setOutput(`Error: ${error.message}`)
    } finally {
      setIsRunning(false)
    }
  }
  
  const saveSession = async () => {
    if (!session?.user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to save your session",
        variant: "destructive",
      })
      return
    }
    
    try {
      const result = await saveLabSession({
        id: sessionId || undefined,
        title: sessionTitle,
        code,
        selectedModel,
      }, session.user.id)
      
      setSessionId(result.id)
      
      toast({
        title: "Session saved",
        description: "Your AI Lab session has been saved successfully",
      })
    } catch (error: any) {
      toast({
        title: "Error saving session",
        description: error.message,
        variant: "destructive",
      })
    }
  }
  
  return (
    <div className="container mx-auto p-4 space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold">AI Lab</h1>
          <input
            type="text"
            value={sessionTitle}
            onChange={(e) => setSessionTitle(e.target.value)}
            className="border rounded px-2 py-1 text-lg font-medium"
            placeholder="Session title"
          />
        </div>
        <div className="flex space-x-2">
          <Button onClick={saveSession} variant="outline">
            Save Session
          </Button>
          <ModelSelector
            selectedModel={selectedModel}
            onSelectModel={setSelectedModel}
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-[calc(100vh-200px)]">
        <div className="flex flex-col h-full">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
            <TabsList>
              <TabsTrigger value="code">Code Editor</TabsTrigger>
              <TabsTrigger value="assistant">AI Assistant</TabsTrigger>
            </TabsList>
            
            <TabsContent value="code" className="flex-1 p-0">
              <Card className="h-full flex flex-col">
                <CardHeader className="pb-2">
                  <CardTitle>Code Editor</CardTitle>
                  <CardDescription>
                    Write and experiment with AI-powered code
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1 p-0">
                  <CodeEditor 
                    value={code} 
                    onChange={setCode} 
                  />
                </CardContent>
                <CardFooter className="border-t p-2">
                  <Button 
                    onClick={runCode} 
                    disabled={isRunning}
                    className="ml-auto"
                  >
                    {isRunning ? 'Running...' : 'Run Code'}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="assistant" className="flex-1 p-0">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>AI Assistant</CardTitle>
                  <CardDescription>
                    Get help with your code from the AI assistant
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-[calc(100%-130px)]">
                  <AIAssistant 
                    code={code} 
                    model={selectedModel}
                    onSuggestion={(suggestion: string) => setCode(prev => prev + suggestion)} 
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="h-full">
          <Card className="h-full flex flex-col">
            <CardHeader>
              <CardTitle>Output</CardTitle>
              <CardDescription>
                See the results of your code execution
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 p-0">
              <OutputDisplay output={output} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}