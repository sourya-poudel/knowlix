import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { notification } from '@/lib/db/schema'
import { eq, inArray, desc, and } from 'drizzle-orm'
import { headers } from 'next/headers'
import { getRequestUser } from '@/lib/session'

export async function GET(req: Request) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })

  const rows = await db
    .select()
    .from(notification)
    .where(eq(notification.userId, session.user.id))
    .orderBy(desc(notification.createdAt))

  return new Response(
    JSON.stringify(rows.map((row) => ({ ...row, createdAt: row.createdAt.toISOString() }))),
    { status: 200 },
  )
}

export async function POST(req: Request) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })

  const body = await req.json().catch(() => ({}))
  const userId = String(body.userId ?? session.user.id)
  const title = String(body.title ?? '')
  const type = String(body.type ?? 'info')
  const message = String(body.body ?? '')
  const linkUrl = body.linkUrl ? String(body.linkUrl) : null

  if (!title) {
    return new Response(JSON.stringify({ error: 'title is required' }), { status: 400 })
  }

  await db.insert(notification).values({
    id: crypto.randomUUID(),
    userId,
    type,
    title,
    body: message,
    linkUrl,
    isRead: false,
  })

  return new Response(JSON.stringify({ success: true }), { status: 201 })
}

export async function PATCH(req: Request) {
  const user = await getRequestUser(req.headers)
  if (!user) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })

  const body = await req.json().catch(() => ({}))
  const ids = Array.isArray(body.ids) ? body.ids.map(String) : null

  if (ids && ids.length > 0) {
    await db
      .update(notification)
      .set({ isRead: true })
      .where(and(eq(notification.userId, user.id), inArray(notification.id, ids)))
  } else {
    await db
      .update(notification)
      .set({ isRead: true })
      .where(eq(notification.userId, user.id))
  }

  return new Response(JSON.stringify({ success: true }), { status: 200 })
}
