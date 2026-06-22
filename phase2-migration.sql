-- Phase 2 schema migration for existing Knowlix databases.
-- Run against your PostgreSQL instance after backing up.

ALTER TABLE resource ADD COLUMN IF NOT EXISTS "ratingAvg" real NOT NULL DEFAULT 0;
ALTER TABLE resource ADD COLUMN IF NOT EXISTS "ratingCount" integer NOT NULL DEFAULT 0;

CREATE TABLE IF NOT EXISTS rating (
  id text PRIMARY KEY,
  "resourceId" text NOT NULL,
  "userId" text NOT NULL,
  value integer NOT NULL,
  "createdAt" timestamp NOT NULL DEFAULT now(),
  "updatedAt" timestamp NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS rating_resource_user_idx ON rating ("resourceId", "userId");

ALTER TABLE comment ADD COLUMN IF NOT EXISTS "parentId" text;
ALTER TABLE comment ADD COLUMN IF NOT EXISTS "isDeleted" boolean NOT NULL DEFAULT false;
ALTER TABLE comment ADD COLUMN IF NOT EXISTS "isHidden" boolean NOT NULL DEFAULT false;
ALTER TABLE comment ADD COLUMN IF NOT EXISTS "helpfulCount" integer NOT NULL DEFAULT 0;
ALTER TABLE comment ADD COLUMN IF NOT EXISTS "updatedAt" timestamp NOT NULL DEFAULT now();
