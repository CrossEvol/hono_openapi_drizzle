import { createClient } from '@libsql/client' // 导入 createClient
import 'dotenv/config' // 导入 dotenv/config 以加载环境变量
import { drizzle } from 'drizzle-orm/libsql' // 更改为 libsql 驱动
import { migrate } from 'drizzle-orm/libsql/migrator' // 更改为 libsql 迁移器

const client = createClient({
    url: process.env.DB_FILE_NAME!, // 从环境变量中获取数据库 URL
})
const db = drizzle(client, { logger: true }) // 使用 libsql 客户端初始化 drizzle

// this will automatically run needed migrations on the database
migrate(db, { migrationsFolder: './drizzle' })
