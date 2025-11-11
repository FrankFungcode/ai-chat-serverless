export const typeDefs = `
  type Query {
    # 获取聊天历史
    chatHistory(limit: Int): [Message!]!

    # 健康检查
    health: String!
  }

  type Mutation {
    # 发送消息并获取 AI 回复
    sendMessage(message: String!): MessageResponse!

    # 清除聊天历史
    clearHistory: Boolean!
  }

  type Message {
    id: ID!
    content: String!
    role: MessageRole!
    createdAt: String!
  }

  type MessageResponse {
    userMessage: Message!
    aiMessage: Message!
  }

  enum MessageRole {
    USER
    ASSISTANT
    SYSTEM
  }
`
