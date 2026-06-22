import { and, eq, sql } from 'drizzle-orm'
import { getRequestUser } from '@/lib/session'
import { db } from '@/lib/db'
import { request as requestTable, requestVote, resource } from '@/lib/db/schema'
import { createNotification } from '@/lib/notifications'
import { awardReputation, REPUTATION_POINTS } from '@/lib/reputation'

type RouteContext = { params: Promise<{ id: string }> }

export async function POST(req: Request, context: RouteContext) {
  const user = await getRequestUser(req.headers)
  if (!user?.institutionId) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
  }

  const { id } = await context.params
  const body = await req.json().catch(() => ({}))
  const action = String(body.action ?? 'vote')

  const rows = await db.select().from(requestTable).where(eq(requestTable.id, id)).limit(1)
  const target = rows[0]
  if (!target || target.institutionId !== user.institutionId) {
    return new Response(JSON.stringify({ error: 'Request not found' }), { status: 404 })
  }

  if (action === 'vote') {
    const existing = await db
      .select()
      .from(requestVote)
      .where(and(eq(requestVote.requestId, id), eq(requestVote.userId, user.id)))
      .limit(1)

    if (existing[0]) {
      return new Response(JSON.stringify({ error: 'Already voted' }), { status: 409 })
    }

    await db.insert(requestVote).values({
      id: crypto.randomUUID(),
      requestId: id,
      userId: user.id,
    })

    await db
      .update(requestTable)
      .set({ upvoteCount: sql`${requestTable.upvoteCount} + 1` })
      .where(eq(requestTable.id, id))

    if (target.userId !== user.id) {
      await awardReputation(target.userId, REPUTATION_POINTS.requestUpvoted)
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 })
  }

  if (action === 'fulfill') {
    const resourceId = String(body.resourceId ?? '')
    if (!resourceId) {
      return new Response(JSON.stringify({ error: 'resourceId is required' }), { status: 400 })
    }

    const resourceRows = await db.select().from(resource).where(eq(resource.id, resourceId)).limit(1)
    const linked = resourceRows[0]
    if (!linked || linked.status !== 'approved') {
      return new Response(JSON.stringify({ error: 'Resource not found' }), { status: 404 })
    }

    await db
      .update(requestTable)
      .set({
        status: 'fulfilled',
        fulfilledResourceId: resourceId,
      })
      .where(eq(requestTable.id, id))

    await awardReputation(user.id, REPUTATION_POINTS.requestFulfilled)

    if (target.userId !== user.id) {
      await createNotification({
        userId: target.userId,
        type: 'request_fulfilled',
        title: 'Your resource request was fulfilled',
        body: `"${target.title}" now has a matching upload.`,
        linkUrl: `/resources/${resourceId}`,
      })
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 })
  }

  return new Response(JSON.stringify({ error: 'Invalid action' }), { status: 400 })
}
