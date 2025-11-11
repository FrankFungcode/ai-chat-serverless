export enum MessageRole {
  USER = 'USER',
  ASSISTANT = 'ASSISTANT',
  SYSTEM = 'SYSTEM',
}

export interface Message {
  id: string
  content: string
  role: MessageRole
  createdAt: string
}

export interface MessageResponse {
  userMessage: Message
  aiMessage: Message
}

export interface SendMessageArgs {
  message: string
}

export interface ChatHistoryArgs {
  limit?: number
}
