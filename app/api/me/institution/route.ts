import { getUserId } from '@/lib/session'
import { db } from '@/lib/db'
import { user as userTable } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export async function PATCH(req: Request) {
  try {
    const userId = await getUserId()
    const body = await req.json().catch(() => ({}))
    const institutionId = String(body.institutionId ?? '').trim()

    if (!institutionId) {
      return Response.json({ error: 'institutionId is required' }, { status: 400 })
    }

    await db
      .update(userTable)
      .set({ institutionId, updatedAt: new Date() })
      .where(eq(userTable.id, userId))

    return Response.json({ success: true, institutionId })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unauthorized'
    if (message === 'Unauthorized') {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }
    throw error
  }
}
