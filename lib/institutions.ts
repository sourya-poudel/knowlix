// ---------------------------------------------------------------------------
// Institution directory used by the signup flow.
//
// These records intentionally mirror the columns of the `institution` table in
// `lib/db/schema.ts` (id, name, slug, domain). They act as seed/mock data so
// the signup form can validate that a user's email matches their institution's
// domain TODAY, and can be swapped for a real database query later without
// changing any of the form logic.
//
// To connect the real backend, replace `INSTITUTIONS` with the result of a
// server query against the `institution` table and keep the same shape.
// ---------------------------------------------------------------------------

export type Institution = {
  id: string
  name: string
  slug: string
  /** Email domain students must use to verify membership, e.g. "student.ankuram.edu.np" */
  domain: string
}

export const INSTITUTIONS: Institution[] = [
  {
    id: 'inst_ankuram',
    name: 'Ankuram Academy',
    slug: 'ankuram-academy',
    domain: 'student.ankuram.edu.np',
  },
  {
    id: 'inst_divya',
    name: 'Divya Academy',
    slug: 'divya-academy',
    domain: 'student.divya.edu.np',
  },
]

export function getInstitution(id: string): Institution | undefined {
  return INSTITUTIONS.find((i) => i.id === id)
}

/** Returns the domain portion of an email address, lowercased. */
export function emailDomain(email: string): string {
  const at = email.lastIndexOf('@')
  return at === -1 ? '' : email.slice(at + 1).trim().toLowerCase()
}

/** True when the email's domain matches (or is a subdomain of) the institution domain. */
export function emailMatchesInstitution(email: string, institution: Institution): boolean {
  const domain = emailDomain(email)
  if (!domain) return false
  return domain === institution.domain || domain.endsWith(`.${institution.domain}`)
}
