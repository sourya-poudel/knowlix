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

export async function DELETE(req: Request) {
  const session = await auth.api.getSession({ headers: req.headers })
  if (!session?.user) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })

  const body = await req.json()
  await db.delete(bookmarkTable).where(bookmarkTable.resourceId.eq(body.resourceId).and(bookmarkTable.userId.eq(session.user.id)))
  return new Response(JSON.stringify({ success: true }), { status: 200 })
}
