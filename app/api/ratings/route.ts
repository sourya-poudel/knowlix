import { and, eq, sql } from 'drizzle-orm'
import { getRequestUser } from '@/lib/session'
import { db } from '@/lib/db'
import { rating, resource } from '@/lib/db/schema'
import { awardReputation, REPUTATION_POINTS } from '@/lib/reputation'

export async function GET(req: Request) {
  const user = await getRequestUser(req.headers)
  if (!user) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })

  const url = new URL(req.url)
  const resourceId = url.searchParams.get('resourceId')
  if (!resourceId) {
    return new Response(JSON.stringify({ error: 'resourceId is required' }), { status: 400 })
  }

  const resourceRows = await db.select().from(resource).where(eq(resource.id, resourceId)).limit(1)
  const target = resourceRows[0]
  if (!target) {
    return new Response(JSON.stringify({ error: 'Resource not found' }), { status: 404 })
  }

  const userRating = await db
    .select({ value: rating.value })
    .from(rating)
    .where(and(eq(rating.resourceId, resourceId), eq(rating.userId, user.id)))
    .limit(1)

  return new Response(
    JSON.stringify({
      ratingAvg: target.ratingAvg ?? 0,
      ratingCount: target.ratingCount ?? 0,
      userRating: userRating[0]?.value ?? null,
    }),
    { status: 200 },
  )
}

export async function POST(req: Request) {
  const user = await getRequestUser(req.headers)
  if (!user) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })

  const body = await req.json().catch(() => ({}))
  const resourceId = String(body.resourceId ?? '')
  const value = Number(body.value)

  if (!resourceId || Number.isNaN(value) || value < 1 || value > 5) {
    return new Response(JSON.stringify({ error: 'Valid resourceId and value (1-5) required' }), {
      status: 400,
    })
  }

  const resourceRows = await db.select().from(resource).where(eq(resource.id, resourceId)).limit(1)
  const target = resourceRows[0]
  if (!target || target.status !== 'approved') {
    return new Response(JSON.stringify({ error: 'Resource not found' }), { status: 404 })
  }

  const existing = await db
    .select()
    .from(rating)
    .where(and(eq(rating.resourceId, resourceId), eq(rating.userId, user.id)))
    .limit(1)

  if (existing[0]) {
    await db
      .update(rating)
      .set({ value, updatedAt: new Date() })
      .where(eq(rating.id, existing[0].id))
  } else {
    await db.insert(rating).values({
      id: crypto.randomUUID(),
      resourceId,
      userId: user.id,
      value,
    })
  }

  const aggregates = await db
    .select({
      avg: sql<number>`avg(${rating.value})`,
      count: sql<number>`count(*)::int`,
    })
    .from(rating)
    .where(eq(rating.resourceId, resourceId))

  const ratingAvg = Number(aggregates[0]?.avg ?? 0)
  const ratingCount = aggregates[0]?.count ?? 0

  await db
    .update(resource)
    .set({ ratingAvg, ratingCount, updatedAt: new Date() })
    .where(eq(resource.id, resourceId))

  if (ratingAvg >= 4.5 && ratingCount >= 5 && target.userId !== user.id) {
    await awardReputation(target.userId, REPUTATION_POINTS.highlyRatedResource)
  }

  return new Response(JSON.stringify({ success: true, ratingAvg, ratingCount, userRating: value }), {
    status: 200,
  })
}
