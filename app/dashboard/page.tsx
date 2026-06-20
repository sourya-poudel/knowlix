import type { Metadata } from 'next'
import { DashboardNav } from '@/components/dashboard/dashboard-nav'
import { Welcome } from '@/components/dashboard/welcome'
import { StatCards } from '@/components/dashboard/stat-cards'
import { QuickActions } from '@/components/dashboard/quick-actions'
import { ResourceSection } from '@/components/dashboard/resource-section'
import { requireUser } from '@/lib/session'
import { db } from '@/lib/db'
import { institution, resource } from '@/lib/db/schema'
import { desc, eq } from 'drizzle-orm'
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
    createdAt: upload.createdAt.toISOString(),
  }))

  const stats = {
    uploads: resources.length,
    saved: 0,
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
            title="My uploads"
            description="Resources you have shared with your campus"
            resources={resources}
            showStatus
          />
        </div>
      </main>
    </div>
  )
}
