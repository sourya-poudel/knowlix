import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { resource } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export async function GET(req: Request) {
  const session = await auth.api.getSession({ headers: req.headers })
  if (!session?.user) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })

  if (session.user.email?.toLowerCase() !== 'admin@sourya.com') {
    return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403 })
  }

  const rows = await db
    .select()
    .from(resource)
    .where(eq(resource.status, 'pending'))
    .orderBy(resource.createdAt)

  return new Response(JSON.stringify(rows), { status: 200 })
}
