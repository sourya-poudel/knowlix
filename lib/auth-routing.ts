import type { AppRole } from '@/lib/access'

export function getPostAuthPath(role: string | null | undefined): string {
  if (role === 'admin') return '/admin'
  if (role === 'moderator') return '/moderator'
  return '/dashboard'
}

export function normalizeAuthRole(role: string | null | undefined): AppRole {
  if (role === 'admin' || role === 'moderator' || role === 'student') {
    return role
  }
  return 'student'
}
