import { auth } from '@/lib/auth'
import { isAdminEmail } from '@/lib/admin-emails'
import { db } from '@/lib/db'
import { user as userTable } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { headers } from 'next/headers'

/** Syncs allowlisted admin emails to the admin role after sign-in or sign-up. */
export async function POST() {
  try {
    const session = await auth.api.getSession({ headers: await headers() })

    if (!session?.user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const email = session.user.email?.toLowerCase() ?? ''
    if (!email) {
      return Response.json({ error: 'Missing email' }, { status: 400 })
    }

    if (!isAdminEmail(email)) {
      return Response.json({ synced: false, role: 'student' })
    }

    await db
      .update(userTable)
      .set({ role: 'admin', updatedAt: new Date() })
      .where(eq(userTable.id, session.user.id))

    return Response.json({ synced: true, role: 'admin' })
  } catch (error) {
    console.error('Set admin role error:', error)
    return Response.json({ error: 'Failed to sync admin role' }, { status: 500 })
  }
}
