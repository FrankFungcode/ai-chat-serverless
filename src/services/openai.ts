import OpenAI from 'openai'
import type { Env } from '../types/env'

export function createOpenAIClient(env: Env): OpenAI {
  return new OpenAI({
    apiKey: env.OPENAI_API_KEY,
    baseURL: env.OPENAI_BASE_URL || 'https://api.openai.com/v1',
  })
}

export async function getChatCompletion(
  client: OpenAI,
  message: string,
  model: string = 'gpt-4-turbo-preview'
): Promise<string> {
  try {
    const completion = await client.chat.completions.create({
      model,
      messages: [
        {
          role: 'system',
          content: '你是一个有帮助的AI助手。请用中文回答用户的问题。',
        },
        {
          role: 'user',
          content: message,
        },
      ],
      temperature: 0.7,
      max_tokens: 2000,
    })

    return completion.choices[0]?.message?.content || '抱歉，我无法生成回复。'
  } catch (error) {
    console.error('OpenAI API Error:', error)
    throw new Error('调用 OpenAI API 失败')
  }
}
