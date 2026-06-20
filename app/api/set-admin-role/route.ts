import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { user as userTable } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { headers } from 'next/headers'

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    
    if (!session?.user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const email = session.user.email
    if (email !== 'admin@sourya.com') {
      return Response.json({ error: 'Only admin@sourya.com can have admin role' }, { status: 403 })
    }

    // Update user role to admin
    await db
      .update(userTable)
      .set({ role: 'admin' })
      .where(eq(userTable.id, session.user.id))

    return Response.json({ success: true })
  } catch (error) {
    console.error('Set admin role error:', error)
    return Response.json({ error: 'Failed to set admin role' }, { status: 500 })
  }
}
