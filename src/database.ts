import { createClient } from '@libsql/client' // 导入 createClient
import 'dotenv/config' // 导入 dotenv/config 以加载环境变量
import { eq } from 'drizzle-orm' // 导入 eq 函数
import { drizzle } from 'drizzle-orm/libsql' // 更改为 libsql 驱动
import { comments, posts } from './schema' // 导入 posts 和 comments 表
import { PostWithComments } from './zod.type'

const client = createClient({
    url: process.env.DB_FILE_NAME!, // 从环境变量中获取数据库 URL
})
export const db = drizzle(client, { logger: true }) // 使用 libsql 客户端初始化 drizzle，并传入 schema

export const getPostsWithComments = async () => {
    const rows = await db
        .select()
        .from(posts)
        .leftJoin(comments, eq(posts.id, comments.postId))
        .all()

    const result = rows.reduce<Record<number, PostWithComments>>((acc, row) => {
        const post = row.posts
        const comment = row.comments
        if (!acc[post.id]) {
            acc[post.id] = { ...post, comments: [] }
        }
        if (comment?.postId === post.id) {
            // 确保 comment 存在且关联到当前 post
            acc[post.id].comments.push(comment)
        }
        return acc
    }, {})

    return Object.values(result)
}
