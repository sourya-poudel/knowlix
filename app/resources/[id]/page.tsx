import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { AppShell } from '@/components/layout/app-shell'
import { ResourceDetailView } from '@/components/resources/resource-detail-view'
import { requireInstitutionUser } from '@/lib/session'
import { getRelatedResources, getResourceById } from '@/lib/resource-queries'
import { db } from '@/lib/db'
import { resource } from '@/lib/db/schema'
import { eq, sql } from 'drizzle-orm'

type PageProps = { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params
  const item = await getResourceById(id)
  return {
    title: item ? `${item.title} | Knowlix` : 'Resource | Knowlix',
  }
}

export default async function ResourceDetailPage({ params }: PageProps) {
  const user = await requireInstitutionUser()
  const { id } = await params

  const item = await getResourceById(id, user.id)
  if (!item) notFound()

  if (item.institutionId !== user.institutionId && !['admin', 'moderator'].includes(user.role)) {
    notFound()
  }

  if (item.status !== 'approved' && item.userId !== user.id && !['admin', 'moderator'].includes(user.role)) {
    notFound()
  }

  await db
    .update(resource)
    .set({ viewCount: sql`${resource.viewCount} + 1` })
    .where(eq(resource.id, id))

  const sourceRows = await db.select().from(resource).where(eq(resource.id, id)).limit(1)
  const related = sourceRows[0] ? await getRelatedResources(user.institutionId, sourceRows[0]) : []

  return (
    <AppShell user={user}>
      <ResourceDetailView
        resource={{ ...item, viewCount: item.viewCount + 1, related }}
        currentUserId={user.id}
        isModerator={['moderator', 'admin'].includes(user.role)}
      />
    </AppShell>
  )
}
