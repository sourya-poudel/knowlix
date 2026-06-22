import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { user as userTable } from '@/lib/db/schema'
import { hasRoleAccess, type AppRole } from '@/lib/access'
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
  const user = rows[0] ?? null
  if (!user || user.status === 'suspended') return null
  return user
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

/** Returns the current app user for an arbitrary request header set. */
export async function getRequestUser(requestHeaders: Headers): Promise<AppUser | null> {
  const session = await auth.api.getSession({ headers: requestHeaders })
  if (!session?.user) return null

  const rows = await db
    .select()
    .from(userTable)
    .where(eq(userTable.id, session.user.id))
    .limit(1)

  const user = rows[0] ?? null
  if (!user || user.status === 'suspended') return null
  return user
}

/** Throws when the current request user is missing or lacks the required role. */
export async function requireRequestRole(
  requestHeaders: Headers,
  roles: AppRole[],
): Promise<AppUser> {
  const user = await getRequestUser(requestHeaders)
  if (!user) throw new Error('Unauthorized')
  if (!hasRoleAccess(user.role, roles)) throw new Error('Forbidden')
  return user
}

/** Requires a specific role (or higher privilege). */
export async function requireRole(
  roles: AppRole[],
): Promise<AppUser> {
  const u = await requireUser()
  if (!hasRoleAccess(u.role, roles)) {
    redirect('/dashboard')
  }
  return u
}

/** Requires a signed-in user who belongs to an institution. */
export async function requireInstitutionUser(): Promise<AppUser & { institutionId: string }> {
  const u = await requireUser()
  if (!u.institutionId) redirect('/signup')
  return u as AppUser & { institutionId: string }
}
