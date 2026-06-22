'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Bookmark, Download, Eye, FolderPlus, ThumbsUp } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { formatFileSize, resourceTypeLabel, timeAgo } from '@/lib/constants'
import { addToCollection, rateResource, toggleBookmark } from '@/lib/resources'
import { StarRatingDisplay, StarRatingInput } from '@/components/resources/star-rating'
import { CommentThread } from '@/components/resources/comment-thread'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'

type CollectionOption = { id: string; name: string }

type ResourceDetail = {
  id: string
  title: string
  description: string | null
  type: string
  courseCode: string | null
  courseName: string | null
  professor: string | null
  semester: string | null
  year: number | null
  tags: string[]
  userId: string
  uploaderName: string
  fileUrl: string | null
  fileName: string | null
  fileSize: number | null
  upvoteCount: number
  downloadCount: number
  viewCount: number
  ratingAvg: number
  ratingCount: number
  bookmarked?: boolean
  userRating?: number | null
  createdAt: string
  related: Array<{
    id: string
    title: string
    courseCode: string | null
    courseName: string | null
    uploaderName: string
    ratingAvg: number
    ratingCount: number
  }>
}

export function ResourceDetailView({
  resource,
  currentUserId,
  isModerator,
}: {
  resource: ResourceDetail
  currentUserId: string
  isModerator: boolean
}) {
  const [bookmarked, setBookmarked] = useState(resource.bookmarked ?? false)
  const [ratingAvg, setRatingAvg] = useState(resource.ratingAvg)
  const [ratingCount, setRatingCount] = useState(resource.ratingCount)
  const [userRating, setUserRating] = useState<number | null>(resource.userRating ?? null)
  const [ratingBusy, setRatingBusy] = useState(false)
  const [collections, setCollections] = useState<CollectionOption[]>([])

  useEffect(() => {
    fetch('/api/collections')
      .then((res) => (res.ok ? res.json() : []))
      .then((items) => setCollections(items.map((item: CollectionOption) => ({ id: item.id, name: item.name }))))
      .catch(() => {})
  }, [])

  async function handleToggleBookmark() {
    try {
      await toggleBookmark(resource.id, bookmarked)
      setBookmarked(!bookmarked)
      toast.success(bookmarked ? 'Removed bookmark' : 'Saved to bookmarks')
    } catch {
      toast.error('Unable to update bookmark')
    }
  }

  async function handleRate(value: number) {
    setRatingBusy(true)
    try {
      const result = await rateResource(resource.id, value)
      setUserRating(value)
      setRatingAvg(result.ratingAvg)
      setRatingCount(result.ratingCount)
      toast.success('Rating saved')
    } catch {
      toast.error('Unable to save rating')
    } finally {
      setRatingBusy(false)
    }
  }

  async function handleAddToCollection(collectionId: string) {
    try {
      await addToCollection(collectionId, resource.id)
      toast.success('Added to collection')
    } catch {
      toast.error('Unable to add to collection')
    }
  }

  return (
    <div className="flex flex-col gap-10">
      <Card className="overflow-hidden rounded-[2rem] border-border/70 p-6 shadow-sm sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline">{resourceTypeLabel(resource.type)}</Badge>
              {resource.year ? <Badge variant="secondary">{resource.year}</Badge> : null}
            </div>
            <h1 className="text-3xl font-semibold tracking-tight">{resource.title}</h1>
            <p className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">{resource.courseCode}</span>
              {resource.courseName ? ` · ${resource.courseName}` : null}
              {resource.semester ? ` · ${resource.semester}` : null}
            </p>
            <Link href={`/profile/${resource.userId}`} className="text-sm font-medium text-primary hover:underline">
              Uploaded by {resource.uploaderName}
            </Link>
          </div>
          <div className="flex flex-col items-end gap-3">
            <StarRatingDisplay value={ratingAvg} count={ratingCount} size="md" />
            <StarRatingInput value={userRating} onChange={handleRate} disabled={ratingBusy} />
            <Button variant={bookmarked ? 'secondary' : 'outline'} onClick={handleToggleBookmark}>
              <Bookmark className={`size-4 ${bookmarked ? 'fill-current' : ''}`} />
              {bookmarked ? 'Saved' : 'Bookmark'}
            </Button>
            {collections.length > 0 ? (
              <Select onValueChange={(value) => typeof value === 'string' && handleAddToCollection(value)}>
                <SelectTrigger className="w-48">
                  <FolderPlus className="size-4" />
                  <SelectValue placeholder="Add to collection" />
                </SelectTrigger>
                <SelectContent>
                  {collections.map((col) => (
                    <SelectItem key={col.id} value={col.id}>
                      {col.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : null}
          </div>
        </div>

        {resource.description ? (
          <p className="mt-6 text-sm leading-7 text-muted-foreground">{resource.description}</p>
        ) : null}

        {resource.tags.length > 0 ? (
          <div className="mt-4 flex flex-wrap gap-2">
            {resource.tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                #{tag}
              </Badge>
            ))}
          </div>
        ) : null}

        <div className="mt-6 flex flex-wrap items-center gap-4 border-t border-border pt-5 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <ThumbsUp className="size-4" />
            {resource.upvoteCount} upvotes
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Download className="size-4" />
            {resource.downloadCount} downloads
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Eye className="size-4" />
            {resource.viewCount} views
          </span>
          <span>{formatFileSize(resource.fileSize)}</span>
          <span>{timeAgo(resource.createdAt)}</span>
        </div>

        {resource.fileUrl ? (
          <div className="mt-5">
            <Button render={<a href={resource.fileUrl} target="_blank" rel="noreferrer" />}>
              <Download className="size-4" />
              Download {resource.fileName ?? 'file'}
            </Button>
          </div>
        ) : null}
      </Card>

      <CommentThread resourceId={resource.id} currentUserId={currentUserId} isModerator={isModerator} />

      {resource.related.length > 0 ? (
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Related resources</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {resource.related.map((item) => (
              <Link key={item.id} href={`/resources/${item.id}`}>
                <Card className="rounded-2xl p-4 transition hover:border-primary/40 hover:shadow-md">
                  <p className="font-medium">{item.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {item.courseCode} · {item.courseName}
                  </p>
                  <div className="mt-3">
                    <StarRatingDisplay value={item.ratingAvg} count={item.ratingCount} />
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  )
}
