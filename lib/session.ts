import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { user as userTable } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

export type AppUser = typeof userTable.$inferSelect

/** Returns the full app user row, or null if not signed in. */
export async function getCurrentUser(): Promise<AppUser | null> {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) return null
  const rows = await db
    .select()
    .from(userTable)
    .where(eq(userTable.id, session.user.id))
    .limit(1)
  return rows[0] ?? null
}

/** Requires an authenticated user. Redirects to sign-in otherwise. */
export async function requireUser(): Promise<AppUser> {
  const u = await getCurrentUser()
  if (!u) redirect('/login')
  return u
}

/** Just the user id, throws if unauthenticated (for server actions). */
export async function getUserId(): Promise<string> {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) throw new Error('Unauthorized')
  return session.user.id
}

/** Requires a specific role (or higher privilege). */
export async function requireRole(
  roles: Array<'student' | 'moderator' | 'admin'>,
): Promise<AppUser> {
  const u = await requireUser()
  if (!roles.includes(u.role as 'student' | 'moderator' | 'admin')) {
    redirect('/dashboard')
  }
  return u
}
