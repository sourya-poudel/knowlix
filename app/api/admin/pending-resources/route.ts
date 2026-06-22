import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { resource } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { getRequestUser } from '@/lib/session'

export async function GET(req: Request) {
  const user = await getRequestUser(req.headers)
  if (!user) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })

  if (!['moderator', 'admin'].includes(user.role)) {
    return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403 })
  }

  const rows = await db
    .select()
    .from(resource)
    .where(eq(resource.status, 'pending'))
    .orderBy(resource.createdAt)

  return new Response(JSON.stringify(rows), { status: 200 })
}
