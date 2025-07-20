import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { openAPI } from 'better-auth/plugins'
import 'dotenv/config'
import { db } from './database'
import { account, session, user, verification } from './schema'

export const auth = betterAuth({
    plugins: [openAPI()],
    database: drizzleAdapter(db, {
        provider: 'sqlite',
        schema: {
            user: user,
            session: session,
            account: account,
            verification: verification,
        },
    }),
    emailAndPassword: {
        enabled: true,
    },
    socialProviders: {
        github: {
            clientId: process.env.GITHUB_CLIENT_ID as string,
            clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
        },
    },
})

export type AuthType = {
    user: typeof auth.$Infer.Session.user | null
    session: typeof auth.$Infer.Session.session | null
}
