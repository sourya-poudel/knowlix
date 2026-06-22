import { user as userTable } from '@/lib/db/schema'

export const legacyUserColumns = {
  id: userTable.id,
  name: userTable.name,
  email: userTable.email,
  emailVerified: userTable.emailVerified,
  image: userTable.image,
  institutionId: userTable.institutionId,
  role: userTable.role,
  bio: userTable.bio,
  reputation: userTable.reputation,
  createdAt: userTable.createdAt,
  updatedAt: userTable.updatedAt,
} as const

export type LegacyUserRow = {
  id: string
  name: string
  email: string
  emailVerified: boolean
  image: string | null
  institutionId: string | null
  role: string
  bio: string | null
  reputation: number
  createdAt: Date
  updatedAt: Date
}