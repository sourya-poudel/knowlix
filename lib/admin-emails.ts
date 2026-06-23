function parseEmailList(raw: string | undefined): string[] {
  if (!raw?.trim()) return []
  return raw
    .split(',')
    .map((entry) => entry.trim().toLowerCase())
    .filter(Boolean)
}

/** Server-side admin allowlist from env. */
export function getAdminEmails(): string[] {
  return [
    ...new Set([
      ...parseEmailList(process.env.ADMIN_EMAILS),
      ...parseEmailList(process.env.NEXT_PUBLIC_ADMIN_EMAILS),
      ...(process.env.ADMIN_BOOTSTRAP_EMAIL
        ? [process.env.ADMIN_BOOTSTRAP_EMAIL.trim().toLowerCase()]
        : []),
      ...(process.env.NEXT_PUBLIC_ADMIN_BOOTSTRAP_EMAIL
        ? [process.env.NEXT_PUBLIC_ADMIN_BOOTSTRAP_EMAIL.trim().toLowerCase()]
        : []),
    ]),
  ]
}

/** Client-safe admin allowlist (public env vars only). */
export function getPublicAdminEmails(): string[] {
  return [
    ...new Set([
      ...parseEmailList(process.env.NEXT_PUBLIC_ADMIN_EMAILS),
      ...(process.env.NEXT_PUBLIC_ADMIN_BOOTSTRAP_EMAIL
        ? [process.env.NEXT_PUBLIC_ADMIN_BOOTSTRAP_EMAIL.trim().toLowerCase()]
        : []),
    ]),
  ]
}

export function isAdminEmail(email: string): boolean {
  const normalized = email.trim().toLowerCase()
  return getAdminEmails().includes(normalized)
}

export function isPublicAdminEmail(email: string): boolean {
  const normalized = email.trim().toLowerCase()
  return getPublicAdminEmails().includes(normalized)
}
