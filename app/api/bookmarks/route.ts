import { and, eq } from 'drizzle-orm'
import { getRequestUser } from '@/lib/session'
import { db } from '@/lib/db'
import { bookmark as bookmarkTable, resource as resourceTable } from '@/lib/db/schema'
import { createNotification } from '@/lib/notifications'

export async function POST(req: Request) {
  const user = await getRequestUser(req.headers)
  if (!user) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })

  const body = await req.json().catch(() => ({}))
  const resourceId = String(body.resourceId ?? '')
  if (!resourceId) {
    return new Response(JSON.stringify({ error: 'resourceId is required' }), { status: 400 })
  }

  const existing = await db
    .select({ id: bookmarkTable.id })
    .from(bookmarkTable)
    .where(and(eq(bookmarkTable.resourceId, resourceId), eq(bookmarkTable.userId, user.id)))
    .limit(1)

  if (existing[0]) {
    return new Response(JSON.stringify({ success: true, id: existing[0].id }), { status: 200 })
  }

  const resourceRows = await db.select().from(resourceTable).where(eq(resourceTable.id, resourceId)).limit(1)
  const target = resourceRows[0]
  if (!target) {
    return new Response(JSON.stringify({ error: 'Resource not found' }), { status: 404 })
  }

  const id = crypto.randomUUID()
  await db.insert(bookmarkTable).values({ id, resourceId, userId: user.id })

  if (target.userId !== user.id) {
    await createNotification({
      userId: target.userId,
      type: 'bookmark_update',
      title: 'Your resource was bookmarked',
      body: `${user.name} saved "${target.title}" for later study.`,
      linkUrl: `/resources/${resourceId}`,
    })
  }

  return new Response(JSON.stringify({ success: true, id }), { status: 201 })
}

export async function GET(req: Request) {
  const user = await getRequestUser(req.headers)
  if (!user) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })

  const rows = await db
    .select({ resourceId: bookmarkTable.resourceId })
    .from(bookmarkTable)
    .where(eq(bookmarkTable.userId, user.id))

  return new Response(JSON.stringify(rows.map((row) => row.resourceId)), { status: 200 })
}

export async function DELETE(req: Request) {
  try {
    const user = await getRequestUser(req.headers)
    if (!user) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })

    const url = new URL(req.url)
    let resourceId = url.searchParams.get('resourceId')
    if (!resourceId) {
      const body = await req.json().catch(() => ({}))
      resourceId = body?.resourceId
    }

    if (!resourceId) {
      return new Response(JSON.stringify({ error: 'resourceId is required' }), { status: 400 })
    }

    await db.delete(bookmarkTable).where(
      and(eq(bookmarkTable.resourceId, resourceId), eq(bookmarkTable.userId, user.id))
    )

    return new Response(JSON.stringify({ success: true }), { status: 200 })
  } catch (error) {
    console.error('Bookmark DELETE error:', error)
    return new Response(JSON.stringify({ error: 'Internal server error', message: String(error) }), { status: 500 })
  }
}
