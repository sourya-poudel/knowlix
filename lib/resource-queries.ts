import { and, desc, eq, gte, ilike, inArray, notInArray, or, sql } from 'drizzle-orm'
import { db } from '@/lib/db'
import {
  bookmark,
  collection,
  comment,
  institution,
  rating,
  request,
  requestVote,
  resource,
  user,
} from '@/lib/db/schema'
import type { ResourceType } from '@/lib/constants'

export type ResourceListItem = {
  id: string
  title: string
  description: string | null
  type: string
  courseCode: string | null
  courseName: string | null
  professor: string | null
  semester: string | null
  year: number | null
  tags: string[]
  userId: string
  institutionId: string
  uploaderName: string
  fileUrl: string | null
  fileName: string | null
  fileType: string | null
  fileSize: number | null
  upvoteCount: number
  downloadCount: number
  viewCount: number
  ratingAvg: number
  ratingCount: number
  status: string
  createdAt: string
  bookmarked?: boolean
  userRating?: number | null
}

export type SearchFilters = {
  q?: string
  type?: string
  subject?: string
  institutionId?: string
  year?: number
  contributorId?: string
  tag?: string
}

function mapResourceRow(
  row: typeof resource.$inferSelect,
  uploaderName: string,
  extras?: { bookmarked?: boolean; userRating?: number | null },
): ResourceListItem {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    type: row.type,
    courseCode: row.courseCode,
    courseName: row.courseName,
    professor: row.professor,
    semester: row.semester,
    year: row.year,
    tags: row.tags ?? [],
    userId: row.userId,
    institutionId: row.institutionId,
    uploaderName,
    fileUrl: row.fileUrl,
    fileName: row.fileName,
    fileType: row.fileType,
    fileSize: row.fileSize,
    upvoteCount: row.upvoteCount,
    downloadCount: row.downloadCount,
    viewCount: row.viewCount,
    ratingAvg: row.ratingAvg ?? 0,
    ratingCount: row.ratingCount ?? 0,
    status: row.status,
    createdAt: row.createdAt.toISOString(),
    bookmarked: extras?.bookmarked,
    userRating: extras?.userRating,
  }
}

export async function getUploaderNames(userIds: string[]) {
  if (userIds.length === 0) return new Map<string, string>()
  const rows = await db
    .select({ id: user.id, name: user.name })
    .from(user)
    .where(inArray(user.id, userIds))
  return new Map(rows.map((r) => [r.id, r.name]))
}

export async function searchResources(
  institutionId: string,
  filters: SearchFilters,
  currentUserId?: string,
) {
  const conditions = [
    eq(resource.institutionId, institutionId),
    eq(resource.status, 'approved'),
  ]

  if (filters.q) {
    const pattern = `%${filters.q}%`
    conditions.push(
      or(
        ilike(resource.title, pattern),
        ilike(resource.description, pattern),
        ilike(resource.courseCode, pattern),
        ilike(resource.courseName, pattern),
      )!,
    )
  }

  if (filters.type) conditions.push(eq(resource.type, filters.type))
  if (filters.subject) {
    const pattern = `%${filters.subject}%`
    conditions.push(or(ilike(resource.courseCode, pattern), ilike(resource.courseName, pattern))!)
  }
  if (filters.year) conditions.push(eq(resource.year, filters.year))
  if (filters.contributorId) conditions.push(eq(resource.userId, filters.contributorId))
  if (filters.tag) conditions.push(sql`${filters.tag} = ANY(${resource.tags})`)

  const rows = await db
    .select()
    .from(resource)
    .where(and(...conditions))
    .orderBy(desc(resource.createdAt))

  const userMap = await getUploaderNames(rows.map((r) => r.userId))

  let bookmarkedIds = new Set<string>()
  let userRatings = new Map<string, number>()

  if (currentUserId) {
    const bookmarkRows = await db
      .select({ resourceId: bookmark.resourceId })
      .from(bookmark)
      .where(eq(bookmark.userId, currentUserId))
    bookmarkedIds = new Set(bookmarkRows.map((b) => b.resourceId))

    if (rows.length > 0) {
      const ratingRows = await db
        .select({ resourceId: rating.resourceId, value: rating.value })
        .from(rating)
        .where(
          and(eq(rating.userId, currentUserId), inArray(rating.resourceId, rows.map((r) => r.id))),
        )
      userRatings = new Map(ratingRows.map((r) => [r.resourceId, r.value]))
    }
  }

  return rows.map((row) =>
    mapResourceRow(row, userMap.get(row.userId) ?? 'Unknown', {
      bookmarked: bookmarkedIds.has(row.id),
      userRating: userRatings.get(row.id) ?? null,
    }),
  )
}

