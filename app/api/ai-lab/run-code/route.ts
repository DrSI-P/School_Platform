import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { VM } from 'vm2'
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
    
    // Create a sandbox environment for running the code safely
    const vm = new VM({
      timeout: 5000, // 5 seconds timeout
      sandbox: {
        console: {
          log: (...args: any[]) => {
            output.push(
              args
                .map((arg) => {
                  if (typeof arg === 'object') {
                    try {
                      return JSON.stringify(arg, null, 2)
                    } catch (e) {
                      return String(arg)
                    }
                  }
                  return String(arg)
                })
                .join(' ')
            )
          },
          error: (...args: any[]) => {
            output.push(
              `Error: ${args
                .map((arg) => {
                  if (typeof arg === 'object') {
                    try {
                      return JSON.stringify(arg, null, 2)
                    } catch (e) {
                      return String(arg)
                    }
                  }
                  return String(arg)
                })
                .join(' ')}`
            )
          },
          warn: (...args: any[]) => {
            output.push(
              `Warning: ${args
                .map((arg) => {
                  if (typeof arg === 'object') {
                    try {
                      return JSON.stringify(arg, null, 2)
                    } catch (e) {
                      return String(arg)
                    }
                  }
                  return String(arg)
                })
                .join(' ')}`
            )
          },
          info: (...args: any[]) => {
            output.push(
              `Info: ${args
                .map((arg) => {
                  if (typeof arg === 'object') {
                    try {
                      return JSON.stringify(arg, null, 2)
                    } catch (e) {
                      return String(arg)
                    }
                  }
                  return String(arg)
                })
                .join(' ')}`
            )
          },
        },
        setTimeout: (callback: Function, ms: number) => {
          if (ms > 4000) ms = 4000 // Limit setTimeout to 4 seconds
          return setTimeout(callback, ms)
        },
        clearTimeout: clearTimeout,
        setInterval: () => {
          throw new Error('setInterval is not allowed in the sandbox')
        },
        clearInterval: () => {
          throw new Error('clearInterval is not allowed in the sandbox')
        },
        // Add any other safe globals here
        Math: Math,
        Date: Date,
        JSON: JSON,
        Object: Object,
        Array: Array,
        String: String,
        Number: Number,
        Boolean: Boolean,
        Error: Error,
        RegExp: RegExp,
        Map: Map,
        Set: Set,
        Promise: Promise,
      },
    })
    
    // Capture console output
    const output: string[] = []
    
    // Run the code in the sandbox
    try {
      vm.run(code)
    } catch (error: any) {
      output.push(`Runtime Error: ${error.message}`)
    }
    
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