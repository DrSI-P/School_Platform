// Mock Prisma client for development
// This is a temporary solution until we can get Prisma working properly

export const prisma = {
  user: {
    findUnique: async (args: any) => {
      console.log('Mock user findUnique called with:', args);
      // Return a mock user if email matches
      if (args?.where?.email === 'mock@example.com') {
        return {
          id: 'mock-user-id',
          name: 'Mock User',
          email: 'mock@example.com',
          password: '$2a$10$mockhashedpassword', // Mock hashed password
          role: 'user',
        };
      }
      // Return null if no user found
      return null;
    },
  },
  aiUsageLog: {
    create: async (data: any) => {
      console.log('Mock AI usage log created:', data);
      return {
        id: 'mock-log-id',
        ...data.data,
        createdAt: new Date(),
      };
    },
  },
  aiLabSession: {
    create: async (data: any) => {
      console.log('Mock AI lab session created:', data);
      return {
        id: 'mock-session-id',
        ...data.data,
        createdAt: new Date(),
        updatedAt: new Date(),
        codeSnippets: [],
        aiModels: [],
      };
    },
    update: async (data: any) => {
      console.log('Mock AI lab session updated:', data);
      return {
        id: data.where.id,
        ...data.data,
        userId: data.where.userId,
        updatedAt: new Date(),
        codeSnippets: [],
        aiModels: [],
      };
    },
    findMany: async (args: any) => {
      console.log('Mock AI lab session findMany called with:', args);
      return [
        {
          id: 'mock-session-id-1',
          title: 'Mock Session 1',
          description: 'Mock session description',
          duration: 0,
          userId: args.where.userId,
          createdAt: new Date(),
          updatedAt: new Date(),
          codeSnippets: [],
          aiModels: [],
        },
      ];
    },
    findUnique: async (args: any) => {
      console.log('Mock AI lab session findUnique called with:', args);
      if (args.where.id === 'mock-session-id-1') {
        return {
          id: 'mock-session-id-1',
          title: 'Mock Session 1',
          description: 'Mock session description',
          duration: 0,
          userId: args.where.userId,
          createdAt: new Date(),
          updatedAt: new Date(),
          codeSnippets: [],
          aiModels: [],
        };
      }
      return null;
    },
    delete: async (args: any) => {
      console.log('Mock AI lab session delete called with:', args);
      return {
        id: args.where.id,
        title: 'Deleted Session',
        description: 'This session has been deleted',
        duration: 0,
        userId: args.where.userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    },
  },
  aIModel: {
    findFirst: async (args: any) => {
      console.log('Mock AI model findFirst called with:', args);
      if (args.where.name === 'gpt-4') {
        return {
          id: 'mock-model-id-gpt4',
          name: 'gpt-4',
          provider: 'OPENAI',
          type: 'TEXT',
          description: 'GPT-4 AI model',
        };
      }
      return null;
    },
    create: async (data: any) => {
      console.log('Mock AI model created:', data);
      return {
        id: `mock-model-id-${data.data.name.replace(/[^a-zA-Z0-9]/g, '')}`,
        ...data.data,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    },
  },
};