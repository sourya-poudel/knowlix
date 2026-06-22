import { ResourceSection } from '@/components/dashboard/resource-section'
import { db } from '@/lib/db'
import { resource, user } from '@/lib/db/schema'
import { and, eq, inArray } from 'drizzle-orm'
import { requireInstitutionUser } from '@/lib/session'
import type { MockResource } from '@/lib/mock-data'
import { AmbientBackdrop } from '@/components/ui/ambient-backdrop'

export default async function ResourcesPage() {
  const currentUser = await requireInstitutionUser()

  const uploads = await db
    .select()
    .from(resource)
    .where(and(eq(resource.status, 'approved'), eq(resource.institutionId, currentUser.institutionId)))
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
    <main className="relative mx-auto w-full max-w-7xl overflow-hidden px-4 py-10 sm:px-6">
      <AmbientBackdrop className="opacity-70" variant="default" />
      <div className="relative mb-8 overflow-hidden rounded-[2rem] border border-border/70 bg-card/85 p-8 shadow-sm backdrop-blur-sm">
        <div className="absolute inset-x-0 top-0 h-20 bg-[linear-gradient(90deg,rgba(46,120,255,0.08),rgba(38,184,181,0.08))]" />
        <h1 className="relative text-3xl font-semibold tracking-tight">Browse resources</h1>
        <p className="relative mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
          Explore approved uploads from your campus through a cleaner, more focused library experience.
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
