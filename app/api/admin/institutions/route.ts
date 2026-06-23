import { and, desc, eq, ilike, inArray, or, sql } from 'drizzle-orm'
import { db } from '@/lib/db'
import { institution, resource, user as userTable } from '@/lib/db/schema'
import { getRequestUser } from '@/lib/session'
import { recordAuditLog } from '@/lib/admin-audit'

export async function GET(req: Request) {
  const currentUser = await getRequestUser(req.headers)
  if (!currentUser) return Response.json({ error: 'Unauthorized' }, { status: 401 })
  if (!['admin', 'moderator'].includes(currentUser.role)) {
  return Response.json({ error: 'Forbidden' }, { status: 403 })
}

  const url = new URL(req.url)
  const query = url.searchParams.get('q')?.trim()
  const status = url.searchParams.get('status')

  const conditions = []
  if (query) {
    const pattern = `%${query}%`
    conditions.push(
      or(ilike(institution.name, pattern), ilike(institution.slug, pattern), ilike(institution.domain, pattern))!,
    )
  }
  if (status === 'active') conditions.push(eq(institution.isActive, true))
  if (status === 'inactive') conditions.push(eq(institution.isActive, false))
  if (status === 'approved') conditions.push(eq(institution.isApproved, true))
  if (status === 'pending') conditions.push(eq(institution.isApproved, false))

  const rows = await db
    .select()
    .from(institution)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(desc(institution.createdAt))

  const institutionIds = rows.map((row) => row.id)
  const memberCounts = institutionIds.length
    ? await db
        .select({ institutionId: userTable.institutionId, count: sql<number>`count(*)::int` })
        .from(userTable)
        .where(inArray(userTable.institutionId, institutionIds))
        .groupBy(userTable.institutionId)
    : []
  const resourceCounts = institutionIds.length
    ? await db
        .select({ institutionId: resource.institutionId, count: sql<number>`count(*)::int` })
        .from(resource)
        .where(inArray(resource.institutionId, institutionIds))
        .groupBy(resource.institutionId)
    : []

  const memberMap = new Map(memberCounts.map((row) => [row.institutionId, row.count]))
  const resourceMap = new Map(resourceCounts.map((row) => [row.institutionId, row.count]))

  return Response.json(
    rows.map((row) => ({
      ...row,
      createdAt: row.createdAt.toISOString(),
      approvedAt: row.approvedAt?.toISOString() ?? null,
      disabledAt: row.disabledAt?.toISOString() ?? null,
      settingsUpdatedAt: row.settingsUpdatedAt?.toISOString() ?? null,
      memberCount: memberMap.get(row.id) ?? row.memberCount,
      resourceCount: resourceMap.get(row.id) ?? row.resourceCount,
    })),
  )
}

export async function POST(req: Request) {
  const currentUser = await getRequestUser(req.headers)
  if (!currentUser) return Response.json({ error: 'Unauthorized' }, { status: 401 })
  if (!['admin', 'moderator'].includes(currentUser.role)) {
  return Response.json({ error: 'Forbidden' }, { status: 403 })
}

  const body = await req.json().catch(() => ({}))
  const name = String(body.name ?? '').trim()
  const slug = String(body.slug ?? '').trim()
  const domain = String(body.domain ?? '').trim()
  const description = body.description ? String(body.description).trim() : null
  const logo = body.logo ? String(body.logo).trim() : null
  const bannerImage = body.bannerImage ? String(body.bannerImage).trim() : null
  const domainRestrictions = Array.isArray(body.domainRestrictions)
    ? body.domainRestrictions.map(String).filter(Boolean)
    : domain
      ? [domain]
      : []

  if (!name || !slug || !domain) {
    return Response.json({ error: 'name, slug, and domain are required' }, { status: 400 })
  }

  const id = crypto.randomUUID()
  await db.insert(institution).values({
    id,
    name,
    slug,
    domain,
    description,
    logo,
    bannerImage,
    domainRestrictions,
    isApproved: false,
    isActive: true,
  })

  await recordAuditLog({
    actorId: currentUser.id,
    actorRole: currentUser.role,
    action: 'institution_created',
    entityType: 'institution',
    entityId: id,
    targetInstitutionId: id,
    metadata: { name, slug, domain },
  })

  return Response.json({ success: true, id }, { status: 201 })
}