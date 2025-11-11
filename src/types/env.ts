export interface Env {
  // Secrets
  OPENAI_API_KEY: string

  // Variables
  OPENAI_BASE_URL?: string
  OPENAI_MODEL?: string
  ALLOWED_ORIGINS?: string

  // KV Namespace (optional)
  // CHAT_HISTORY?: KVNamespace
}
