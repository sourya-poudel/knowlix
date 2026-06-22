import { Suspense } from 'react'
import type { Metadata } from 'next'
import { AppShell } from '@/components/layout/app-shell'
import { ResourceSection } from '@/components/dashboard/resource-section'
import { ResourceSearchFilters } from '@/components/resources/search-filters'
import { RecommendationSections } from '@/components/resources/recommendation-sections'
import { requireInstitutionUser } from '@/lib/session'
import { searchResources } from '@/lib/resource-queries'
import type { MockResource } from '@/lib/mock-data'
import { Skeleton } from '@/components/ui/skeleton'

export const metadata: Metadata = {
  title: 'Explore Resources | Knowlix',
  description: 'Browse and search approved campus resources.',
}

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

function mapToMockResource(item: Awaited<ReturnType<typeof searchResources>>[number]): MockResource {
  return {
    id: item.id,
    title: item.title,
    type: item.type as MockResource['type'],
    courseCode: item.courseCode ?? '',
    courseName: item.courseName ?? '',
    uploaderName: item.uploaderName,
    userId: item.userId,
    fileUrl: item.fileUrl ?? undefined,
    fileName: item.fileName ?? undefined,
    fileType: item.fileType ?? undefined,
    fileSize: item.fileSize ?? 0,
    upvoteCount: item.upvoteCount,
    downloadCount: item.downloadCount,
    viewCount: item.viewCount,
    ratingAvg: item.ratingAvg,
    ratingCount: item.ratingCount,
    status: 'approved',
    bookmarked: item.bookmarked,
    createdAt: item.createdAt,
  }
}

async function ResourceResults({ searchParams }: PageProps) {
  const user = await requireInstitutionUser()
  const params = await searchParams

  const getParam = (key: string) => {
    const value = params[key]
    return typeof value === 'string' ? value : undefined
  }

  const yearParam = getParam('year')
  const hasFilters = ['q', 'type', 'subject', 'year', 'tag', 'contributor'].some((key) => getParam(key))

  const items = hasFilters
    ? await searchResources(
        user.institutionId,
        {
          q: getParam('q'),
          type: getParam('type'),
          subject: getParam('subject'),
          year: yearParam ? Number(yearParam) : undefined,
          contributorId: getParam('contributor'),
          tag: getParam('tag'),
        },
        user.id,
      )
    : []

  const resources = items.map(mapToMockResource)

  if (!hasFilters) {
    return <RecommendationSections />
  }

  return (
    <ResourceSection
      title="Search results"
      description={`${resources.length} ${resources.length === 1 ? 'resource' : 'resources'} matched your filters`}
      resources={resources}
    />
  )
}

export default async function ResourcesPage({ searchParams }: PageProps) {
  const user = await requireInstitutionUser()

  return (
    <AppShell user={user}>
      <div className="mb-8 overflow-hidden rounded-[2rem] border border-border/70 bg-card/85 p-8 shadow-sm backdrop-blur-sm">
        <h1 className="text-3xl font-semibold tracking-tight">Browse resources</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
          Explore approved uploads from your campus with advanced filters and personalized recommendations.
        </p>
      </div>

      <div className="mb-8">
        <Suspense fallback={<Skeleton className="h-48 w-full rounded-[1.75rem]" />}>
          <ResourceSearchFilters />
        </Suspense>
      </div>

      <Suspense fallback={<Skeleton className="h-64 w-full rounded-[1.75rem]" />}>
        <ResourceResults searchParams={searchParams} />
      </Suspense>
    </AppShell>
  )
}