export async function getResourceById(id: string, currentUserId?: string) {
  const rows = await db.select().from(resource).where(eq(resource.id, id)).limit(1)
  const row = rows[0]
  if (!row) return null

  const userMap = await getUploaderNames([row.userId])
  let bookmarked = false
  let userRating: number | null = null

  if (currentUserId) {
    const bookmarkRows = await db
      .select({ id: bookmark.id })
      .from(bookmark)
      .where(and(eq(bookmark.userId, currentUserId), eq(bookmark.resourceId, id)))
      .limit(1)
    bookmarked = bookmarkRows.length > 0

    const ratingRows = await db
      .select({ value: rating.value })
      .from(rating)
      .where(and(eq(rating.userId, currentUserId), eq(rating.resourceId, id)))
      .limit(1)
    userRating = ratingRows[0]?.value ?? null
  }

  return mapResourceRow(row, userMap.get(row.userId) ?? 'Unknown', { bookmarked, userRating })
}

export async function getPopularResources(institutionId: string, limit = 6) {
  const rows = await db
    .select()
    .from(resource)
    .where(and(eq(resource.institutionId, institutionId), eq(resource.status, 'approved')))
    .orderBy(desc(resource.downloadCount), desc(resource.upvoteCount))
    .limit(limit)

  const userMap = await getUploaderNames(rows.map((r) => r.userId))
  return rows.map((row) => mapResourceRow(row, userMap.get(row.userId) ?? 'Unknown'))
}

export async function getTrendingResources(institutionId: string, limit = 6) {
  const rows = await db
    .select()
    .from(resource)
    .where(
      and(
        eq(resource.institutionId, institutionId),
        eq(resource.status, 'approved'),
        gte(resource.createdAt, sql`now() - interval '14 days'`),
      ),
    )
    .orderBy(desc(resource.viewCount), desc(resource.upvoteCount))
    .limit(limit)

  const userMap = await getUploaderNames(rows.map((r) => r.userId))
  return rows.map((row) => mapResourceRow(row, userMap.get(row.userId) ?? 'Unknown'))
}

export async function getRelatedResources(
  institutionId: string,
  source: typeof resource.$inferSelect,
  limit = 4,
) {
  const conditions = [
    eq(resource.institutionId, institutionId),
    eq(resource.status, 'approved'),
    sql`${resource.id} != ${source.id}`,
  ]

  if (source.courseCode) {
    conditions.push(eq(resource.courseCode, source.courseCode))
  } else if (source.type) {
    conditions.push(eq(resource.type, source.type))
  }

  const rows = await db
    .select()
    .from(resource)
    .where(and(...conditions))
    .orderBy(desc(resource.ratingAvg), desc(resource.downloadCount))
    .limit(limit)

  const userMap = await getUploaderNames(rows.map((r) => r.userId))
  return rows.map((row) => mapResourceRow(row, userMap.get(row.userId) ?? 'Unknown'))
}

export async function getRecommendedForUser(institutionId: string, userId: string, limit = 6) {
  const bookmarkRows = await db
    .select({ resourceId: bookmark.resourceId })
    .from(bookmark)
    .where(eq(bookmark.userId, userId))
    .limit(20)

  const bookmarkedIds = bookmarkRows.map((b) => b.resourceId)
  let preferredTypes: string[] = []

  if (bookmarkedIds.length > 0) {
    const saved = await db
      .select({ type: resource.type })
      .from(resource)
      .where(inArray(resource.id, bookmarkedIds))
    preferredTypes = [...new Set(saved.map((s) => s.type))]
  }

  const conditions = [
    eq(resource.institutionId, institutionId),
    eq(resource.status, 'approved'),
    sql`${resource.userId} != ${userId}`,
  ]

  if (bookmarkedIds.length > 0) {
    conditions.push(notInArray(resource.id, bookmarkedIds))
  }

  if (preferredTypes.length > 0) {
    conditions.push(inArray(resource.type, preferredTypes))
  }

  const rows = await db
    .select()
    .from(resource)
    .where(and(...conditions))
    .orderBy(desc(resource.ratingAvg), desc(resource.createdAt))
    .limit(limit)

  const userMap = await getUploaderNames(rows.map((r) => r.userId))
  return rows.map((row) => mapResourceRow(row, userMap.get(row.userId) ?? 'Unknown'))
}

