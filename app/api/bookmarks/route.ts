import { eq } from 'drizzle-orm'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { bookmark as bookmarkTable } from '@/lib/db/schema'

export async function POST(req: Request) {
  const session = await auth.api.getSession({ headers: req.headers })
  if (!session?.user) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })

  const body = await req.json()
  const id = crypto.randomUUID()
  await db.insert(bookmarkTable).values({ id, resourceId: body.resourceId, userId: session.user.id })
  return new Response(JSON.stringify({ success: true, id }), { status: 201 })
}

export async function GET(req: Request) {
  const session = await auth.api.getSession({ headers: req.headers })
  if (!session?.user) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })

  const rows = await db
    .select({ resourceId: bookmarkTable.resourceId })
    .from(bookmarkTable)
    .where(eq(bookmarkTable.userId, session.user.id))

  return new Response(JSON.stringify(rows.map((row) => row.resourceId)), { status: 200 })
}

export async function DELETE(req: Request) {
  try {
    const session = await auth.api.getSession({ headers: req.headers })
    if (!session?.user) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })

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
      eq(bookmarkTable.resourceId, resourceId),
      eq(bookmarkTable.userId, session.user.id)
    )

    return new Response(JSON.stringify({ success: true }), { status: 200 })
  } catch (error) {
    console.error('Bookmark DELETE error:', error)
    return new Response(JSON.stringify({ error: 'Internal server error', message: String(error) }), { status: 500 })
  }
}
