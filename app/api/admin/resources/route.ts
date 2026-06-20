import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { resource, user as userTable } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { headers } from 'next/headers'

export async function GET(req: Request) {
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

    const url = new URL(req.url)
    const status = url.searchParams.get('status') || 'pending'
    const limit = parseInt(url.searchParams.get('limit') || '50')
    const offset = parseInt(url.searchParams.get('offset') || '0')

    // Get resources with user info
    const resources = await db
      .select({
        id: resource.id,
        title: resource.title,
        courseCode: resource.courseCode,
        courseName: resource.courseName,
        fileUrl: resource.fileUrl,
        fileName: resource.fileName,
        fileSize: resource.fileSize,
        fileType: resource.fileType,
        status: resource.status,
        createdAt: resource.createdAt,
        userId: resource.userId,
        userName: userTable.name,
      })
      .from(resource)
      .innerJoin(userTable, eq(resource.userId, userTable.id))
      .where(eq(resource.status, status as any))
      .limit(limit)
      .offset(offset)

    const total = await db
      .select({ count: resource.id })
      .from(resource)
      .where(eq(resource.status, status as any))

    return Response.json({
      resources,
      total: total.length > 0 ? total[0].count : 0,
      count: resources.length,
    })
  } catch (error) {
    console.error('Resources error:', error)
    return Response.json({ error: 'Failed to fetch resources' }, { status: 500 })
  }
}
