// Database model types

export interface User {
  id: string;
  name: string | null;
  email: string | null;
  emailVerified: Date | null;
  image: string | null;
  password: string | null;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AIUsageLog {
  id: string;
  type: string;
  prompt: string;
  tokensUsed: number;
  userId: string;
  createdAt: Date;
}

export interface AILabSession {
  id: string;
  title: string;
  description: string | null;
  duration: number;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  codeSnippets?: CodeSnippet[];
  aiModels?: AIModel[];
}

export interface CodeSnippet {
  id: string;
  title: string;
  language: string;
  code: string;
  isPublic: boolean;
  sessionId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AIModel {
  id: string;
  name: string;
  provider: string;
  type: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
}