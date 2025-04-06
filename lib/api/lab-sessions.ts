import { prisma } from '@/lib/db'

export interface LabSessionData {
  id?: string
  title: string
  code: string
  selectedModel: string
}

/**
 * Save a lab session to the database
 * If an ID is provided, it will update the existing session
 * Otherwise, it will create a new session
 */
export async function saveLabSession(data: LabSessionData, userId: string) {
  try {
    if (data.id) {
      // Update existing session
      const session = await prisma.aiLabSession.update({
        where: {
          id: data.id,
          userId: userId, // Ensure the user owns this session
        },
        data: {
          title: data.title,
          updatedAt: new Date(),
          codeSnippets: {
            create: {
              title: `Code from ${data.title}`,
              language: 'javascript',
              code: data.code,
              isPublic: false,
            },
          },
          aiModels: {
            create: {
              modelId: await getOrCreateModelId(data.selectedModel),
            },
          },
        },
        include: {
          codeSnippets: true,
          aiModels: {
            include: {
              model: true,
            },
          },
        },
      })
      
      return session
    } else {
      // Create new session
      const session = await prisma.aiLabSession.create({
        data: {
          title: data.title,
          description: 'AI Lab session',
          duration: 0, // Will be updated when session ends
          userId: userId,
          codeSnippets: {
            create: {
              title: `Code from ${data.title}`,
              language: 'javascript',
              code: data.code,
              isPublic: false,
            },
          },
          aiModels: {
            create: {
              modelId: await getOrCreateModelId(data.selectedModel),
            },
          },
        },
        include: {
          codeSnippets: true,
          aiModels: {
            include: {
              model: true,
            },
          },
        },
      })
      
      return session
    }
  } catch (error) {
    console.error('Error saving lab session:', error)
    throw new Error('Failed to save lab session')
  }
}

/**
 * Get all lab sessions for a user
 */
export async function getUserLabSessions(userId: string) {
  try {
    const sessions = await prisma.aiLabSession.findMany({
      where: {
        userId: userId,
      },
      orderBy: {
        updatedAt: 'desc',
      },
      include: {
        codeSnippets: true,
        aiModels: {
          include: {
            model: true,
          },
        },
      },
    })
    
    return sessions
  } catch (error) {
    console.error('Error getting user lab sessions:', error)
    throw new Error('Failed to get lab sessions')
  }
}

/**
 * Get a lab session by ID
 */
export async function getLabSession(id: string, userId: string) {
  try {
    const session = await prisma.aiLabSession.findUnique({
      where: {
        id: id,
        userId: userId, // Ensure the user owns this session
      },
      include: {
        codeSnippets: true,
        aiModels: {
          include: {
            model: true,
          },
        },
      },
    })
    
    if (!session) {
      throw new Error('Lab session not found')
    }
    
    return session
  } catch (error) {
    console.error('Error getting lab session:', error)
    throw new Error('Failed to get lab session')
  }
}

/**
 * Delete a lab session
 */
export async function deleteLabSession(id: string, userId: string) {
  try {
    await prisma.aiLabSession.delete({
      where: {
        id: id,
        userId: userId, // Ensure the user owns this session
      },
    })
    
    return { success: true }
  } catch (error) {
    console.error('Error deleting lab session:', error)
    throw new Error('Failed to delete lab session')
  }
}

/**
 * Get or create an AI model ID
 */
async function getOrCreateModelId(modelName: string): Promise<string> {
  try {
    // Try to find existing model
    const existingModel = await prisma.aIModel.findFirst({
      where: {
        name: modelName,
      },
    })
    
    if (existingModel) {
      return existingModel.id
    }
    
    // Create new model if not found
    const newModel = await prisma.aIModel.create({
      data: {
        name: modelName,
        provider: getProviderFromModelName(modelName),
        type: 'TEXT',
        description: `${modelName} AI model`,
      },
    })
    
    return newModel.id
  } catch (error) {
    console.error('Error getting or creating model ID:', error)
    throw new Error('Failed to get or create model ID')
  }
}

/**
 * Get provider from model name
 */
function getProviderFromModelName(modelName: string): string {
  if (modelName.startsWith('gpt-')) {
    return 'OPENAI'
  } else if (modelName.startsWith('claude-')) {
    return 'ANTHROPIC'
  } else if (modelName.startsWith('llama-')) {
    return 'META'
  } else if (modelName.startsWith('code-llama-')) {
    return 'META'
  } else {
    return 'OTHER'
  }
}