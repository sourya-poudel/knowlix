import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { AppShell } from '@/components/layout/app-shell'
import { Welcome } from '@/components/dashboard/welcome'
import { StatCards } from '@/components/dashboard/stat-cards'
import { QuickActions } from '@/components/dashboard/quick-actions'
import { ResourceSection } from '@/components/dashboard/resource-section'
import { RecommendationSections } from '@/components/resources/recommendation-sections'
import { requireUser } from '@/lib/session'
import { db } from '@/lib/db'
import { bookmark, institution, resource, user } from '@/lib/db/schema'
import { and, desc, eq, inArray } from 'drizzle-orm'
import type { MockResource } from '@/lib/mock-data'

export const metadata: Metadata = {
  title: 'Dashboard | Knowlix',
  description: 'Your Knowlix student dashboard.',
}

export default async function DashboardPage() {
  const currentUser = await requireUser()

  if (currentUser.role === 'admin') {
    redirect('/admin')
  }

  if (currentUser.role === 'moderator') {
    redirect('/moderator')
  }

  const [userInstitution, uploads, savedBookmarks] = await Promise.all([
    currentUser.institutionId
      ? db
          .select()
          .from(institution)
          .where(eq(institution.id, currentUser.institutionId))
          .limit(1)
          .then((rows) => rows[0] ?? null)
      : Promise.resolve(null),
    db
      .select()
      .from(resource)
      .where(eq(resource.userId, currentUser.id))
      .orderBy(desc(resource.createdAt)),
    db
      .select({ resourceId: bookmark.resourceId })
      .from(bookmark)
      .where(eq(bookmark.userId, currentUser.id)),
  ])

  const bookmarkedResourceIds = new Set(savedBookmarks.map((bookmarkRow) => bookmarkRow.resourceId))
  const savedResourceIds = savedBookmarks.map((bookmarkRow) => bookmarkRow.resourceId)

  const savedResourcesRows =
    savedResourceIds.length && currentUser.institutionId
      ? await db
          .select()
          .from(resource)
          .where(
            and(
              inArray(resource.id, savedResourceIds),
              eq(resource.institutionId, currentUser.institutionId),
            ),
          )
          .orderBy(desc(resource.createdAt))
      : savedResourceIds.length
        ? await db
            .select()
            .from(resource)
            .where(inArray(resource.id, savedResourceIds))
            .orderBy(desc(resource.createdAt))
        : []

  const uploaderRows = savedResourcesRows.length
    ? await db
        .select({ id: user.id, name: user.name })
        .from(user)
        .where(inArray(user.id, savedResourcesRows.map((r) => r.userId)))
    : []

  const uploaderMap = new Map(uploaderRows.map((u) => [u.id, u.name]))

  const resources: MockResource[] = uploads.map((upload) => ({
    id: upload.id,
    title: upload.title,
    type: upload.type as MockResource['type'],
    courseCode: upload.courseCode ?? '',
    courseName: upload.courseName ?? '',
    uploaderName: currentUser.name,
    fileUrl: upload.fileUrl ?? undefined,
    fileName: upload.fileName ?? undefined,
    fileType: upload.fileType ?? undefined,
    fileSize: upload.fileSize ?? 0,
    upvoteCount: upload.upvoteCount,
    downloadCount: upload.downloadCount,
    viewCount: upload.viewCount,
    ratingAvg: upload.ratingAvg ?? 0,
    ratingCount: upload.ratingCount ?? 0,
    status: (['approved', 'pending', 'rejected'] as const).includes(upload.status as any)
      ? (upload.status as MockResource['status'])
      : 'pending',
    bookmarked: bookmarkedResourceIds.has(upload.id),
    createdAt: upload.createdAt.toISOString(),
  }))

  const savedResources: MockResource[] = savedResourcesRows.map((upload) => ({
    id: upload.id,
    title: upload.title,
    type: upload.type as MockResource['type'],
    courseCode: upload.courseCode ?? '',
    courseName: upload.courseName ?? '',
    uploaderName: uploaderMap.get(upload.userId) ?? currentUser.name,
    fileUrl: upload.fileUrl ?? undefined,
    fileName: upload.fileName ?? undefined,
    fileType: upload.fileType ?? undefined,
    fileSize: upload.fileSize ?? 0,
    upvoteCount: upload.upvoteCount,
    downloadCount: upload.downloadCount,
    viewCount: upload.viewCount,
    ratingAvg: upload.ratingAvg ?? 0,
    ratingCount: upload.ratingCount ?? 0,
    status: (['approved', 'pending', 'rejected'] as const).includes(upload.status as any)
      ? (upload.status as MockResource['status'])
      : 'pending',
    bookmarked: bookmarkedResourceIds.has(upload.id),
    createdAt: upload.createdAt.toISOString(),
  }))

  const stats = {
    uploads: resources.length,
    saved: savedBookmarks.length,
    downloads: resources.reduce((sum, item) => sum + item.downloadCount, 0),
    upvotes: resources.reduce((sum, item) => sum + item.upvoteCount, 0),
  }

  return (
    <AppShell user={currentUser}>
      <div className="flex flex-col gap-10">
        <Welcome
          name={currentUser.name}
          institutionName={userInstitution?.name ?? currentUser.institutionId ?? 'Unknown'}
          reputation={currentUser.reputation}
        />

        <div className="flex flex-col gap-4 rounded-[1.75rem] border border-border/70 bg-card/80 p-5 shadow-sm backdrop-blur-sm">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-sm font-semibold uppercase tracking-[0.28em] text-muted-foreground">
              Quick actions
            </h2>
            <span className="rounded-full border border-border/70 bg-background/70 px-3 py-1 text-xs font-medium text-muted-foreground">
              Personalized workspace
            </span>
          </div>
          <QuickActions />
        </div>

        <StatCards stats={stats} />

        <ResourceSection
          id="uploads"
          title="My uploads"
          description="Resources you have shared with your campus"
          resources={resources}
          showStatus
        />

        <ResourceSection
          id="saved-resources"
          title="Saved resources"
          description="The resources you've bookmarked for later review"
          resources={savedResources}
          viewAllHref="/bookmarks"
        />

        <RecommendationSections />

        <section
          id="request-material"
          className="rounded-[1.75rem] border border-border/70 bg-card/85 p-6 shadow-sm backdrop-blur-sm"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold tracking-tight text-foreground">
                Request material from peers
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                Ask your campus for notes or study resources you need. Vote on open requests and get notified when
                they're fulfilled.
              </p>
            </div>
            <Link
              href="/requests"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-muted px-4 py-2 text-sm font-medium text-foreground transition hover:bg-muted/80"
            >
              View requests
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </section>
      </div>
    </AppShell>
  )
}
