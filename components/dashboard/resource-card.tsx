'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Bookmark, Download, Eye, ThumbsUp, FileText } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { resourceTypeLabel, formatFileSize, timeAgo } from '@/lib/constants'
import type { MockResource } from '@/lib/mock-data'
import { toggleBookmark } from '@/lib/resources'
import { StarRatingDisplay } from '@/components/resources/star-rating'
import { toast } from 'sonner'

function StatusBadge({ status }: { status: MockResource['status'] }) {
  if (status === 'approved') {
    return (
      <Badge variant="secondary" className="text-chart-3">
        Approved
      </Badge>
    )
  }
  if (status === 'pending') {
    return (
      <Badge variant="secondary" className="text-chart-4">
        Pending review
      </Badge>
    )
  }
  return <Badge variant="destructive">Rejected</Badge>
}

export function ResourceCard({
  resource,
  showStatus = false,
}: {
  resource: MockResource
  showStatus?: boolean
}) {
  const [bookmarked, setBookmarked] = useState(resource.bookmarked ?? false)

  async function handleToggleBookmark(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()

    const next = !bookmarked
    setBookmarked(next)

    try {
      await toggleBookmark(resource.id, bookmarked)
      toast.success(next ? 'Bookmarked' : 'Removed bookmark')
    } catch {
      setBookmarked(bookmarked)
      toast.error('Unable to update bookmark')
    }
  }

  return (
    <Link href={`/resources/${resource.id}`} className="group block">
      <Card className="flex h-full flex-col gap-4 rounded-3xl border border-border/70 bg-card/95 p-5 shadow-sm transition-[border-color,box-shadow] duration-150 group-hover:border-primary/30 group-hover:shadow-md">
        <div className="flex items-start justify-between gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-border/70 bg-background text-secondary-foreground">
            <FileText className="size-5" aria-hidden="true" />
          </span>
          <div className="flex items-center gap-2">
            <Badge variant="outline">{resourceTypeLabel(resource.type)}</Badge>
            {showStatus && <StatusBadge status={resource.status} />}
            <button
              type="button"
              aria-label="Toggle bookmark"
              onClick={handleToggleBookmark}
              className="ml-2"
            >
              <Bookmark
                className={`size-4 ${bookmarked ? 'fill-primary text-primary' : 'text-muted-foreground'}`}
              />
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <h3 className="line-clamp-2 text-[1.02rem] font-semibold leading-snug tracking-tight text-card-foreground">
            {resource.title}
          </h3>
          <p className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">{resource.courseCode}</span>
            {' \u00B7 '}
            {resource.courseName}
          </p>
          {(resource.ratingCount ?? 0) > 0 || (resource.ratingAvg ?? 0) > 0 ? (
            <StarRatingDisplay value={resource.ratingAvg ?? 0} count={resource.ratingCount ?? 0} />
          ) : null}
        </div>

        <div className="mt-auto flex items-center justify-between gap-2 border-t border-border pt-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1">
              <ThumbsUp className="size-3.5" aria-hidden="true" />
              {resource.upvoteCount}
            </span>
            <span className="inline-flex items-center gap-1">
              <Download className="size-3.5" aria-hidden="true" />
              {resource.downloadCount}
            </span>
            <span className="inline-flex items-center gap-1">
              <Eye className="size-3.5" aria-hidden="true" />
              {resource.viewCount}
            </span>
          </div>
          <span>{formatFileSize(resource.fileSize)}</span>
        </div>

        <p className="text-xs text-muted-foreground">
          {resource.uploaderName} {'\u00B7'} {timeAgo(resource.createdAt)}
        </p>
      </Card>
    </Link>
  )
}
