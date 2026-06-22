import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { resource } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { getRequestUser } from '@/lib/session'
import { createNotification } from '@/lib/notifications'
import { awardReputation, REPUTATION_POINTS } from '@/lib/reputation'
import { recordAuditLog } from '@/lib/admin-audit'

export async function POST(req: Request) {
  const user = await getRequestUser(req.headers)
  if (!user) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })

  if (!['moderator', 'admin'].includes(user.role)) {
    return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403 })
  }

  const body = await req.json().catch(() => ({}))
  const resourceId = String(body.resourceId ?? '')
  const status = body.status === 'approved' ? 'approved' : 'rejected'
  const rejectionReason = body.rejectionReason ? String(body.rejectionReason) : null

  if (!resourceId) {
    return new Response(JSON.stringify({ error: 'resourceId is required' }), { status: 400 })
  }

  const resourceRows = await db.select().from(resource).where(eq(resource.id, resourceId)).limit(1)
  const target = resourceRows[0]
  if (!target) {
    return new Response(JSON.stringify({ error: 'Resource not found' }), { status: 404 })
  }

  await db
    .update(resource)
    .set({
      status,
      rejectionReason: status === 'rejected' ? rejectionReason : null,
      moderatedBy: user.id,
      moderatedAt: new Date(),
    })
    .where(eq(resource.id, resourceId))

  await recordAuditLog({
    actorId: user.id,
    actorRole: user.role,
    action: status === 'approved' ? 'resource_approved' : 'resource_rejected',
    entityType: 'resource',
    entityId: resourceId,
    targetInstitutionId: target.institutionId,
    metadata: { rejectionReason },
  })

  if (status === 'approved') {
    await awardReputation(target.userId, REPUTATION_POINTS.uploadApproved)
    await createNotification({
      userId: target.userId,
      type: 'resource_approved',
      title: 'Resource approved',
      body: `"${target.title}" is now live in your campus library.`,
      linkUrl: `/resources/${resourceId}`,
    })
  } else {
    await createNotification({
      userId: target.userId,
      type: 'resource_rejected',
      title: 'Resource needs changes',
      body: rejectionReason
        ? `"${target.title}" was not approved: ${rejectionReason}`
        : `"${target.title}" was not approved. Please review and resubmit.`,
      linkUrl: '/dashboard#uploads',
    })
  }

  return new Response(JSON.stringify({ success: true }), { status: 200 })
}
