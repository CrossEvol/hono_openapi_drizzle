import { swaggerUI } from '@hono/swagger-ui'
import { createRoute, OpenAPIHono, z } from '@hono/zod-openapi'
import { logger } from 'hono/logger'
import type { AuthType } from './auth'
import { getPostsWithComments } from './database' // 导入新的查询函数
import auth from './routes/auth'
import { PostWithCommentsSchema } from './zod.type' // 导入新的 Zod 类型

const app = new OpenAPIHono<{ Variables: AuthType }>({
    strict: false,
})
app.use(logger())

app.openapi(
    createRoute({
        method: 'get',
        path: '/hello',
        responses: {
            200: {
                description: 'Respond a message',
                content: {
                    'application/json': {
                        schema: z.object({
                            message: z.string(),
                        }),
                    },
                },
            },
        },
    }),
    (c) => {
        return c.json({
            message: 'hello',
        })
    },
)

// 新增 /posts 路由
app.openapi(
    createRoute({
        method: 'get',
        path: '/posts',
        responses: {
            200: {
                description: 'Retrieve all posts with their comments',
                content: {
                    'application/json': {
                        schema: z.object({
                            data: z.array(PostWithCommentsSchema),
                        }),
                    },
                },
            },
        },
    }),
    async (c) => {
        const posts = await getPostsWithComments()
        return c.json({ data: posts })
    },
)

app.route('/api/auth', auth)

// --- Swagger UI --- a
app.get(
    '/ui',
    swaggerUI({
        url: '/doc',
    }),
)

// --- OpenAPI Docs --- a
app.doc('/doc', {
    info: {
        title: 'An API',
        version: 'v1',
    },
    openapi: '3.1.0',
})

export default app
