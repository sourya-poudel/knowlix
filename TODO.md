# Knowlix Implementation Plan

## Repository audit summary

- App Router Next.js 16 app with Better Auth, Drizzle ORM, PostgreSQL, and Azure Blob storage already wired.
- Marketing, auth, dashboard, and admin pages already exist, but the MVP workflow is only partially enforced end to end.
- Current moderation flow is effectively admin-only and still relies on email checks in a few routes.
- Resource discovery is currently global across all institutions instead of institution-scoped.
- Uploads already persist to Blob + `resource` rows, but validation, role checks, and moderation metadata are incomplete.

## MVP order

1. Lock down authentication and role-based access.
2. Make upload creation institution-aware and validation-safe.
3. Make approved resource discovery institution-scoped.
4. Make moderation accessible to moderators, not just the hard-coded admin email.
5. Add route protection and loading/error states for the core student and moderator surfaces.
6. Verify the student upload -> pending -> approval -> published -> discovery flow.

## Execution checklist

- [x] Audit current routes, schema, auth, storage, and UI surfaces.
- [x] Replace hard-coded admin-email checks with role-based authorization helpers.
- [x] Add shared auth/role utilities for server routes and pages.
- [x] Harden the upload API so only verified institutional users can upload into their own institution.
- [x] Scope public discovery to the signed-in user's institution.
- [x] Expose moderation workflow to moderator/admin users through protected routes.
- [x] Refresh the visual system across landing, auth, dashboard, and admin surfaces.
- [ ] Add better loading and error states to upload and moderation UI.
- [x] Run typecheck and fix any regressions introduced by the changes.
- [ ] Run lint once eslint is available in the environment.

## Notes

- Preserve the existing design system and component library.
- Reuse the current schema, Better Auth setup, Drizzle ORM, and Blob integration.
- Avoid replacing working implementations unless they block the MVP path.
- TypeScript compile check passed with `npm exec tsc --noEmit`.
- `npm run lint` could not run in this shell because `eslint` is not on PATH.