export type CommentWithAuthor = {
  id: string
  resourceId: string
  userId: string
  parentId: string | null
  body: string
  isDeleted: boolean
  isHidden: boolean
  helpfulCount: number
  authorName: string
  createdAt: string
  updatedAt: string
  replies: CommentWithAuthor[]
}

export async function getCommentThread(resourceId: string, includeHidden = false) {
  const rows = await db
    .select()
    .from(comment)
    .where(eq(comment.resourceId, resourceId))
    .orderBy(comment.createdAt)

  const visible = includeHidden ? rows : rows.filter((c) => !c.isHidden)
  const userMap = await getUploaderNames(visible.map((c) => c.userId))

  const byId = new Map<string, CommentWithAuthor>()
  const roots: CommentWithAuthor[] = []

  for (const row of visible) {
    byId.set(row.id, {
      id: row.id,
      resourceId: row.resourceId,
      userId: row.userId,
      parentId: row.parentId,
      body: row.isDeleted ? '[deleted]' : row.body,
      isDeleted: row.isDeleted,
      isHidden: row.isHidden,
      helpfulCount: row.helpfulCount,
      authorName: userMap.get(row.userId) ?? 'Unknown',
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
      replies: [],
    })
  }

  for (const node of byId.values()) {
    if (node.parentId && byId.has(node.parentId)) {
      byId.get(node.parentId)!.replies.push(node)
    } else if (!node.parentId) {
      roots.push(node)
    }
  }

  return roots
}

export async function getUserProfile(userId: string) {
  const userRows = await db.select().from(user).where(eq(user.id, userId)).limit(1)
  const profile = userRows[0]
  if (!profile) return null

  const institutionRow = profile.institutionId
    ? await db
        .select()
        .from(institution)
        .where(eq(institution.id, profile.institutionId))
        .limit(1)
        .then((rows) => rows[0])
    : null

  const uploads = await db
    .select()
    .from(resource)
    .where(and(eq(resource.userId, userId), eq(resource.status, 'approved')))
    .orderBy(desc(resource.createdAt))
    .limit(12)

  const collections = await db
    .select()
    .from(collection)
    .where(eq(collection.userId, userId))
    .orderBy(desc(collection.createdAt))
    .limit(6)

  const uploadStats = await db
    .select({
      uploadCount: sql<number>`count(*)::int`,
      totalDownloads: sql<number>`coalesce(sum(${resource.downloadCount}), 0)::int`,
    })
    .from(resource)
    .where(and(eq(resource.userId, userId), eq(resource.status, 'approved')))

  const recentComments = await db
    .select({
      id: comment.id,
      body: comment.body,
      resourceId: comment.resourceId,
      createdAt: comment.createdAt,
    })
    .from(comment)
    .where(and(eq(comment.userId, userId), eq(comment.isDeleted, false)))
    .orderBy(desc(comment.createdAt))
    .limit(5)

  return {
    user: profile,
    institution: institutionRow,
    uploads,
    collections,
    stats: {
      uploadCount: uploadStats[0]?.uploadCount ?? 0,
      downloadCount: uploadStats[0]?.totalDownloads ?? 0,
      reputation: profile.reputation,
    },
    recentComments: recentComments.map((c) => ({
      ...c,
      createdAt: c.createdAt.toISOString(),
    })),
  }
}

export async function getOpenRequests(institutionId: string, currentUserId?: string) {
  const rows = await db
    .select()
    .from(request)
    .where(eq(request.institutionId, institutionId))
    .orderBy(desc(request.upvoteCount), desc(request.createdAt))

  let votedIds = new Set<string>()
  if (currentUserId && rows.length > 0) {
    const votes = await db
      .select({ requestId: requestVote.requestId })
      .from(requestVote)
      .where(
        and(
          eq(requestVote.userId, currentUserId),
          inArray(
            requestVote.requestId,
            rows.map((r) => r.id),
          ),
        ),
      )
    votedIds = new Set(votes.map((v) => v.requestId))
  }

  const userMap = await getUploaderNames(rows.map((r) => r.userId))

  return rows.map((row) => ({
    id: row.id,
    title: row.title,
    description: row.description,
    courseCode: row.courseCode,
    status: row.status,
    upvoteCount: row.upvoteCount,
    fulfilledResourceId: row.fulfilledResourceId,
    userId: row.userId,
    authorName: userMap.get(row.userId) ?? 'Unknown',
    hasVoted: votedIds.has(row.id),
    createdAt: row.createdAt.toISOString(),
  }))
}

export type { ResourceType }
