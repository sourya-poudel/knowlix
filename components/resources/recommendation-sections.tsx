'use client'

import { useEffect, useState } from 'react'
import { ResourceSection } from '@/components/dashboard/resource-section'
import { Skeleton } from '@/components/ui/skeleton'
import type { MockResource } from '@/lib/mock-data'

function toMockResource(item: Record<string, unknown>): MockResource {
  return {
    id: String(item.id),
    title: String(item.title),
    type: item.type as MockResource['type'],
    courseCode: String(item.courseCode ?? ''),
    courseName: String(item.courseName ?? ''),
    uploaderName: String(item.uploaderName ?? 'Unknown'),
    fileUrl: item.fileUrl ? String(item.fileUrl) : undefined,
    fileName: item.fileName ? String(item.fileName) : undefined,
    fileType: item.fileType ? String(item.fileType) : undefined,
    fileSize: Number(item.fileSize ?? 0),
    upvoteCount: Number(item.upvoteCount ?? 0),
    downloadCount: Number(item.downloadCount ?? 0),
    viewCount: Number(item.viewCount ?? 0),
    ratingAvg: Number(item.ratingAvg ?? 0),
    ratingCount: Number(item.ratingCount ?? 0),
    status: 'approved',
    bookmarked: Boolean(item.bookmarked),
    createdAt: String(item.createdAt),
  }
}

function SectionSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-6 w-48" />
      <Skeleton className="h-4 w-72" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <Skeleton key={index} className="h-44 rounded-3xl" />
        ))}
      </div>
    </div>
  )
}

export function RecommendationSections() {
  const [popular, setPopular] = useState<MockResource[] | null>(null)
  const [trending, setTrending] = useState<MockResource[] | null>(null)
  const [recommended, setRecommended] = useState<MockResource[] | null>(null)

  useEffect(() => {
    async function loadMode(mode: string, setter: (items: MockResource[]) => void) {
      try {
        const res = await fetch(`/api/resources/search?mode=${mode}`)
        if (res.ok) {
          const data = await res.json()
          setter(data.map(toMockResource))
        } else {
          setter([])
        }
      } catch {
        setter([])
      }
    }

    void loadMode('recommended', setRecommended)
    void loadMode('trending', setTrending)
    void loadMode('popular', setPopular)
  }, [])

  const hasAny =
    (recommended?.length ?? 0) > 0 ||
    (trending?.length ?? 0) > 0 ||
    (popular?.length ?? 0) > 0

  const allLoaded =
    recommended !== null && trending !== null && popular !== null

  if (allLoaded && !hasAny) return null

  return (
    <div className="flex flex-col gap-10">
      {recommended === null ? (
        <SectionSkeleton />
      ) : recommended.length > 0 ? (
        <ResourceSection
          title="Recommended for you"
          description="Based on your bookmarks and campus activity."
          resources={recommended}
          viewAllHref="/resources"
        />
      ) : null}

      {trending === null ? (
        <SectionSkeleton />
      ) : trending.length > 0 ? (
        <ResourceSection
          title="Trending this week"
          description="Resources gaining attention across your institution."
          resources={trending}
          viewAllHref="/resources"
        />
      ) : null}

      {popular === null ? (
        <SectionSkeleton />
      ) : popular.length > 0 ? (
        <ResourceSection
          title="Popular resources"
          description="Most downloaded and upvoted materials on campus."
          resources={popular}
          viewAllHref="/resources"
        />
      ) : null}
    </div>
  )
}
