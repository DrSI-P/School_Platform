import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Define message type to match OpenAI API
type ChatMessage = {
  role: 'system' | 'user' | 'assistant' | 'function' | 'tool';
  content: string;
  name?: string;
};

// OpenAI Service class for more structured usage
export class OpenAIService {
  private client: OpenAI;

  constructor(apiKey?: string) {
    this.client = new OpenAI({
      apiKey: apiKey || process.env.OPENAI_API_KEY,
    });
  }

  async getChatCompletion(
    messages: ChatMessage[],
    options: {
      model?: string;
      temperature?: number;
      max_tokens?: number;
      top_p?: number;
      frequency_penalty?: number;
      presence_penalty?: number;
    } = {}
  ) {
    try {
      const response = await this.client.chat.completions.create({
        model: options.model || process.env.OPENAI_API_MODEL || 'gpt-4o',
        messages: messages as any, // Type assertion to bypass strict typing
        temperature: options.temperature || 0.7,
        max_tokens: options.max_tokens || 1500,
        top_p: options.top_p || 1,
        frequency_penalty: options.frequency_penalty || 0,
        presence_penalty: options.presence_penalty || 0,
      });

      return {
        content: response.choices[0].message.content,
        usage: response.usage,
      };
    } catch (error) {
      console.error('OpenAI API error:', error);
      throw new Error('Failed to get chat completion');
    }
  }

  async generateEmbedding(text: string) {
    try {
      const response = await this.client.embeddings.create({
        model: 'text-embedding-3-small',
        input: text,
      });

      return {
        embedding: response.data[0].embedding,
        usage: response.usage,
      };
    } catch (error) {
      console.error('OpenAI API error:', error);
      throw new Error('Failed to generate embedding');
    }
  }

  async moderateContent(text: string) {
    try {
      const response = await this.client.moderations.create({
        input: text,
      });

      return {
        flagged: response.results[0].flagged,
        categories: response.results[0].categories,
        scores: response.results[0].category_scores,
      };
    } catch (error) {
      console.error('OpenAI API error:', error);
      throw new Error('Failed to moderate content');
    }
  }
}

// Standalone functions for simpler usage
export async function generateContent(prompt: string, options: any = {}) {
  try {
    const response = await openai.chat.completions.create({
      model: process.env.OPENAI_API_MODEL || 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'You are an expert educational content creator providing high-quality, accurate educational materials tailored to student needs.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: options.temperature || 0.7,
      max_tokens: options.maxTokens || 1500,
    });

    return {
      content: response.choices[0].message.content,
      usage: response.usage,
    };
  } catch (error) {
    console.error('OpenAI API error:', error);
    throw new Error('Failed to generate content');
  }
}

export async function analyzeStudentResponse(question: string, studentResponse: string, gradeLevel: string, subject: string) {
  try {
    const prompt = `
    As an educational assessment expert, analyze this student response:
    
    Question: ${question}
    
    Student Response: ${studentResponse}
    
    This is for a ${gradeLevel} level ${subject} assessment.
    
    Provide:
    1. Accuracy analysis
    2. Conceptual understanding
    3. Strengths demonstrated
    4. Areas for improvement
    5. Suggested follow-up activities
    `;
    
    const response = await openai.chat.completions.create({
      model: process.env.OPENAI_API_MODEL || 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'You are an expert educational assessor providing thoughtful, accurate, and constructive feedback on student work.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.5,
    });

    return {
      analysis: response.choices[0].message.content,
      usage: response.usage,
    };
  } catch (error) {
    console.error('OpenAI API error:', error);
    throw new Error('Failed to analyze student response');
  }
}

export async function generateLessonPlan(subject: string, topic: string, gradeLevel: string, learningObjectives: string[], differentiation: boolean = true) {
  try {
    const prompt = `
    Create a detailed lesson plan for teaching ${topic} in ${subject} for ${gradeLevel} students.
    
    Learning Objectives: ${learningObjectives.join(', ')}
    
    Include:
    - Introduction/hook
    - Main activities with timing
    - Assessment strategies
    - Materials needed
    - Closure activities
    ${differentiation ? '- Differentiation strategies for various learning needs' : ''}
    - Extensions and homework options
    `;
    
    const response = await openai.chat.completions.create({
      model: process.env.OPENAI_API_MODEL || 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'You are an expert curriculum developer creating comprehensive, engaging, and effective lesson plans for educators.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
    });

    return {
      lessonPlan: response.choices[0].message.content,
      usage: response.usage,
    };
  } catch (error) {
    console.error('OpenAI API error:', error);
    throw new Error('Failed to generate lesson plan');
  }
}

export async function personalizeContent(content: string, learnerProfile: any) {
  try {
    const prompt = `
    Adapt the following educational content for a learner with these characteristics:
    
    Learning Style: ${JSON.stringify(learnerProfile.learningStyle)}
    Strengths: ${learnerProfile.strengths.join(', ')}
    Challenges: ${learnerProfile.challenges.join(', ')}
    Interests: ${learnerProfile.interests.join(', ')}
    
    Original Content:
    ${content}
    
    Adapt this content to better engage this learner while maintaining educational integrity. Consider their learning style, build on their strengths, provide support for challenges, and connect to their interests where appropriate.
    `;
    
    const response = await openai.chat.completions.create({
      model: process.env.OPENAI_API_MODEL || 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'You are an expert in differentiated instruction and personalized learning, skilled at adapting educational materials to individual needs while maintaining quality and rigor.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
    });

    return {
      personalizedContent: response.choices[0].message.content,
      usage: response.usage,
    };
  } catch (error) {
    console.error('OpenAI API error:', error);
    throw new Error('Failed to personalize content');
  }
}