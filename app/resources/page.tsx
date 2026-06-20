import { ResourceSection } from '@/components/dashboard/resource-section'
import { db } from '@/lib/db'
import { resource, user } from '@/lib/db/schema'
import { eq, inArray } from 'drizzle-orm'
import { requireUser } from '@/lib/session'
import type { MockResource } from '@/lib/mock-data'

export default async function ResourcesPage() {
  const currentUser = await requireUser()

  const uploads = await db
    .select()
    .from(resource)
    .where(eq(resource.status, 'approved'))
    .orderBy(resource.createdAt)

  const users = await db
    .select({ id: user.id, name: user.name })
    .from(user)
    .where(inArray(user.id, uploads.map((item) => item.userId)))

  const userMap = new Map(users.map((u) => [u.id, u.name]))

  const resources: MockResource[] = uploads.map((upload) => ({
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
    status: 'approved',
    bookmarked: false,
    createdAt: upload.createdAt.toISOString(),
  }))

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6">
      <div className="mb-8 rounded-3xl border border-border bg-card p-8 shadow-sm">
        <h1 className="text-3xl font-semibold">Browse resources</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Explore approved uploads from your campus.
        </p>
      </div>
      <ResourceSection
        title="Approved resources"
        description="Browse the best study material shared by your peers."
        resources={resources}
      />
    </main>
  )
}
