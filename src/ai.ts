import OpenAI from 'openai';

let openaiClient: OpenAI | null = null;

function getClient(): OpenAI {
  if (!openaiClient) {
    const apiKey = process.env.OPENAI_API_KEY || process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      throw new Error('No AI API key available. Set OPENAI_API_KEY or OPENROUTER_API_KEY.');
    }
    openaiClient = new OpenAI({
      apiKey,
      baseURL: process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1',
    });
  }
  return openaiClient;
}

export async function generateWithAI(prompt: string, model = 'gpt-3.5-turbo'): Promise<string> {
  const client = getClient();
  
  try {
    const response = await client.chat.completions.create({
      model,
      messages: [
        {
          role: 'system',
          content: 'You are a technical documentation expert. Generate clear, concise, developer-friendly documentation in Markdown format.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 2000,
    });

    return response.choices[0]?.message?.content || '';
  } catch (error) {
    console.error('AI generation failed:', error);
    throw error;
  }
}

export function hasAICapability(): boolean {
  return !!(process.env.OPENAI_API_KEY || process.env.OPENROUTER_API_KEY);
}
