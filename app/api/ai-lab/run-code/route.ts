import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
// import { VM } from 'vm2' - Removing VM2 import to avoid build issues
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
    const { code } = await request.json()
    
    // Validate request
    if (!code || typeof code !== 'string') {
      return NextResponse.json(
        { error: 'Invalid request: code is required' },
        { status: 400 }
      )
    }
    
    // Instead of using VM2, we'll just simulate code execution
    // This is a temporary solution until we can fix the VM2 issues
    const output: string[] = []
    
    // Add some simulated output
    output.push('// Code execution simulated for development')
    output.push('// Actual code execution is disabled in this build')
    output.push(`// Your code (${code.length} characters) would run here`)
    output.push('console.log("Hello, world!");')
    output.push('Hello, world!')
    
    // Log code execution
    await prisma.aiLabSession.create({
      data: {
        title: 'Code Execution',
        description: 'Code executed in AI Lab',
        duration: 0, // Actual duration not tracked
        userId: session.user.id,
        codeSnippets: {
          create: {
            title: 'Executed Code',
            language: 'javascript',
            code: code,
            isPublic: false,
          },
        },
      },
    })
    
    return NextResponse.json({ output: output.join('\n') })
  } catch (error: any) {
    console.error('Code execution error:', error)
    
    return NextResponse.json(
      { error: 'Failed to execute code', details: error.message },
      { status: 500 }
    )
  }
}