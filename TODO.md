# Knowlix Implementation Plan

## Repository audit summary

- App Router Next.js 16 app with Better Auth, Drizzle ORM, PostgreSQL, and Azure Blob storage.
- MVP workflow complete: landing, auth, dashboard, upload, explore, moderation, RBAC.
- Phase 2 extends the platform into a collaborative academic hub.

## Phase 2 checklist

- Phase 2 already includes working APIs and UI for comments, ratings, bookmarks, collections, requests, notifications, profiles, and advanced search.
- Extended bookmarks to emit owner notifications and exposed collection editing on the collection detail route.

## Phase 3 checklist

- Admin foundation now includes resource moderation, institution management, user suspension and role changes, and searchable audit logs.
- Added platform analytics for resources, users, institutions, bookmarks, comments, downloads, and moderation events.
- Added a reload-safe branded splash screen, route loading state, light/dark theme toggle, and a more restrained professional UI pass.
- Next platform steps: email recovery flows, richer notification controls, institution onboarding policies, accessibility pass, SEO polish, and performance hardening.

## Database migration

Run `phase2-migration.sql` against existing databases to add:

- `rating` table
- `resource.ratingAvg` / `resource.ratingCount`
- Extended `comment` columns (`parentId`, moderation fields, timestamps)

Run `phase3-migration.sql` to add:

- User suspension fields
- Institution lifecycle and settings fields
- `audit_log` table for admin activity tracking

## Notes

- Reused existing schema, auth, components, and theme system.
- Extended APIs under `app/api/` without rewriting MVP routes.
- TypeScript compile check: run `npm exec tsc --noEmit`.
