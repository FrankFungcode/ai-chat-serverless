import type { Env } from '../../types/env'
import type { SendMessageArgs, MessageRole } from '../../types/graphql'
import { createOpenAIClient, getChatCompletion } from '../../services/openai'
import { generateId } from '../../utils/generateId'

// 临时内存存储（生产环境应使用 KV 或 D1）
const chatHistory: any[] = []

export const mutationResolvers = {
  sendMessage: async (_: any, args: SendMessageArgs, context: { env: Env }) => {
    const { message } = args
    const { env } = context

    // 创建用户消息
    const userMessage = {
      id: generateId(),
      content: message,
      role: 'USER' as MessageRole,
      createdAt: new Date().toISOString(),
    }

    // 调用 OpenAI API
    const openaiClient = createOpenAIClient(env)
    const model = env.OPENAI_MODEL || 'gpt-4-turbo-preview'
    const aiResponse = await getChatCompletion(openaiClient, message, model)

    // 创建 AI 消息
    const aiMessage = {
      id: generateId(),
      content: aiResponse,
      role: 'ASSISTANT' as MessageRole,
      createdAt: new Date().toISOString(),
    }

    // 保存到历史记录
    chatHistory.push(userMessage, aiMessage)

    return {
      userMessage,
      aiMessage,
    }
  },

  clearHistory: () => {
    chatHistory.length = 0
    return true
  },
}
