-- Phase 3 schema migration for admin, institutions, and audit logging.

ALTER TABLE "user" ADD COLUMN IF NOT EXISTS "status" text NOT NULL DEFAULT 'active';
ALTER TABLE "user" ADD COLUMN IF NOT EXISTS "suspendedReason" text;
ALTER TABLE "user" ADD COLUMN IF NOT EXISTS "suspendedAt" timestamp;
ALTER TABLE "user" ADD COLUMN IF NOT EXISTS "suspendedBy" text;

ALTER TABLE institution ADD COLUMN IF NOT EXISTS "description" text;
ALTER TABLE institution ADD COLUMN IF NOT EXISTS "bannerImage" text;
ALTER TABLE institution ADD COLUMN IF NOT EXISTS "domainRestrictions" text[] NOT NULL DEFAULT '{}';
ALTER TABLE institution ADD COLUMN IF NOT EXISTS "isApproved" boolean NOT NULL DEFAULT false;
ALTER TABLE institution ADD COLUMN IF NOT EXISTS "isActive" boolean NOT NULL DEFAULT true;
ALTER TABLE institution ADD COLUMN IF NOT EXISTS "approvedBy" text;
ALTER TABLE institution ADD COLUMN IF NOT EXISTS "approvedAt" timestamp;
ALTER TABLE institution ADD COLUMN IF NOT EXISTS "disabledAt" timestamp;
ALTER TABLE institution ADD COLUMN IF NOT EXISTS "settingsUpdatedAt" timestamp;

CREATE TABLE IF NOT EXISTS audit_log (
  id text PRIMARY KEY,
  "actorId" text NOT NULL,
  "actorRole" text NOT NULL,
  action text NOT NULL,
  "entityType" text NOT NULL,
  "entityId" text,
  "targetInstitutionId" text,
  metadata jsonb,
  "createdAt" timestamp NOT NULL DEFAULT now()
);