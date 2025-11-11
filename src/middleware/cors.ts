import type { Context } from 'hono'
import type { Env } from '../types/env'

export function corsMiddleware() {
  return async (c: Context<{ Bindings: Env }>, next: () => Promise<void>) => {
    const allowedOriginsStr = c.env.ALLOWED_ORIGINS || '*'
    const allowedOrigins = allowedOriginsStr.split(',').map((origin) => origin.trim())
    const origin = c.req.header('Origin')

    if (origin && (allowedOrigins.includes('*') || allowedOrigins.includes(origin))) {
      c.header('Access-Control-Allow-Origin', origin)
    } else if (allowedOrigins.includes('*')) {
      c.header('Access-Control-Allow-Origin', '*')
    }

    c.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    c.header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    c.header('Access-Control-Max-Age', '86400')

    if (c.req.method === 'OPTIONS') {
      return c.text('', 204)
    }

    await next()
  }
}
