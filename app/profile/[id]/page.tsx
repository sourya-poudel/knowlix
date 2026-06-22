import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { AppShell } from '@/components/layout/app-shell'
import { ReputationBadge } from '@/components/profile/reputation-badge'
import { ResourceSection } from '@/components/dashboard/resource-section'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { requireInstitutionUser } from '@/lib/session'
import { getUserProfile } from '@/lib/resource-queries'
import { timeAgo } from '@/lib/constants'
import type { MockResource } from '@/lib/mock-data'

type PageProps = { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params
  const profile = await getUserProfile(id)
  return {
    title: profile ? `${profile.user.name} | Knowlix` : 'Profile | Knowlix',
  }
}

export default async function ProfilePage({ params }: PageProps) {
  const currentUser = await requireInstitutionUser()
  const { id } = await params
  const profile = await getUserProfile(id)
  if (!profile) notFound()

  const uploads: MockResource[] = profile.uploads.map((upload) => ({
    id: upload.id,
    title: upload.title,
    type: upload.type as MockResource['type'],
    courseCode: upload.courseCode ?? '',
    courseName: upload.courseName ?? '',
    uploaderName: profile.user.name,
    userId: upload.userId,
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
    createdAt: upload.createdAt.toISOString(),
  }))

  return (
    <AppShell user={currentUser}>
      <div className="flex flex-col gap-10">
        <Card className="overflow-hidden rounded-[2rem] border-border/70 p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-3">
              <h1 className="text-3xl font-semibold tracking-tight">{profile.user.name}</h1>
              {profile.user.bio ? (
                <p className="max-w-2xl text-sm leading-7 text-muted-foreground">{profile.user.bio}</p>
              ) : (
                <p className="text-sm text-muted-foreground">Campus contributor on Knowlix</p>
              )}
              <div className="flex flex-wrap items-center gap-2">
                <ReputationBadge reputation={profile.stats.reputation} />
                {profile.institution ? (
                  <Badge variant="outline">{profile.institution.name}</Badge>
                ) : null}
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="rounded-2xl bg-muted/50 px-4 py-3">
                <p className="text-2xl font-semibold">{profile.stats.uploadCount}</p>
                <p className="text-xs text-muted-foreground">Uploads</p>
              </div>
              <div className="rounded-2xl bg-muted/50 px-4 py-3">
                <p className="text-2xl font-semibold">{profile.stats.downloadCount}</p>
                <p className="text-xs text-muted-foreground">Downloads</p>
              </div>
              <div className="rounded-2xl bg-muted/50 px-4 py-3">
                <p className="text-2xl font-semibold">{profile.stats.reputation}</p>
                <p className="text-xs text-muted-foreground">Reputation</p>
              </div>
            </div>
          </div>
        </Card>

        {profile.collections.length > 0 ? (
          <section className="space-y-4">
            <h2 className="text-xl font-semibold">Collections</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {profile.collections.map((col) => (
                <Link key={col.id} href={`/collections/${col.id}`}>
                  <Card className="rounded-2xl p-5 transition hover:border-primary/40 hover:shadow-md">
                    <p className="font-semibold">{col.name}</p>
                    {col.description ? (
                      <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{col.description}</p>
                    ) : null}
                    <div className="mt-3 flex items-center gap-2">
                      {col.isPublic ? (
                        <Badge variant="secondary">Public</Badge>
                      ) : (
                        <Badge variant="outline">Private</Badge>
                      )}
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        ) : null}

        <ResourceSection
          title="Recent contributions"
          description="Approved resources shared with the campus."
          resources={uploads}
        />

        {profile.recentComments.length > 0 ? (
          <section className="space-y-4">
            <h2 className="text-xl font-semibold">Recent comments</h2>
            <div className="space-y-3">
              {profile.recentComments.map((comment) => (
                <Card key={comment.id} className="rounded-2xl p-4 shadow-none">
                  <p className="text-sm leading-6">{comment.body}</p>
                  <Link
                    href={`/resources/${comment.resourceId}#comment-${comment.id}`}
                    className="mt-2 inline-block text-sm font-medium text-primary hover:underline"
                  >
                    View discussion · {timeAgo(comment.createdAt)}
                  </Link>
                </Card>
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </AppShell>
  )
}
