import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { DashboardNav } from '@/components/dashboard/dashboard-nav'
import { Welcome } from '@/components/dashboard/welcome'
import { StatCards } from '@/components/dashboard/stat-cards'
import { QuickActions } from '@/components/dashboard/quick-actions'
import { ResourceSection } from '@/components/dashboard/resource-section'
import { requireUser } from '@/lib/session'
import { db } from '@/lib/db'
import { bookmark, institution, resource } from '@/lib/db/schema'
import { desc, eq, inArray } from 'drizzle-orm'
import type { MockResource } from '@/lib/mock-data'

export const metadata: Metadata = {
  title: 'Dashboard | Knowlix',
  description: 'Your Knowlix student dashboard.',
}

function getInitials(name: string) {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
}

export default async function DashboardPage() {
  const user = await requireUser()

  const userInstitution = user.institutionId
    ? await db
        .select()
        .from(institution)
        .where(eq(institution.id, user.institutionId))
        .limit(1)
        .then((rows) => rows[0])
    : null

  const uploads = await db
    .select()
    .from(resource)
    .where(eq(resource.userId, user.id))
    .orderBy(desc(resource.createdAt))

  const savedBookmarks = await db
    .select({ resourceId: bookmark.resourceId })
    .from(bookmark)
    .where(eq(bookmark.userId, user.id))

  const bookmarkedResourceIds = new Set(savedBookmarks.map((bookmarkRow) => bookmarkRow.resourceId))
  const savedResourceIds = savedBookmarks.map((bookmarkRow) => bookmarkRow.resourceId)

  const savedResourcesRows = savedResourceIds.length
    ? await db
        .select()
        .from(resource)
        .where(inArray(resource.id, savedResourceIds))
        .orderBy(desc(resource.createdAt))
    : []

  const resources: MockResource[] = uploads.map((upload) => ({
    id: upload.id,
    title: upload.title,
    type: upload.type as MockResource['type'],
    courseCode: upload.courseCode ?? '',
    courseName: upload.courseName ?? '',
    uploaderName: user.name,
    fileSize: upload.fileSize ?? 0,
    upvoteCount: upload.upvoteCount,
    downloadCount: upload.downloadCount,
    viewCount: upload.viewCount,
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
    uploaderName: user.name,
    fileSize: upload.fileSize ?? 0,
    upvoteCount: upload.upvoteCount,
    downloadCount: upload.downloadCount,
    viewCount: upload.viewCount,
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
    <div className="flex min-h-dvh flex-col bg-muted/30">
      <DashboardNav
        name={user.name}
        email={user.email}
        initials={getInitials(user.name)}
      />

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6">
        <div className="flex flex-col gap-10">
          <Welcome
            name={user.name}
            institutionName={userInstitution?.name ?? user.institutionId ?? 'Unknown'}
            reputation={user.reputation}
          />

          <div className="flex flex-col gap-4">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Quick actions
            </h2>
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
          />

          <section id="request-material" className="rounded-3xl border border-border bg-card p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-semibold tracking-tight text-foreground">
                  Request material from peers
                </h2>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                  Ask your campus for notes or study resources you need. In the next step, you can submit a request and keep track of responses.
                </p>
              </div>
              <Link href="#" className="inline-flex items-center gap-2 rounded-full border border-border bg-muted px-4 py-2 text-sm font-medium text-foreground transition hover:bg-muted/80">
                Submit a request
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}
