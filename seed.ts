import { createClient } from '@libsql/client' // 导入 createClient
import 'dotenv/config' // 导入 dotenv/config 以加载环境变量
import { count } from 'drizzle-orm'
import { drizzle } from 'drizzle-orm/libsql' // 更改为 libsql 驱动
import { projects, users } from './src/schema'

const client = createClient({
    url: process.env.DB_FILE_NAME!, // 从环境变量中获取数据库 URL
})
const db = drizzle(client, { logger: true }) // 使用 libsql 客户端初始化 drizzle

const initializeUsers = async () => {
    const usersCount = (await db.select({ count: count() }).from(users))[0]
        .count
    if (usersCount === 0) {
        Array.from({ length: 3 }).forEach((_) => {
            db.insert(users)
                .values([
                    {
                        fullName: 'User_' + Date.now().toString(),
                    },
                ])
                .run()
        })
        return true
    } else {
        return false
    }
}

const initializeProjects = async () => {
    const usersCount = (await db.select({ count: count() }).from(users))[0]
        .count
    const projectsCount = (
        await db.select({ count: count() }).from(projects)
    )[0].count
    if (usersCount !== 0 && projectsCount === 0) {
        Array.from({ length: 15 }).forEach((_) => {
            db.insert(projects)
                .values([
                    {
                        name: 'Project_' + Date.now().toString(),
                        ownerId: Math.ceil(Math.random() * 3),
                    },
                ])
                .run()
        })
        return true
    } else {
        return false
    }
}

const main = async () => {
    if (await initializeUsers()) {
        await initializeProjects()
    }
}

await main()
