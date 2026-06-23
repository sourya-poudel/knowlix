import { db } from '@/lib/db'
import { auditLog, comment, resource, session, user as userTable } from '@/lib/db/schema'
import { and, desc, eq, ilike, inArray, or, sql } from 'drizzle-orm'
import { getRequestUser } from '@/lib/session'
import { legacyUserColumns } from '@/lib/user-compat'
import { recordAuditLog } from '@/lib/admin-audit'

export async function GET(req: Request) {
  const currentUser = await getRequestUser(req.headers)
  if (!currentUser) return Response.json({ error: 'Unauthorized' }, { status: 401 })
  if (currentUser.role !== 'admin') return Response.json({ error: 'Forbidden' }, { status: 403 })

  const url = new URL(req.url)
  const query = url.searchParams.get('q')?.trim()
  const role = url.searchParams.get('role')
  const status = url.searchParams.get('status')

  const conditions = []
  if (query) {
    const pattern = `%${query}%`
    conditions.push(or(ilike(userTable.name, pattern), ilike(userTable.email, pattern))!)
  }
  if (role) conditions.push(eq(userTable.role, role))

  const modernConditions = [...conditions]
  if (status && status !== 'active') {
    return Response.json([])
  }
  if (status === 'active') {
    modernConditions.push(sql`true`)
  }

  let users
  try {
    users = await db
      .select({
        id: userTable.id,
        name: userTable.name,
        email: userTable.email,
        role: userTable.role,
        status: userTable.status,
        bio: userTable.bio,
        reputation: userTable.reputation,
        institutionId: userTable.institutionId,
        createdAt: userTable.createdAt,
        suspendedReason: userTable.suspendedReason,
        suspendedAt: userTable.suspendedAt,
      })
      .from(userTable)
      .where(modernConditions.length > 0 ? and(...modernConditions) : undefined)
      .orderBy(desc(userTable.createdAt))
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    if (!message.includes('does not exist')) {
      throw error
    }

    const legacyUsers = await db
      .select(legacyUserColumns)
      .from(userTable)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(userTable.createdAt))

    users = legacyUsers.map((user) => ({
      ...user,
      status: 'active',
      suspendedReason: null,
      suspendedAt: null,
    }))
  }

  const uploadCounts = await db
    .select({ userId: resource.userId, uploadCount: sql<number>`count(*)::int` })
    .from(resource)
    .groupBy(resource.userId)
  const commentCounts = await db
    .select({ userId: comment.userId, commentCount: sql<number>`count(*)::int` })
    .from(comment)
    .groupBy(comment.userId)
  const lastSessions = await db
    .select({ userId: session.userId, lastActiveAt: sql<Date>`max(${session.updatedAt})` })
    .from(session)
    .groupBy(session.userId)

  const uploadMap = new Map(uploadCounts.map((row) => [row.userId, row.uploadCount]))
  const commentMap = new Map(commentCounts.map((row) => [row.userId, row.commentCount]))
  const sessionMap = new Map(lastSessions.map((row) => [row.userId, row.lastActiveAt]))

  return Response.json(
    users.map((u) => ({
      ...u,
      uploadCount: uploadMap.get(u.id) ?? 0,
      commentCount: commentMap.get(u.id) ?? 0,
      lastActiveAt: sessionMap.get(u.id) ?? null,
    })),
  )
}

