import { eq, sql } from 'drizzle-orm'
import { db } from '@/lib/db'
import { user as userTable } from '@/lib/db/schema'

export const REPUTATION_POINTS = {
  uploadApproved: 50,
  highlyRatedResource: 25,
  commentPosted: 5,
  helpfulComment: 10,
  requestFulfilled: 15,
  requestUpvoted: 2,
} as const

export async function awardReputation(userId: string, points: number) {
  if (points <= 0) return
  await db
    .update(userTable)
    .set({
      reputation: sql`${userTable.reputation} + ${points}`,
      updatedAt: new Date(),
    })
    .where(eq(userTable.id, userId))
}

export async function getUserReputation(userId: string) {
  const rows = await db
    .select({ reputation: userTable.reputation })
    .from(userTable)
    .where(eq(userTable.id, userId))
    .limit(1)
  return rows[0]?.reputation ?? 0
}
