# AI 对话后端 Serverless 项目

## 项目简介

这是一个基于 Cloudflare Workers 的 AI 对话后端 Serverless 应用，通过 GraphQL 提供 API 服务，集成 OpenAI 实现 AI 对话功能，部署在 Cloudflare Workers 上。

## 技术选型

### 核心技术栈

- **运行时**: Cloudflare Workers
- **语言**: TypeScript 5+
- **框架**: Hono (轻量级 Web 框架)
- **GraphQL**: graphql-yoga
- **AI 服务**: OpenAI API
- **包管理器**: pnpm (推荐) / npm / yarn

### 主要依赖

- **Web 框架**: hono
- **GraphQL 服务器**: graphql-yoga
- **GraphQL 工具**: graphql
- **OpenAI SDK**: openai
- **类型支持**: @cloudflare/workers-types
- **开发工具**: wrangler (Cloudflare Workers CLI)

### 开发工具

- **部署工具**: Wrangler CLI
- **代码规范**: ESLint + Prettier
- **类型检查**: TypeScript
- **本地开发**: Miniflare (Wrangler 内置)

## 项目结构

```
ai-chat-serverless/
├── src/
│   ├── graphql/              # GraphQL 相关
│   │   ├── schema.ts         # GraphQL Schema 定义
│   │   ├── resolvers/        # Resolvers
│   │   │   ├── query.ts      # Query resolvers
│   │   │   ├── mutation.ts   # Mutation resolvers
│   │   │   └── index.ts      # 导出所有 resolvers
│   │   └── types.ts          # GraphQL 类型定义
│   ├── services/             # 业务逻辑服务
│   │   ├── openai.ts         # OpenAI 服务
│   │   └── chat.ts           # 聊天服务
│   ├── utils/                # 工具函数
│   │   ├── error.ts          # 错误处理
│   │   └── logger.ts         # 日志工具
│   ├── middleware/           # 中间件
│   │   ├── cors.ts           # CORS 配置
│   │   └── auth.ts           # 认证中间件（可选）
│   ├── types/                # TypeScript 类型定义
│   │   └── env.ts            # 环境变量类型
│   └── index.ts              # 应用入口
├── .dev.vars.example         # 本地开发环境变量示例
├── .eslintrc.json            # ESLint 配置
├── .gitignore                # Git 忽略文件
├── .prettierrc               # Prettier 配置
├── package.json              # 项目配置
├── tsconfig.json             # TypeScript 配置
└── wrangler.toml             # Wrangler 配置
```

## 环境变量配置

### 本地开发环境变量

创建 `.dev.vars` 文件（参考 `.dev.vars.example`）：

```bash
# OpenAI API Key
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# OpenAI API 配置（可选）
OPENAI_BASE_URL=https://api.openai.com/v1
OPENAI_MODEL=gpt-4-turbo-preview

# CORS 允许的源（可选）
ALLOWED_ORIGINS=http://localhost:5173,https://your-domain.pages.dev
```

### 生产环境变量

使用 Wrangler CLI 设置生产环境的 secrets：

```bash
# 设置 OpenAI API Key
wrangler secret put OPENAI_API_KEY

# 设置其他 secrets
wrangler secret put OPENAI_BASE_URL
```

## 快速开始

### 1. 安装依赖

```bash
# 使用 pnpm (推荐)
pnpm install

# 或使用 npm
npm install

# 或使用 yarn
yarn install
```

### 2. 配置环境变量

```bash
# 复制环境变量示例文件
cp .dev.vars.example .dev.vars

# 编辑 .dev.vars 文件，填入你的 OpenAI API Key
```

### 3. 启动本地开发服务器

```bash
# 使用 pnpm
pnpm dev

# 或使用 npm
npm run dev

# 或使用 yarn
yarn dev
```

本地服务器将在 http://localhost:8787 启动

### 4. 测试 GraphQL API

访问 http://localhost:8787/graphql 打开 GraphQL Playground

