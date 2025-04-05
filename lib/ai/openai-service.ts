import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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