"use client"

import { useState } from 'react'
import { Download, Eye, ThumbsUp, FileText, Bookmark } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { resourceTypeLabel, formatFileSize, timeAgo } from '@/lib/constants'
import type { MockResource } from '@/lib/mock-data'
import { toggleBookmark } from '@/lib/resources'
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

  async function handleToggleBookmark() {
    try {
      await toggleBookmark(resource.id, bookmarked)
      setBookmarked(!bookmarked)
      toast.success(bookmarked ? 'Removed bookmark' : 'Bookmarked')
    } catch (err) {
      toast.error('Unable to update bookmark')
    }
  }

  return (
    <Card className="flex flex-col gap-4 rounded-3xl border border-border bg-card p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg">
      <div className="flex items-start justify-between gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
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
            <Bookmark className={`size-4 ${bookmarked ? 'text-primary' : 'text-muted-foreground'}`} />
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <h3 className="line-clamp-2 font-semibold leading-snug text-card-foreground">
          {resource.title}
        </h3>
        <p className="text-sm text-muted-foreground">
          <span className="font-medium text-foreground">{resource.courseCode}</span>
          {' \u00B7 '}
          {resource.courseName}
        </p>
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
  )
}