export async function PATCH(req: Request) {
  const currentUser = await getRequestUser(req.headers)
  if (!currentUser) return Response.json({ error: 'Unauthorized' }, { status: 401 })
  if (currentUser.role !== 'admin') return Response.json({ error: 'Forbidden' }, { status: 403 })

  const body = await req.json().catch(() => ({}))
  const userId = String(body.userId ?? '')
  const action = String(body.action ?? '')
  const reason = body.reason ? String(body.reason) : null
  const institutionId = body.institutionId ? String(body.institutionId) : null

  if (!userId || !action) {
    return Response.json({ error: 'userId and action are required' }, { status: 400 })
  }

  const targetRows = await db.select(legacyUserColumns).from(userTable).where(eq(userTable.id, userId)).limit(1)
  const target = targetRows[0]
  if (!target) {
    return Response.json({ error: 'User not found' }, { status: 404 })
  }

  if (target.id === currentUser.id) {
    return Response.json({ error: 'You cannot manage your own account from here' }, { status: 400 })
  }

  if (action === 'promoteAdmin') {
    await db
      .update(userTable)
      .set({ role: 'admin', updatedAt: new Date() })
      .where(eq(userTable.id, userId))
    await recordAuditLog({
      actorId: currentUser.id,
      actorRole: currentUser.role,
      action: 'admin_promoted',
      entityType: 'user',
      entityId: userId,
      targetInstitutionId: target.institutionId,
    })
    return Response.json({ success: true })
  }

  if (action === 'removeAdmin') {
    await db
      .update(userTable)
      .set({ role: 'student', updatedAt: new Date() })
      .where(eq(userTable.id, userId))
    await recordAuditLog({
      actorId: currentUser.id,
      actorRole: currentUser.role,
      action: 'admin_removed',
      entityType: 'user',
      entityId: userId,
      targetInstitutionId: target.institutionId,
    })
    return Response.json({ success: true })
  }

  if (action === 'promoteModerator' || action === 'assignModerator') {
    await db
      .update(userTable)
      .set({
        role: 'moderator',
        institutionId: institutionId ?? target.institutionId,
        updatedAt: new Date(),
      })
      .where(eq(userTable.id, userId))
    await recordAuditLog({
      actorId: currentUser.id,
      actorRole: currentUser.role,
      action: 'moderator_promoted',
      entityType: 'user',
      entityId: userId,
      targetInstitutionId: institutionId ?? target.institutionId ?? undefined,
    })
    return Response.json({ success: true })
  }

  if (action === 'removeModerator') {
    await db
      .update(userTable)
      .set({ role: 'student', updatedAt: new Date() })
      .where(eq(userTable.id, userId))
    await recordAuditLog({
      actorId: currentUser.id,
      actorRole: currentUser.role,
      action: 'moderator_removed',
      entityType: 'user',
      entityId: userId,
      targetInstitutionId: target.institutionId,
    })
    return Response.json({ success: true })
  }

  if (action === 'suspend') {
    try {
      await db
        .update(userTable)
        .set({
          status: 'suspended',
          suspendedReason: reason,
          suspendedAt: new Date(),
          suspendedBy: currentUser.id,
          updatedAt: new Date(),
        })
        .where(eq(userTable.id, userId))
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      if (message.includes('does not exist')) {
        return Response.json(
          { error: 'User suspension requires the Phase 3 database migration' },
          { status: 409 },
        )
      }
      throw error
    }
    await recordAuditLog({
      actorId: currentUser.id,
      actorRole: currentUser.role,
      action: 'user_suspended',
      entityType: 'user',
      entityId: userId,
      targetInstitutionId: target.institutionId,
      metadata: { reason },
    })
    return Response.json({ success: true })
  }

  if (action === 'reinstate') {
    try {
      await db
        .update(userTable)
        .set({
          status: 'active',
          suspendedReason: null,
          suspendedAt: null,
          suspendedBy: null,
          updatedAt: new Date(),
        })
        .where(eq(userTable.id, userId))
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      if (message.includes('does not exist')) {
        return Response.json(
          { error: 'User reinstatement requires the Phase 3 database migration' },
          { status: 409 },
        )
      }
      throw error
    }
    await recordAuditLog({
      actorId: currentUser.id,
      actorRole: currentUser.role,
      action: 'user_reinstated',
      entityType: 'user',
      entityId: userId,
      targetInstitutionId: target.institutionId,
    })
    return Response.json({ success: true })
  }

  return Response.json({ error: 'Invalid action' }, { status: 400 })
}
