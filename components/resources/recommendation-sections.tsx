'use client'

import { useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'
import { ResourceSection } from '@/components/dashboard/resource-section'
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

export function RecommendationSections() {
  const [popular, setPopular] = useState<MockResource[]>([])
  const [trending, setTrending] = useState<MockResource[]>([])
  const [recommended, setRecommended] = useState<MockResource[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const [popularRes, trendingRes, recommendedRes] = await Promise.all([
          fetch('/api/resources/search?mode=popular'),
          fetch('/api/resources/search?mode=trending'),
          fetch('/api/resources/search?mode=recommended'),
        ])

        if (popularRes.ok) setPopular((await popularRes.json()).map(toMockResource))
        if (trendingRes.ok) setTrending((await trendingRes.json()).map(toMockResource))
        if (recommendedRes.ok) setRecommended((await recommendedRes.json()).map(toMockResource))
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center gap-2 rounded-2xl border border-dashed p-8 text-sm text-muted-foreground">
        <Loader2 className="size-4 animate-spin" />
        Loading recommendations...
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-10">
      {recommended.length > 0 ? (
        <ResourceSection
          title="Recommended for you"
          description="Based on your bookmarks and campus activity."
          resources={recommended}
          viewAllHref="/resources"
        />
      ) : null}
      {trending.length > 0 ? (
        <ResourceSection
          title="Trending this week"
          description="Resources gaining attention across your institution."
          resources={trending}
          viewAllHref="/resources"
        />
      ) : null}
      {popular.length > 0 ? (
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
