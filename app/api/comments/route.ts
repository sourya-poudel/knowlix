import { eq } from 'drizzle-orm'
import { getRequestUser } from '@/lib/session'
import { db } from '@/lib/db'
import { comment, resource } from '@/lib/db/schema'
import { getCommentThread } from '@/lib/resource-queries'
import { createNotification } from '@/lib/notifications'
import { awardReputation, REPUTATION_POINTS } from '@/lib/reputation'

export async function GET(req: Request) {
  const user = await getRequestUser(req.headers)
  if (!user) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })

  const url = new URL(req.url)
  const resourceId = url.searchParams.get('resourceId')
  if (!resourceId) {
    return new Response(JSON.stringify({ error: 'resourceId is required' }), { status: 400 })
  }

  const includeHidden = ['moderator', 'admin'].includes(user.role)
  const thread = await getCommentThread(resourceId, includeHidden)
  return new Response(JSON.stringify(thread), { status: 200 })
}

export async function POST(req: Request) {
  const user = await getRequestUser(req.headers)
  if (!user) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })

  const body = await req.json().catch(() => ({}))
  const resourceId = String(body.resourceId ?? '')
  const parentId = body.parentId ? String(body.parentId) : null
  const text = String(body.body ?? '').trim()

  if (!resourceId || !text) {
    return new Response(JSON.stringify({ error: 'resourceId and body are required' }), { status: 400 })
  }

  const resourceRows = await db.select().from(resource).where(eq(resource.id, resourceId)).limit(1)
  const target = resourceRows[0]
  if (!target || target.status !== 'approved') {
    return new Response(JSON.stringify({ error: 'Resource not found' }), { status: 404 })
  }

  if (parentId) {
    const parentRows = await db.select().from(comment).where(eq(comment.id, parentId)).limit(1)
    if (!parentRows[0] || parentRows[0].resourceId !== resourceId) {
      return new Response(JSON.stringify({ error: 'Invalid parent comment' }), { status: 400 })
    }
  }

  const id = crypto.randomUUID()
  await db.insert(comment).values({
    id,
    resourceId,
    userId: user.id,
    parentId,
    body: text,
  })

  await awardReputation(user.id, REPUTATION_POINTS.commentPosted)

  if (parentId) {
    const parent = await db.select().from(comment).where(eq(comment.id, parentId)).limit(1)
    const parentUserId = parent[0]?.userId
    if (parentUserId && parentUserId !== user.id) {
      await createNotification({
        userId: parentUserId,
        type: 'comment_reply',
        title: 'New reply to your comment',
        body: `${user.name} replied on "${target.title}"`,
        linkUrl: `/resources/${resourceId}#comment-${id}`,
      })
    }
  } else if (target.userId !== user.id) {
    await createNotification({
      userId: target.userId,
      type: 'new_comment',
      title: 'New comment on your resource',
      body: `${user.name} commented on "${target.title}"`,
      linkUrl: `/resources/${resourceId}#comment-${id}`,
    })
  }

  return new Response(JSON.stringify({ success: true, id }), { status: 201 })
}