### 5. 部署到 Cloudflare Workers

```bash
# 登录 Cloudflare
wrangler login

# 部署到生产环境
pnpm deploy

# 或
npm run deploy
```

## Wrangler 配置说明

`wrangler.toml` 配置文件：

```toml
name = "ai-chat-serverless"
main = "src/index.ts"
compatibility_date = "2024-01-01"

# Workers 配置
[build]
command = "npm run build"

# 环境变量（非敏感信息）
[vars]
OPENAI_MODEL = "gpt-4-turbo-preview"
ALLOWED_ORIGINS = "https://your-domain.pages.dev"

# 生产环境配置
[env.production]
name = "ai-chat-serverless"
vars = { OPENAI_MODEL = "gpt-4-turbo-preview" }

# 开发环境配置
[env.development]
name = "ai-chat-serverless-dev"
vars = { OPENAI_MODEL = "gpt-3.5-turbo" }
```

## GraphQL Schema 示例

```graphql
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
```

## API 使用示例

### 发送消息

```graphql
mutation SendMessage {
  sendMessage(message: "你好，请介绍一下自己") {
    userMessage {
      id
      content
      role
      createdAt
    }
    aiMessage {
      id
      content
      role
      createdAt
    }
  }
}
```

### 获取聊天历史

```graphql
query GetChatHistory {
  chatHistory(limit: 50) {
    id
    content
    role
    createdAt
  }
}
```

### 清除历史

```graphql
mutation ClearHistory {
  clearHistory
}
```

## OpenAI 集成说明

### 基础配置

```typescript
// src/services/openai.ts
import OpenAI from 'openai';

export function createOpenAIClient(apiKey: string, baseURL?: string) {
  return new OpenAI({
    apiKey,
    baseURL: baseURL || 'https://api.openai.com/v1',
  });
}

export async function getChatCompletion(
  client: OpenAI,
  messages: Array<{ role: string; content: string }>,
  model: string = 'gpt-4-turbo-preview'
) {
  const completion = await client.chat.completions.create({
    model,
    messages,
    temperature: 0.7,
    max_tokens: 2000,
  });

  return completion.choices[0].message.content;
}
```

### 流式响应（可选）

如果需要实现流式响应，可以使用 Server-Sent Events：

```typescript
export async function getChatCompletionStream(
  client: OpenAI,
  messages: Array<{ role: string; content: string }>,
  model: string = 'gpt-4-turbo-preview'
) {
  const stream = await client.chat.completions.create({
    model,
    messages,
    stream: true,
  });

  return stream;
}
```

## 数据存储

Cloudflare Workers 支持多种存储方案：

### 1. KV Storage（推荐用于聊天历史）

```toml
# wrangler.toml
[[kv_namespaces]]
binding = "CHAT_HISTORY"
id = "your-kv-namespace-id"
```

使用示例：

```typescript
// 保存消息
await env.CHAT_HISTORY.put(
  `message:${messageId}`,
  JSON.stringify(message),
  { expirationTtl: 86400 } // 24小时过期
);

// 读取消息
const message = await env.CHAT_HISTORY.get(`message:${messageId}`, 'json');
```

### 2. Durable Objects（推荐用于会话管理）

适合需要强一致性和实时交互的场景。

### 3. D1 Database（推荐用于结构化数据）

Cloudflare 的 SQL 数据库，适合存储用户信息、会话记录等。

## 错误处理

```typescript
// src/utils/error.ts
export class AppError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code?: string
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export class OpenAIError extends AppError {
  constructor(message: string) {
    super(message, 502, 'OPENAI_ERROR');
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 400, 'VALIDATION_ERROR');
  }
}
```

## CORS 配置

