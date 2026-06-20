import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { resource } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export async function POST(req: Request) {
  const session = await auth.api.getSession({ headers: req.headers })
  if (!session?.user) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })

  if (session.user.email?.toLowerCase() !== 'admin@sourya.com') {
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
