import { and, desc, eq, ilike, inArray, or } from 'drizzle-orm'
import { db } from '@/lib/db'
import { auditLog, user as userTable } from '@/lib/db/schema'
import { getRequestUser } from '@/lib/session'

export async function GET(req: Request) {
  const currentUser = await getRequestUser(req.headers)
  if (!currentUser) return Response.json({ error: 'Unauthorized' }, { status: 401 })
  if (currentUser.role !== 'admin') return Response.json({ error: 'Forbidden' }, { status: 403 })

  const url = new URL(req.url)
  const query = url.searchParams.get('q')?.trim()
  const entityType = url.searchParams.get('entityType')?.trim()
  const limit = Number(url.searchParams.get('limit') ?? '50')
  const offset = Number(url.searchParams.get('offset') ?? '0')

  const conditions = []
  if (query) {
    const pattern = `%${query}%`
    conditions.push(or(ilike(auditLog.action, pattern), ilike(auditLog.entityType, pattern))!)
  }
  if (entityType) conditions.push(eq(auditLog.entityType, entityType))

  const rows = await db
    .select({
      id: auditLog.id,
      actorId: auditLog.actorId,
      actorRole: auditLog.actorRole,
      action: auditLog.action,
      entityType: auditLog.entityType,
      entityId: auditLog.entityId,
      targetInstitutionId: auditLog.targetInstitutionId,
      metadata: auditLog.metadata,
      createdAt: auditLog.createdAt,
      actorName: userTable.name,
    })
    .from(auditLog)
    .leftJoin(userTable, eq(auditLog.actorId, userTable.id))
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(desc(auditLog.createdAt))
    .limit(limit)
    .offset(offset)

  return Response.json(
    rows.map((row) => ({
      ...row,
      createdAt: row.createdAt.toISOString(),
    })),
  )
}