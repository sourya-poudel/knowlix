import { eq } from 'drizzle-orm'
import { getRequestUser } from '@/lib/session'
import { db } from '@/lib/db'
import { comment } from '@/lib/db/schema'
import { awardReputation, REPUTATION_POINTS } from '@/lib/reputation'

type RouteContext = { params: Promise<{ id: string }> }

export async function PATCH(req: Request, context: RouteContext) {
  const user = await getRequestUser(req.headers)
  if (!user) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })

  const { id } = await context.params
  const body = await req.json().catch(() => ({}))

  const rows = await db.select().from(comment).where(eq(comment.id, id)).limit(1)
  const existing = rows[0]
  if (!existing) {
    return new Response(JSON.stringify({ error: 'Comment not found' }), { status: 404 })
  }

  if (body.action === 'hide' || body.action === 'unhide') {
    if (!['moderator', 'admin'].includes(user.role)) {
      return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403 })
    }
    await db
      .update(comment)
      .set({ isHidden: body.action === 'hide', updatedAt: new Date() })
      .where(eq(comment.id, id))
    return new Response(JSON.stringify({ success: true }), { status: 200 })
  }

  const text = String(body.body ?? '').trim()
  if (!text) {
    return new Response(JSON.stringify({ error: 'body is required' }), { status: 400 })
  }

  if (existing.userId !== user.id && !['moderator', 'admin'].includes(user.role)) {
    return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403 })
  }

  await db
    .update(comment)
    .set({ body: text, updatedAt: new Date() })
    .where(eq(comment.id, id))

  return new Response(JSON.stringify({ success: true }), { status: 200 })
}

export async function DELETE(req: Request, context: RouteContext) {
  const user = await getRequestUser(req.headers)
  if (!user) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })

  const { id } = await context.params
  const rows = await db.select().from(comment).where(eq(comment.id, id)).limit(1)
  const existing = rows[0]
  if (!existing) {
    return new Response(JSON.stringify({ error: 'Comment not found' }), { status: 404 })
  }

  if (existing.userId !== user.id && !['moderator', 'admin'].includes(user.role)) {
    return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403 })
  }

  await db
    .update(comment)
    .set({ isDeleted: true, body: '[deleted]', updatedAt: new Date() })
    .where(eq(comment.id, id))

  return new Response(JSON.stringify({ success: true }), { status: 200 })
}
