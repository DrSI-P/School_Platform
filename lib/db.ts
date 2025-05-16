// In-memory database for development
// This is a temporary solution until we can set up a proper database

import { v4 as uuidv4 } from 'uuid'
import { User, AIUsageLog, AILabSession, CodeSnippet, AIModel } from '../types/database'

// In-memory storage
const db = {
  users: new Map<string, User>(),
  aiUsageLogs: new Map<string, AIUsageLog>(),
  aiLabSessions: new Map<string, AILabSession>(),
  codeSnippets: new Map<string, CodeSnippet>(),
  aiModels: new Map<string, AIModel>(),
}

// Initialize with some data
const initializeDb = () => {
  // Add a demo user
  const userId = uuidv4()
  db.users.set(userId, {
    id: userId,
    name: 'Demo User',
    email: 'demo@example.com',
    emailVerified: null,
    image: null,
    password: '$2a$10$mockhashedpassword',
    role: 'user',
    createdAt: new Date(),
    updatedAt: new Date(),
  })

  // Add a demo user with email 'mock@example.com' for compatibility
  const mockUserId = 'mock-user-id'
  db.users.set(mockUserId, {
    id: mockUserId,
    name: 'Mock User',
    email: 'mock@example.com',
    emailVerified: null,
    image: null,
    password: '$2a$10$mockhashedpassword',
    role: 'user',
    createdAt: new Date(),
    updatedAt: new Date(),
  })

  // Add a default AI model
  const modelId = uuidv4()
  db.aiModels.set(modelId, {
    id: modelId,
    name: 'gpt-4o',
    provider: 'OPENAI',
    type: 'TEXT',
    description: 'GPT-4o AI model',
    createdAt: new Date(),
    updatedAt: new Date(),
  })

  // Add a sample AI lab session
  const sessionId = 'mock-session-id-1'
  db.aiLabSessions.set(sessionId, {
    id: sessionId,
    title: 'Mock Session 1',
    description: 'Mock session description',
    duration: 0,
    userId: mockUserId,
    createdAt: new Date(),
    updatedAt: new Date(),
  })
}

// Initialize the database
initializeDb()

// Prisma-like client interface
export const prisma = {
  user: {
    findUnique: async (args: any) => {
      const { where } = args
      
      if (where.email) {
        // Find user by email
        for (const user of Array.from(db.users.values())) {
          if (user.email === where.email) {
            return { ...user }
          }
        }
      } else if (where.id) {
        // Find user by id
        const user = db.users.get(where.id)
        if (user) {
          return { ...user }
        }
      }
      
      return null
    },
    create: async (args: any) => {
      const { data } = args
      const id = data.id || uuidv4()
      
      const user: User = {
        id,
        name: data.name,
        email: data.email,
        emailVerified: data.emailVerified || null,
        image: data.image || null,
        password: data.password || null,
        role: data.role || 'user',
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      
      db.users.set(id, user)
      
      return { ...user }
    },
  },
  aiUsageLog: {
    create: async (data: any) => {
      const id = uuidv4()
      
      const log: AIUsageLog = {
        id,
        type: data.data.type,
        prompt: data.data.prompt,
        tokensUsed: data.data.tokensUsed,
        userId: data.data.userId,
        createdAt: new Date(),
      }
      
      db.aiUsageLogs.set(id, log)
      
      return { ...log }
    },
  },
  aiLabSession: {
    create: async (data: any) => {
      const id = data.id || uuidv4()
      
      const session: AILabSession = {
        id,
        title: data.data.title,
        description: data.data.description || null,
        duration: data.data.duration || 0,
        userId: data.data.userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      
      db.aiLabSessions.set(id, session)
      
      // Handle code snippets if provided
      const codeSnippets: CodeSnippet[] = []
      if (data.data.codeSnippets?.create) {
        const snippetId = uuidv4()
        const snippet: CodeSnippet = {
          id: snippetId,
          title: data.data.codeSnippets.create.title,
          language: data.data.codeSnippets.create.language,
          code: data.data.codeSnippets.create.code,
          isPublic: data.data.codeSnippets.create.isPublic,
          sessionId: id,
          createdAt: new Date(),
          updatedAt: new Date(),
        }
        
        db.codeSnippets.set(snippetId, snippet)
        codeSnippets.push(snippet)
      }
      
      return {
        ...session,
        codeSnippets,
        aiModels: [],
      }
    },
    update: async (data: any) => {
      const { where, data: updateData } = data
      
      const session = db.aiLabSessions.get(where.id)
      if (!session || session.userId !== where.userId) {
        return null
      }
      
      const updatedSession: AILabSession = {
        ...session,
        title: updateData.title !== undefined ? updateData.title : session.title,
        description: updateData.description !== undefined ? updateData.description : session.description,
        updatedAt: new Date(),
      }
      
      db.aiLabSessions.set(where.id, updatedSession)
      
      // Get code snippets for this session
      const codeSnippets: CodeSnippet[] = []
      for (const snippet of Array.from(db.codeSnippets.values())) {
        if (snippet.sessionId === where.id) {
          codeSnippets.push({ ...snippet })
        }
      }
      
      return {
        ...updatedSession,
        codeSnippets,
        aiModels: [],
      }
    },
    findMany: async (args: any) => {
      const { where } = args
      
      const sessions: AILabSession[] = []
      for (const session of Array.from(db.aiLabSessions.values())) {
        if (session.userId === where.userId) {
          sessions.push({ ...session })
        }
      }
      
      // For each session, get its code snippets
      return sessions.map(session => {
        const codeSnippets: CodeSnippet[] = []
        for (const snippet of Array.from(db.codeSnippets.values())) {
          if (snippet.sessionId === session.id) {
            codeSnippets.push({ ...snippet })
          }
        }
        
        return {
          ...session,
          codeSnippets,
          aiModels: [],
        }
      })
    },
    findUnique: async (args: any) => {
      const { where } = args
      
      const session = db.aiLabSessions.get(where.id)
      if (!session) {
        return null
      }
      
      // Get code snippets for this session
      const codeSnippets: CodeSnippet[] = []
      for (const snippet of Array.from(db.codeSnippets.values())) {
        if (snippet.sessionId === where.id) {
          codeSnippets.push({ ...snippet })
        }
      }
      
      return {
        ...session,
        codeSnippets,
        aiModels: [],
      }
    },
    delete: async (args: any) => {
      const { where } = args
      
      const session = db.aiLabSessions.get(where.id)
      if (!session) {
        return null
      }
      
      // Delete associated code snippets
      for (const [id, snippet] of Array.from(db.codeSnippets.entries())) {
        if (snippet.sessionId === where.id) {
          db.codeSnippets.delete(id)
        }
      }
      
      // Delete the session
      db.aiLabSessions.delete(where.id)
      
      return {
        ...session,
        updatedAt: new Date(),
      }
    },
  },
  aIModel: {
    findFirst: async (args: any) => {
      const { where } = args
      
      if (where.name) {
        for (const model of Array.from(db.aiModels.values())) {
          if (model.name === where.name) {
            return { ...model }
          }
        }
      }
      
      return null
    },
    create: async (data: any) => {
      const id = uuidv4()
      
      const model: AIModel = {
        id,
        name: data.data.name,
        provider: data.data.provider,
        type: data.data.type,
        description: data.data.description || null,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      
      db.aiModels.set(id, model)
      
      return { ...model }
    },
  },
}