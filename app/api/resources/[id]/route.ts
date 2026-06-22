import { and, eq, sql } from 'drizzle-orm'
import { getRequestUser } from '@/lib/session'
import { db } from '@/lib/db'
import { resource } from '@/lib/db/schema'
import { getRelatedResources, getResourceById } from '@/lib/resource-queries'

type RouteContext = { params: Promise<{ id: string }> }

export async function GET(req: Request, context: RouteContext) {
  const user = await getRequestUser(req.headers)
  if (!user?.institutionId) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
  }

  const { id } = await context.params
  const item = await getResourceById(id, user.id)
  if (!item) {
    return new Response(JSON.stringify({ error: 'Resource not found' }), { status: 404 })
  }

  if (item.institutionId !== user.institutionId && !['admin', 'moderator'].includes(user.role)) {
    return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403 })
  }

  if (item.status !== 'approved' && item.userId !== user.id && !['admin', 'moderator'].includes(user.role)) {
    return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403 })
  }

  await db
    .update(resource)
    .set({ viewCount: sql`${resource.viewCount} + 1` })
    .where(eq(resource.id, id))

  const sourceRows = await db.select().from(resource).where(eq(resource.id, id)).limit(1)
  const related = sourceRows[0]
    ? await getRelatedResources(user.institutionId, sourceRows[0])
    : []

  return new Response(JSON.stringify({ ...item, viewCount: item.viewCount + 1, related }), {
    status: 200,
  })
}
