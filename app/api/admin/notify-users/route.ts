import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { user, notification } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export async function POST(req: Request) {
  const session = await auth.api.getSession({ headers: req.headers })
  if (!session?.user || session.user.email?.toLowerCase() !== 'admin@sourya.com') {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
  }

  const body = await req.json().catch(() => ({}))
  const message = String(body.message ?? '')
  const linkUrl = body.linkUrl ? String(body.linkUrl) : null

  if (!message) {
    return new Response(JSON.stringify({ error: 'message is required' }), { status: 400 })
  }

  const users = await db.select().from(user).where(eq(user.role, 'student'))
  await Promise.all(
    users.map((u) =>
      db.insert(notification).values({
        id: crypto.randomUUID(),
        userId: u.id,
        type: 'info',
        title: 'Admin announcement',
        body: message,
        linkUrl,
        isRead: false,
      }),
    ),
  )

  return new Response(JSON.stringify({ success: true }), { status: 200 })
}