```typescript
// src/middleware/cors.ts
import { Context } from 'hono';

export function corsMiddleware() {
  return async (c: Context, next: () => Promise<void>) => {
    const allowedOrigins = c.env.ALLOWED_ORIGINS?.split(',') || ['*'];
    const origin = c.req.header('Origin');

    if (origin && (allowedOrigins.includes('*') || allowedOrigins.includes(origin))) {
      c.header('Access-Control-Allow-Origin', origin);
    }

    c.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    c.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    c.header('Access-Control-Max-Age', '86400');

    if (c.req.method === 'OPTIONS') {
      return c.text('', 204);
    }

    await next();
  };
}
```

## 性能优化建议

1. **缓存策略**: 使用 KV 缓存常见问题的回答
2. **请求限流**: 使用 Durable Objects 实现 Rate Limiting
3. **响应优化**: 启用 gzip 压缩
4. **监控告警**: 配置 Cloudflare Workers Analytics
5. **错误追踪**: 集成 Sentry 或其他错误追踪服务

## 成本优化

Cloudflare Workers 免费计划：
- 每天 100,000 次请求
- 每次请求 10ms CPU 时间

建议：
1. 使用 KV 缓存减少 OpenAI API 调用
2. 实现请求合并和批处理
3. 设置合理的超时时间
4. 监控使用量，及时优化

## 测试

### 单元测试（推荐使用 Vitest）

```bash
# 安装测试依赖
pnpm add -D vitest @cloudflare/vitest-pool-workers

# 运行测试
pnpm test
```

### 集成测试

```bash
# 使用 wrangler 进行本地测试
wrangler dev

# 使用 curl 测试 API
curl -X POST http://localhost:8787/graphql \
  -H "Content-Type: application/json" \
  -d '{"query":"{ health }"}'
```

## 安全建议

1. **API Key 保护**: 永远不要在代码中硬编码 API Key
2. **请求验证**: 验证所有输入参数
3. **速率限制**: 实现 API 调用频率限制
4. **CORS 配置**: 只允许信任的域名访问
5. **错误信息**: 不要在错误响应中暴露敏感信息
6. **身份认证**: 根据需求添加 JWT 或其他认证机制

## 监控和日志

### 使用 Cloudflare Dashboard

1. 访问 Cloudflare Dashboard
2. 选择 Workers & Pages
3. 查看实时日志和分析数据

### 使用 Wrangler Tail

```bash
# 实时查看日志
wrangler tail

# 查看特定环境的日志
wrangler tail --env production
```

## 常见问题

### Q: 如何处理 OpenAI API 超时？

A: 设置合理的超时时间并实现重试机制：

```typescript
const controller = new AbortController();
const timeoutId = setTimeout(() => controller.abort(), 30000); // 30秒超时

try {
  const completion = await client.chat.completions.create({
    model,
    messages,
  }, {
    signal: controller.signal,
  });
  clearTimeout(timeoutId);
  return completion;
} catch (error) {
  if (error.name === 'AbortError') {
    throw new OpenAIError('请求超时');
  }
  throw error;
}
```

### Q: 如何实现对话上下文管理？

A: 使用 KV 存储对话历史：

```typescript
// 保存对话上下文
const conversationKey = `conversation:${userId}`;
const history = await env.CHAT_HISTORY.get(conversationKey, 'json') || [];
history.push({ role: 'user', content: message });
history.push({ role: 'assistant', content: response });

// 只保留最近的 10 条消息
const recentHistory = history.slice(-10);
await env.CHAT_HISTORY.put(conversationKey, JSON.stringify(recentHistory));
```

### Q: 如何降低 OpenAI API 成本？

A:
1. 使用 gpt-3.5-turbo 替代 gpt-4（成本降低 90%）
2. 限制 max_tokens 参数
3. 缓存常见问题的答案
4. 实现智能上下文截断

## 相关资源

- [Cloudflare Workers 文档](https://developers.cloudflare.com/workers/)
- [Hono 文档](https://hono.dev/)
- [GraphQL Yoga 文档](https://the-guild.dev/graphql/yoga-server)
- [OpenAI API 文档](https://platform.openai.com/docs/)
- [Wrangler CLI 文档](https://developers.cloudflare.com/workers/wrangler/)

## License

MIT
