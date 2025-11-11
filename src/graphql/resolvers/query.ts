import type { Env } from '../../types/env'
import type { ChatHistoryArgs } from '../../types/graphql'

// 临时内存存储（生产环境应使用 KV 或 D1）
const chatHistory: any[] = []

export const queryResolvers = {
  health: () => {
    return 'OK'
  },

  chatHistory: (_: any, args: ChatHistoryArgs, context: { env: Env }) => {
    const limit = args.limit || 50
    return chatHistory.slice(-limit)
  },
}
