export type AppRole = 'student' | 'moderator' | 'admin'

const ROLE_RANK: Record<AppRole, number> = {
  student: 0,
  moderator: 1,
  admin: 2,
}

export function normalizeRole(role: string | null | undefined): AppRole {
  if (role === 'admin' || role === 'moderator' || role === 'student') {
    return role
  }

  return 'student'
}

export function hasRoleAccess(
  userRole: string | null | undefined,
  allowedRoles: AppRole[],
): boolean {
  const normalizedRole = normalizeRole(userRole)
  return allowedRoles.some(
    (allowedRole) => ROLE_RANK[normalizedRole] >= ROLE_RANK[allowedRole],
  )
}