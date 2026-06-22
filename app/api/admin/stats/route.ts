import { db } from '@/lib/db'
import { auditLog, bookmark, comment, institution, resource, session, user as userTable } from '@/lib/db/schema'
import { gte, sql } from 'drizzle-orm'
import { headers } from 'next/headers'
import { getRequestUser } from '@/lib/session'

export async function GET() {
  try {
    const user = await getRequestUser(await headers())
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!['moderator', 'admin'].includes(user.role)) {
      return Response.json({ error: 'Forbidden' }, { status: 403 })
    }

    const allResources = await db.select().from(resource)
    const allInstitutions = await db.select().from(institution)
    const allUsers = await db.select().from(userTable)

    const pending = allResources.filter((item) => item.status === 'pending').length
    const approved = allResources.filter((item) => item.status === 'approved').length
    const rejected = allResources.filter((item) => item.status === 'rejected').length

    const today = new Date()
    const sevenDaysAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)

    const activeUsers = await db
      .select({ count: sql<number>`count(distinct ${session.userId})::int` })
      .from(session)
      .where(gte(session.updatedAt, sql`now() - interval '7 days'`))

    const bookmarkCount = await db.select({ count: sql<number>`count(*)::int` }).from(bookmark)
    const commentCount = await db.select({ count: sql<number>`count(*)::int` }).from(comment)
    const moderationEvents = await db.select({ count: sql<number>`count(*)::int` }).from(auditLog)

    const statusChart = [
      { name: 'Pending', value: pending },
      { name: 'Approved', value: approved },
      { name: 'Rejected', value: rejected },
    ]

    const uploadsByDate: Record<string, number> = {}
    for (let index = 0; index < 7; index++) {
      const date = new Date(sevenDaysAgo.getTime() + index * 24 * 60 * 60 * 1000)
      const dateKey = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      uploadsByDate[dateKey] = 0
    }

    allResources.forEach((item) => {
      const createdAt = new Date(item.createdAt)
      if (createdAt >= sevenDaysAgo) {
        const dateKey = createdAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        uploadsByDate[dateKey] = (uploadsByDate[dateKey] ?? 0) + 1
      }
    })

    const trendsChart = Object.entries(uploadsByDate).map(([date, uploads]) => ({
      date,
      uploads,
    }))

    const approvedInstitutions = allInstitutions.filter((item) => item.isApproved && item.isActive).length
    const inactiveInstitutions = allInstitutions.filter((item) => !item.isActive).length
    const recentlyUpdatedInstitutions = allInstitutions.filter((item) => {
      const updatedAt = item.settingsUpdatedAt ?? item.createdAt
      return updatedAt >= sevenDaysAgo
    }).length

    return Response.json({
      total: allResources.length,
      pending,
      approved,
      rejected,
      totalUsers: allUsers.length,
      activeUsers: activeUsers[0]?.count ?? 0,
      totalInstitutions: allInstitutions.length,
      approvedInstitutions,
      inactiveInstitutions,
      recentlyUpdatedInstitutions,
      bookmarkCount: bookmarkCount[0]?.count ?? 0,
      commentCount: commentCount[0]?.count ?? 0,
      approvedResources: approved,
      downloadCount: allResources.reduce((sum, item) => sum + item.downloadCount, 0),
      moderationEvents: moderationEvents[0]?.count ?? 0,
      statusChart,
      trendsChart,
    })
  } catch (error) {
    console.error('Stats error:', error)
    return Response.json({ error: 'Failed to fetch stats' }, { status: 500 })
  }
}