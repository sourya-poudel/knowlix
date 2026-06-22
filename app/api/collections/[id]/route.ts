import { and, eq, inArray } from 'drizzle-orm'
import { getRequestUser } from '@/lib/session'
import { db } from '@/lib/db'
import { bookmark, collection, resource, user } from '@/lib/db/schema'

type RouteContext = { params: Promise<{ id: string }> }

export async function GET(req: Request, context: RouteContext) {
  const currentUser = await getRequestUser(req.headers)
  if (!currentUser) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })

  const { id } = await context.params
  const collectionRows = await db.select().from(collection).where(eq(collection.id, id)).limit(1)
  const col = collectionRows[0]
  if (!col) {
    return new Response(JSON.stringify({ error: 'Collection not found' }), { status: 404 })
  }

  if (!col.isPublic && col.userId !== currentUser.id && !['admin', 'moderator'].includes(currentUser.role)) {
    return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403 })
  }

  const bookmarks = await db
    .select({ resourceId: bookmark.resourceId })
    .from(bookmark)
    .where(eq(bookmark.collectionId, id))

  const resourceIds = bookmarks.map((b) => b.resourceId)
  const resources =
    resourceIds.length > 0
      ? await db.select().from(resource).where(inArray(resource.id, resourceIds))
      : []

  const users = await db
    .select({ id: user.id, name: user.name })
    .from(user)
    .where(inArray(user.id, resources.map((r) => r.userId)))

  const userMap = new Map(users.map((u) => [u.id, u.name]))

  return new Response(
    JSON.stringify({
      collection: { ...col, createdAt: col.createdAt.toISOString() },
      resources: resources.map((r) => ({
        id: r.id,
        title: r.title,
        type: r.type,
        courseCode: r.courseCode,
        courseName: r.courseName,
        uploaderName: userMap.get(r.userId) ?? 'Unknown',
        ratingAvg: r.ratingAvg,
        ratingCount: r.ratingCount,
        downloadCount: r.downloadCount,
        createdAt: r.createdAt.toISOString(),
      })),
    }),
    { status: 200 },
  )
}

export async function PATCH(req: Request, context: RouteContext) {
  const currentUser = await getRequestUser(req.headers)
  if (!currentUser) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })

  const { id } = await context.params
  const col = await db.select().from(collection).where(eq(collection.id, id)).limit(1)
  if (!col[0] || col[0].userId !== currentUser.id) {
    return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403 })
  }

  const body = await req.json().catch(() => ({}))
  await db
    .update(collection)
    .set({
      name: body.name ? String(body.name).trim() : col[0].name,
      description: body.description !== undefined ? String(body.description).trim() : col[0].description,
      isPublic: body.isPublic !== undefined ? Boolean(body.isPublic) : col[0].isPublic,
    })
    .where(eq(collection.id, id))

  return new Response(JSON.stringify({ success: true }), { status: 200 })
}

export async function POST(req: Request, context: RouteContext) {
  const currentUser = await getRequestUser(req.headers)
  if (!currentUser) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })

  const { id } = await context.params
  const col = await db.select().from(collection).where(eq(collection.id, id)).limit(1)
  if (!col[0] || col[0].userId !== currentUser.id) {
    return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403 })
  }

  const body = await req.json().catch(() => ({}))
  const resourceId = String(body.resourceId ?? '')
  if (!resourceId) {
    return new Response(JSON.stringify({ error: 'resourceId is required' }), { status: 400 })
  }

  const existing = await db
    .select()
    .from(bookmark)
    .where(and(eq(bookmark.userId, currentUser.id), eq(bookmark.resourceId, resourceId)))
    .limit(1)

  if (existing[0]) {
    await db
      .update(bookmark)
      .set({ collectionId: id })
      .where(eq(bookmark.id, existing[0].id))
  } else {
    await db.insert(bookmark).values({
      id: crypto.randomUUID(),
      userId: currentUser.id,
      resourceId,
      collectionId: id,
    })
  }

  return new Response(JSON.stringify({ success: true }), { status: 200 })
}

export async function DELETE(req: Request, context: RouteContext) {
  const currentUser = await getRequestUser(req.headers)
  if (!currentUser) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })

  const { id } = await context.params
  const url = new URL(req.url)
  const resourceId = url.searchParams.get('resourceId')

  const col = await db.select().from(collection).where(eq(collection.id, id)).limit(1)
  if (!col[0]) {
    return new Response(JSON.stringify({ error: 'Collection not found' }), { status: 404 })
  }

  if (resourceId) {
    if (col[0].userId !== currentUser.id) {
      return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403 })
    }
    await db
      .update(bookmark)
      .set({ collectionId: null })
      .where(
        and(
          eq(bookmark.collectionId, id),
          eq(bookmark.resourceId, resourceId),
          eq(bookmark.userId, currentUser.id),
        ),
      )
    return new Response(JSON.stringify({ success: true }), { status: 200 })
  }

  if (col[0].userId !== currentUser.id) {
    return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403 })
  }

  await db.update(bookmark).set({ collectionId: null }).where(eq(bookmark.collectionId, id))
  await db.delete(collection).where(eq(collection.id, id))
  return new Response(JSON.stringify({ success: true }), { status: 200 })
}
