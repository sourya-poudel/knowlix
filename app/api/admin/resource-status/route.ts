import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { resource } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { getRequestUser } from '@/lib/session'

export async function POST(req: Request) {
  const user = await getRequestUser(req.headers)
  if (!user) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })

  if (!['moderator', 'admin'].includes(user.role)) {
    return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403 })
  }

  const body = await req.json().catch(() => ({}))
  const resourceId = String(body.resourceId ?? '')
  const status = body.status === 'approved' ? 'approved' : 'rejected'

  if (!resourceId) {
    return new Response(JSON.stringify({ error: 'resourceId is required' }), { status: 400 })
  }

  await db.update(resource).set({ status }).where(eq(resource.id, resourceId))

  return new Response(JSON.stringify({ success: true }), { status: 200 })
}
