import { eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { institution } from '@/lib/db/schema'
import { getRequestUser } from '@/lib/session'
import { recordAuditLog } from '@/lib/admin-audit'

type RouteContext = { params: Promise<{ id: string }> }

export async function PATCH(req: Request, context: RouteContext) {
  const currentUser = await getRequestUser(req.headers)
  if (!currentUser) return Response.json({ error: 'Unauthorized' }, { status: 401 })
  if (currentUser.role !== 'admin') return Response.json({ error: 'Forbidden' }, { status: 403 })

  const { id } = await context.params
  const rows = await db.select().from(institution).where(eq(institution.id, id)).limit(1)
  const existing = rows[0]
  if (!existing) return Response.json({ error: 'Institution not found' }, { status: 404 })

  const body = await req.json().catch(() => ({}))
  const action = String(body.action ?? 'update')

  if (action === 'approve') {
    await db
      .update(institution)
      .set({
        isApproved: true,
        isActive: true,
        approvedBy: currentUser.id,
        approvedAt: new Date(),
        settingsUpdatedAt: new Date(),
      })
      .where(eq(institution.id, id))

    await recordAuditLog({
      actorId: currentUser.id,
      actorRole: currentUser.role,
      action: 'institution_approved',
      entityType: 'institution',
      entityId: id,
      targetInstitutionId: id,
    })

    return Response.json({ success: true })
  }

  if (action === 'disable') {
    await db
      .update(institution)
      .set({
        isActive: false,
        disabledAt: new Date(),
        settingsUpdatedAt: new Date(),
      })
      .where(eq(institution.id, id))

    await recordAuditLog({
      actorId: currentUser.id,
      actorRole: currentUser.role,
      action: 'institution_disabled',
      entityType: 'institution',
      entityId: id,
      targetInstitutionId: id,
    })

    return Response.json({ success: true })
  }

  if (action === 'enable') {
    await db
      .update(institution)
      .set({
        isActive: true,
        disabledAt: null,
        settingsUpdatedAt: new Date(),
      })
      .where(eq(institution.id, id))

    await recordAuditLog({
      actorId: currentUser.id,
      actorRole: currentUser.role,
      action: 'institution_enabled',
      entityType: 'institution',
      entityId: id,
      targetInstitutionId: id,
    })

    return Response.json({ success: true })
  }

  const name = body.name !== undefined ? String(body.name).trim() : existing.name
  const slug = body.slug !== undefined ? String(body.slug).trim() : existing.slug
  const domain = body.domain !== undefined ? String(body.domain).trim() : existing.domain
  const description = body.description !== undefined ? String(body.description).trim() : existing.description
  const logo = body.logo !== undefined ? String(body.logo).trim() : existing.logo
  const bannerImage = body.bannerImage !== undefined ? String(body.bannerImage).trim() : existing.bannerImage
  const domainRestrictions = Array.isArray(body.domainRestrictions)
    ? body.domainRestrictions.map(String).filter(Boolean)
    : existing.domainRestrictions

  await db
    .update(institution)
    .set({
      name,
      slug,
      domain,
      description,
      logo,
      bannerImage,
      domainRestrictions,
      settingsUpdatedAt: new Date(),
    })
    .where(eq(institution.id, id))

  await recordAuditLog({
    actorId: currentUser.id,
    actorRole: currentUser.role,
    action: 'institution_updated',
    entityType: 'institution',
    entityId: id,
    targetInstitutionId: id,
    metadata: { name, slug, domain },
  })

  return Response.json({ success: true })
}