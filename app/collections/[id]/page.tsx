import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { AppShell } from '@/components/layout/app-shell'
import { Badge } from '@/components/ui/badge'
import { requireInstitutionUser } from '@/lib/session'
import { db } from '@/lib/db'
import { bookmark, collection, resource, user as userTable } from '@/lib/db/schema'
import { eq, inArray } from 'drizzle-orm'
import { CollectionEditor } from '@/components/collections/collection-editor'

type PageProps = { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params
  const col = await db.select().from(collection).where(eq(collection.id, id)).limit(1)
  return { title: col[0] ? `${col[0].name} | Knowlix` : 'Collection | Knowlix' }
}

export default async function CollectionDetailPage({ params }: PageProps) {
  const user = await requireInstitutionUser()
  const { id } = await params

  const col = await db.select().from(collection).where(eq(collection.id, id)).limit(1)
  const collectionRow = col[0]
  if (!collectionRow) notFound()

  if (!collectionRow.isPublic && collectionRow.userId !== user.id && !['admin', 'moderator'].includes(user.role)) {
    notFound()
  }

  const bookmarks = await db
    .select({ resourceId: bookmark.resourceId })
    .from(bookmark)
    .where(eq(bookmark.collectionId, id))

  const resources =
    bookmarks.length > 0
      ? await db.select().from(resource).where(inArray(resource.id, bookmarks.map((b) => b.resourceId)))
      : []

  const uploaderRows = resources.length
    ? await db
        .select({ id: userTable.id, name: userTable.name })
        .from(userTable)
        .where(inArray(userTable.id, resources.map((item) => item.userId)))
    : []
  const uploaderMap = new Map(uploaderRows.map((row) => [row.id, row.name]))

  const canEdit = collectionRow.userId === user.id || ['admin', 'moderator'].includes(user.role)

  return (
    <AppShell user={user}>
      <div className="mb-8 space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-3xl font-semibold tracking-tight">{collectionRow.name}</h1>
          <Badge variant={collectionRow.isPublic ? 'secondary' : 'outline'}>
            {collectionRow.isPublic ? 'Public' : 'Private'}
          </Badge>
        </div>
        {collectionRow.description ? (
          <p className="max-w-2xl text-sm leading-6 text-muted-foreground">{collectionRow.description}</p>
        ) : null}
      </div>

      <CollectionEditor
        collectionId={collectionRow.id}
        canEdit={canEdit}
        initialIsPublic={collectionRow.isPublic}
        resources={resources.map((item) => ({
          id: item.id,
          title: item.title,
          courseCode: item.courseCode,
          courseName: item.courseName,
          uploaderName: uploaderMap.get(item.userId) ?? 'Unknown',
          ratingAvg: item.ratingAvg,
          ratingCount: item.ratingCount,
        }))}
      />
    </AppShell>
  )
}
