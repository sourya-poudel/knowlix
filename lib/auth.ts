import { betterAuth } from 'better-auth'
import { isAdminEmail } from '@/lib/admin-emails'
import { pool } from '@/lib/db'

export const auth = betterAuth({
  database: pool,
  secret: process.env.BETTER_AUTH_SECRET ?? process.env.AUTH_SECRET,
  baseURL:
    process.env.BETTER_AUTH_URL ??
    process.env.APP_URL ??
    process.env.NEXT_PUBLIC_APP_URL ??
    'http://localhost:3000',
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
  },
  user: {
    additionalFields: {
      institutionId: {
        type: 'string',
        required: false,
        input: true,
      },
      role: {
        type: 'string',
        required: false,
        input: false,
        defaultValue: 'student',
      },
      bio: {
        type: 'string',
        required: false,
        input: true,
      },
      reputation: {
        type: 'number',
        required: false,
        input: false,
        defaultValue: 0,
      },
    },
  },
  trustedOrigins: [
    ...(process.env.APP_URL ? [process.env.APP_URL] : []),
    ...(process.env.NEXT_PUBLIC_APP_URL ? [process.env.NEXT_PUBLIC_APP_URL] : []),
  ],
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
    updateAndExpiresSession: true,
  },
  ...(process.env.NODE_ENV === 'development'
    ? {
        advanced: {
          defaultCookieAttributes: {
            sameSite: 'none' as const,
            secure: true,
          },
        },
      }
    : {}),
  databaseHooks: {
    user: {
      create: {
        after: async (createdUser) => {
          const email = createdUser.email?.toLowerCase()
          if (!email || !isAdminEmail(email)) return
          await pool.query('UPDATE "user" SET role = $1, "updatedAt" = NOW() WHERE id = $2', [
            'admin',
            createdUser.id,
          ])
        },
      },
    },
  },
})
