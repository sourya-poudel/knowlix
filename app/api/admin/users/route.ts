import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { resource, user as userTable } from '@/lib/db/schema'
import { eq, sql } from 'drizzle-orm'
import { headers } from 'next/headers'
import { getRequestUser } from '@/lib/session'

export async function GET() {
  try {
    const user = await getRequestUser(await headers())

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (user.role !== 'admin') {
      return Response.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Get all users with their stats
    const users = await db
      .select({
        id: userTable.id,
        name: userTable.name,
        email: userTable.email,
        role: userTable.role,
        bio: userTable.bio,
        reputation: userTable.reputation,
        createdAt: userTable.createdAt,
      })
      .from(userTable)

    // Get upload count per user
    const uploadCounts = await db
      .select({
        userId: resource.userId,
        uploadCount: sql<number>`COUNT(*)`.mapWith(Number),
      })
      .from(resource)
      .groupBy(resource.userId)

    const uploadMap = new Map(uploadCounts.map((r) => [r.userId, r.uploadCount]))

    const usersWithStats = users.map((u) => ({
      ...u,
      uploadCount: uploadMap.get(u.id) || 0,
    }))

    return Response.json(usersWithStats)
  } catch (error) {
    console.error('Users error:', error)
    return Response.json({ error: 'Failed to fetch users' }, { status: 500 })
  }
}
