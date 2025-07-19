import 'dotenv/config' // 导入 dotenv/config 以加载环境变量
import type { Config } from 'drizzle-kit'

export default {
    schema: './src/schema.ts',
    out: './drizzle',
    dialect: 'sqlite',
    dbCredentials: {
        url: process.env.DB_FILE_NAME!, // 从环境变量中获取数据库 URL
    },
} satisfies Config
