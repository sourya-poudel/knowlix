import type { Metadata } from 'next'
import { AppShell } from '@/components/layout/app-shell'
import { ResourceSection } from '@/components/dashboard/resource-section'
import { EmptyState } from '@/components/ui/empty-state'
import { requireInstitutionUser } from '@/lib/session'
import { db } from '@/lib/db'
import { bookmark, resource, user } from '@/lib/db/schema'
import { and, desc, eq, inArray } from 'drizzle-orm'
import type { MockResource } from '@/lib/mock-data'
import { Bookmark } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Bookmarks | Knowlix',
  description: 'Your saved resources on Knowlix.',
}

export default async function BookmarksPage() {
  const currentUser = await requireInstitutionUser()

  const savedBookmarks = await db
    .select({ resourceId: bookmark.resourceId })
    .from(bookmark)
    .where(eq(bookmark.userId, currentUser.id))

  const savedResourceIds = savedBookmarks.map((b) => b.resourceId)
  const savedResourcesRows = savedResourceIds.length
    ? await db
        .select()
        .from(resource)
        .where(and(inArray(resource.id, savedResourceIds), eq(resource.institutionId, currentUser.institutionId)))
        .orderBy(desc(resource.createdAt))
    : []

  const users = savedResourcesRows.length
    ? await db
        .select({ id: user.id, name: user.name })
        .from(user)
        .where(inArray(user.id, savedResourcesRows.map((r) => r.userId)))
    : []

  const userMap = new Map(users.map((u) => [u.id, u.name]))

  const resources: MockResource[] = savedResourcesRows.map((upload) => ({
    id: upload.id,
    title: upload.title,
    type: upload.type as MockResource['type'],
    courseCode: upload.courseCode ?? '',
    courseName: upload.courseName ?? '',
    uploaderName: userMap.get(upload.userId) ?? 'Unknown',
    fileUrl: upload.fileUrl ?? undefined,
    fileName: upload.fileName ?? undefined,
    fileType: upload.fileType ?? undefined,
    fileSize: upload.fileSize ?? 0,
    upvoteCount: upload.upvoteCount,
    downloadCount: upload.downloadCount,
    viewCount: upload.viewCount,
    ratingAvg: upload.ratingAvg ?? 0,
    ratingCount: upload.ratingCount ?? 0,
    status: 'approved',
    bookmarked: true,
    createdAt: upload.createdAt.toISOString(),
  }))

  return (
    <AppShell user={currentUser}>
      <div className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight">Bookmarks</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
          Resources you've saved for quick access during study sessions.
        </p>
      </div>

      {resources.length === 0 ? (
        <EmptyState
          icon={Bookmark}
          title="No bookmarks yet"
          description="Save resources while browsing the library to build your personal study collection."
        />
      ) : (
        <ResourceSection
          title="Saved resources"
          description={`${resources.length} bookmarked ${resources.length === 1 ? 'resource' : 'resources'}`}
          resources={resources}
        />
      )}
    </AppShell>
  )
}
