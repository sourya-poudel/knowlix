import { db } from '@/lib/db'
import { auditLog } from '@/lib/db/schema'

export async function recordAuditLog(input: {
  actorId: string
  actorRole: string
  action: string
  entityType: string
  entityId?: string | null
  targetInstitutionId?: string | null
  metadata?: Record<string, unknown> | null
}) {
  await db.insert(auditLog).values({
    id: crypto.randomUUID(),
    actorId: input.actorId,
    actorRole: input.actorRole,
    action: input.action,
    entityType: input.entityType,
    entityId: input.entityId ?? null,
    targetInstitutionId: input.targetInstitutionId ?? null,
    metadata: input.metadata ?? null,
  })
}