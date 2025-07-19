import { createClient } from '@libsql/client' // 导入 createClient
import 'dotenv/config' // 导入 dotenv/config 以加载环境变量
import { eq } from 'drizzle-orm'
import { drizzle } from 'drizzle-orm/libsql' // 更改为 libsql 驱动
import { projects, users } from './schema'
import { UserWithProjects } from './zod.type'

const client = createClient({
    url: process.env.DB_FILE_NAME!, // 从环境变量中获取数据库 URL
})
export const db = drizzle(client, { logger: true }) // 使用 libsql 客户端初始化 drizzle

export const getUsersWithProject = async () => {
    const rows = await db
        .select()
        .from(users)
        .leftJoin(projects, eq(users.id, projects.ownerId))
        .groupBy(projects.id)
        .all()

    const result = rows.reduce<Record<number, UserWithProjects>>((acc, row) => {
        const user = row.users
        const project = row.projects
        if (!acc[user.id]) {
            acc[user.id] = { ...user, projects: [] }
        }
        if (project?.ownerId === user.id) {
            acc[user.id].projects.push(project)
        }
        return acc
    }, {})

    return Object.values(result)
}
