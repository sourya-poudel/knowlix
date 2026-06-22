import { and, eq, sql } from 'drizzle-orm'
import { getRequestUser } from '@/lib/session'
import { db } from '@/lib/db'
import { comment } from '@/lib/db/schema'
import { awardReputation, REPUTATION_POINTS } from '@/lib/reputation'

type RouteContext = { params: Promise<{ id: string }> }

export async function POST(req: Request, context: RouteContext) {
  const user = await getRequestUser(req.headers)
  if (!user) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })

  const { id } = await context.params
  const rows = await db.select().from(comment).where(eq(comment.id, id)).limit(1)
  const existing = rows[0]
  if (!existing || existing.isDeleted) {
    return new Response(JSON.stringify({ error: 'Comment not found' }), { status: 404 })
  }

  if (existing.userId === user.id) {
    return new Response(JSON.stringify({ error: 'Cannot mark your own comment helpful' }), { status: 400 })
  }

  const updated = await db
    .update(comment)
    .set({ helpfulCount: sql`${comment.helpfulCount} + 1`, updatedAt: new Date() })
    .where(eq(comment.id, id))
    .returning({ helpfulCount: comment.helpfulCount })

  const newCount = updated[0]?.helpfulCount ?? existing.helpfulCount + 1
  if (newCount === 5 || newCount === 10) {
    await awardReputation(existing.userId, REPUTATION_POINTS.helpfulComment)
  }

  return new Response(JSON.stringify({ success: true, helpfulCount: newCount }), { status: 200 })
}
