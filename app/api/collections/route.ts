import { and, desc, eq, inArray } from 'drizzle-orm'
import { getRequestUser } from '@/lib/session'
import { db } from '@/lib/db'
import { bookmark, collection, resource } from '@/lib/db/schema'

export async function GET(req: Request) {
  const user = await getRequestUser(req.headers)
  if (!user) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })

  const url = new URL(req.url)
  const userId = url.searchParams.get('userId') ?? user.id

  if (userId !== user.id && !['admin', 'moderator'].includes(user.role)) {
    return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403 })
  }

  const rows = await db
    .select()
    .from(collection)
    .where(eq(collection.userId, userId))
    .orderBy(desc(collection.createdAt))

  const collectionIds = rows.map((c) => c.id)
  const bookmarkCounts =
    collectionIds.length > 0
      ? await db
          .select({
            collectionId: bookmark.collectionId,
            count: bookmark.id,
          })
          .from(bookmark)
          .where(inArray(bookmark.collectionId, collectionIds))
      : []

  const countMap = new Map<string, number>()
  for (const row of bookmarkCounts) {
    if (row.collectionId) {
      countMap.set(row.collectionId, (countMap.get(row.collectionId) ?? 0) + 1)
    }
  }

  return new Response(
    JSON.stringify(
      rows.map((row) => ({
        ...row,
        createdAt: row.createdAt.toISOString(),
        resourceCount: countMap.get(row.id) ?? 0,
      })),
    ),
    { status: 200 },
  )
}

export async function POST(req: Request) {
  const user = await getRequestUser(req.headers)
  if (!user) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })

  const body = await req.json().catch(() => ({}))
  const name = String(body.name ?? '').trim()
  const description = body.description ? String(body.description).trim() : null
  const isPublic = Boolean(body.isPublic)

  if (!name) {
    return new Response(JSON.stringify({ error: 'name is required' }), { status: 400 })
  }

  const id = crypto.randomUUID()
  await db.insert(collection).values({
    id,
    userId: user.id,
    name,
    description,
    isPublic,
  })

  return new Response(JSON.stringify({ success: true, id }), { status: 201 })
}
