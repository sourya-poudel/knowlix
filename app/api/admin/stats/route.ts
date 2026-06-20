import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { resource } from '@/lib/db/schema'
import { user as userTable } from '@/lib/db/schema'
import { eq, sql } from 'drizzle-orm'
import { headers } from 'next/headers'

export async function GET() {
  try {
    const session = await auth.api.getSession({ headers: await headers() })

    if (!session?.user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const appUser = await db
      .select()
      .from(userTable)
      .where(eq(userTable.id, session.user.id))
      .limit(1)

    if (!appUser[0] || appUser[0].role !== 'admin') {
      return Response.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Get counts by status
    const allResources = await db.select().from(resource)

    const pending = allResources.filter((r) => r.status === 'pending').length
    const approved = allResources.filter((r) => r.status === 'approved').length
    const rejected = allResources.filter((r) => r.status === 'rejected').length

    // Chart data for status distribution
    const statusChart = [
      { name: 'Pending', value: pending },
      { name: 'Approved', value: approved },
      { name: 'Rejected', value: rejected },
    ]

    // Get uploads by date for last 7 days
    const today = new Date()
    const sevenDaysAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)

    const uploadsByDate: Record<string, number> = {}
    for (let i = 0; i < 7; i++) {
      const date = new Date(sevenDaysAgo.getTime() + i * 24 * 60 * 60 * 1000)
      const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      uploadsByDate[dateStr] = 0
    }

    allResources.forEach((res) => {
      const date = new Date(res.createdAt)
      if (date >= sevenDaysAgo) {
        const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        uploadsByDate[dateStr]++
      }
    })

    const trendsChart = Object.entries(uploadsByDate).map(([date, count]) => ({
      date,
      uploads: count,
    }))

    const stats = {
      total: allResources.length,
      pending,
      approved,
      rejected,
      totalUsers: (await db.select().from(userTable)).length,
      statusChart,
      trendsChart,
    }

    return Response.json(stats)
  } catch (error) {
    console.error('Stats error:', error)
    return Response.json({ error: 'Failed to fetch stats' }, { status: 500 })
  }
}
