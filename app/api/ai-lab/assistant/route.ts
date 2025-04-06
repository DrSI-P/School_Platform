import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { OpenAIService } from '@/lib/ai/openai-service'
import { prisma } from '@/lib/db'

export async function POST(request: Request) {
  // Check authentication
  const session = await getServerSession(authOptions)
  
  if (!session?.user) {
    return NextResponse.json(
      { error: 'Authentication required' },
      { status: 401 }
    )
  }
  
  try {
    const { messages, code, model } = await request.json()
    
    // Validate request
    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Invalid request: messages array is required' },
        { status: 400 }
      )
    }
    
    // Create system message with context
    const systemMessage = {
      role: 'system',
      content: `You are an AI coding assistant in an educational platform called EdPsychConnect. 
      You help students learn to code and build AI-powered tools for education.
      
      When providing code examples, use markdown code blocks with the appropriate language tag.
      For example: \`\`\`javascript
      // Your code here
      \`\`\`
      
      Be concise, helpful, and focus on teaching good coding practices.
      If the user shares code with you, analyze it and provide constructive feedback.
      
      Current code context:
      \`\`\`javascript
      ${code || 'No code provided'}
      \`\`\`
      `
    }
    
    // Get response from OpenAI
    const openai = new OpenAIService()
    const aiResponse = await openai.getChatCompletion(
      [systemMessage, ...messages],
      {
        model: model || process.env.OPENAI_API_MODEL || 'gpt-4o',
        temperature: 0.7,
        max_tokens: 2000,
      }
    )
    
    // Log AI usage
    await prisma.aiUsageLog.create({
      data: {
        type: 'AI_LAB_ASSISTANT',
        prompt: JSON.stringify(messages),
        tokensUsed: aiResponse.usage?.total_tokens || 0,
        userId: session.user.id,
      },
    })
    
    return NextResponse.json({ response: aiResponse.content })
  } catch (error) {
    console.error('AI Lab Assistant error:', error)
    
    return NextResponse.json(
      { error: 'Failed to get response from AI assistant' },
      { status: 500 }
    )
  }
}