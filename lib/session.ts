import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { user as userTable } from '@/lib/db/schema'
import { legacyUserColumns, type LegacyUserRow } from '@/lib/user-compat'
import { hasRoleAccess, type AppRole } from '@/lib/access'
import { eq } from 'drizzle-orm'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

export type AppUser = typeof userTable.$inferSelect

function withActiveDefaults(user: LegacyUserRow) {
  return {
    ...user,
    status: 'active',
    suspendedReason: null,
    suspendedAt: null,
    suspendedBy: null,
  } as AppUser
}

async function loadUserById(userId: string): Promise<AppUser | null> {
  try {
    const rows = await db
      .select()
      .from(userTable)
      .where(eq(userTable.id, userId))
      .limit(1)
    const user = rows[0] ?? null
    if (!user) return null
    if (user.status === 'suspended') return null
    return user
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    if (!message.includes('does not exist')) {
      throw error
    }

    const rows = await db
      .select(legacyUserColumns)
      .from(userTable)
      .where(eq(userTable.id, userId))
      .limit(1)
    const legacyUser = rows[0] ?? null
    return legacyUser ? withActiveDefaults(legacyUser) : null
  }
}

/** Returns the full app user row, or null if not signed in. */
export async function getCurrentUser(): Promise<AppUser | null> {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) return null
  return loadUserById(session.user.id)
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
  return loadUserById(session.user.id)
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
export async function requireInstitutionUser(): Promise<AppUser> {
  const u = await requireUser()

  if (hasRoleAccess(u.role, ['admin', 'moderator'])) {
    return u
  }

  if (!u.institutionId) redirect('/onboarding')

  return u
}
