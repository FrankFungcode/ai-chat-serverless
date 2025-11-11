import { Hono } from 'hono'
import { createYoga } from 'graphql-yoga'
import type { Env } from './types/env'
import { typeDefs } from './graphql/schema'
import { resolvers } from './graphql/resolvers'
import { corsMiddleware } from './middleware/cors'

const app = new Hono<{ Bindings: Env }>()

// 应用 CORS 中间件
app.use('*', corsMiddleware())

// 创建 GraphQL Yoga 实例
app.use('/graphql', async (c) => {
  const yoga = createYoga({
    schema: {
      typeDefs,
      resolvers,
    },
    graphqlEndpoint: '/graphql',
    landingPage: true,
    context: {
      env: c.env,
    },
  })

  const response = await yoga.fetch(c.req.raw, {
    env: c.env,
  })

  return response
})

// 健康检查端点
app.get('/', (c) => {
  return c.json({
    message: 'AI Chat Serverless API',
    version: '0.1.0',
    endpoints: {
      graphql: '/graphql',
      health: '/health',
    },
  })
})

app.get('/health', (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() })
})

export default app
