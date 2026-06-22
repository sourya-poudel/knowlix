'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Plus, Share2, Trash2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { EmptyState } from '@/components/ui/empty-state'
import { Input } from '@/components/ui/input'
import { StarRatingDisplay } from '@/components/resources/star-rating'
import { toast } from 'sonner'

export type CollectionResource = {
  id: string
  title: string
  courseCode: string | null
  courseName: string | null
  uploaderName: string
  ratingAvg: number | null
  ratingCount: number | null
}

export function CollectionEditor({
  collectionId,
  canEdit,
  initialIsPublic,
  resources,
}: {
  collectionId: string
  canEdit: boolean
  initialIsPublic: boolean
  resources: CollectionResource[]
}) {
  const router = useRouter()
  const [resourceId, setResourceId] = useState('')
  const [isPublic, setIsPublic] = useState(initialIsPublic)
  const [busy, setBusy] = useState(false)

  async function handleAdd() {
    if (!resourceId.trim()) return
    setBusy(true)
    try {
      const res = await fetch(`/api/collections/${collectionId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resourceId: resourceId.trim() }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'Unable to add resource')
      setResourceId('')
      router.refresh()
      toast.success('Resource added to collection')
    } catch {
      toast.error('Unable to add resource')
    } finally {
      setBusy(false)
    }
  }

  async function handleRemove(id: string) {
    setBusy(true)
    try {
      const res = await fetch(`/api/collections/${collectionId}?resourceId=${id}`, {
        method: 'DELETE',
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'Unable to remove resource')
      router.refresh()
      toast.success('Resource removed')
    } catch {
      toast.error('Unable to remove resource')
    } finally {
      setBusy(false)
    }
  }

  async function handleToggleVisibility() {
    setBusy(true)
    try {
      const next = !isPublic
      const res = await fetch(`/api/collections/${collectionId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPublic: next }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'Unable to update collection')
      setIsPublic(next)
      router.refresh()
      toast.success(next ? 'Collection is now public' : 'Collection is now private')
    } catch {
      toast.error('Unable to update collection visibility')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {canEdit ? (
        <Card className="rounded-[1.75rem] border-border/70 p-6 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold">Collection controls</h2>
                <Badge variant={isPublic ? 'secondary' : 'outline'}>{isPublic ? 'Public' : 'Private'}</Badge>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                Add resources by ID, remove items, or make this collection shareable.
              </p>
            </div>
            <Button variant="outline" onClick={handleToggleVisibility} disabled={busy}>
              <Share2 className="size-4" />
              {isPublic ? 'Make private' : 'Make public'}
            </Button>
          </div>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <Input
              value={resourceId}
              onChange={(e) => setResourceId(e.target.value)}
              placeholder="Paste a resource ID to add"
              aria-label="Resource ID"
            />
            <Button onClick={handleAdd} disabled={busy || !resourceId.trim()}>
              <Plus className="size-4" />
              Add resource
            </Button>
          </div>
        </Card>
      ) : null}

      {resources.length === 0 ? (
        <EmptyState
          icon={Plus}
          title="This collection is empty"
          description="Add resources from their detail pages or by resource ID to start building a curated list."
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {resources.map((item) => (
            <Card key={item.id} className="rounded-2xl p-5 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <Link href={`/resources/${item.id}`} className="block font-semibold hover:text-primary">
                    {item.title}
                  </Link>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {item.courseCode} · {item.courseName}
                  </p>
                  <p className="mt-2 text-xs text-muted-foreground">{item.uploaderName}</p>
                  <div className="mt-3">
                    <StarRatingDisplay value={item.ratingAvg ?? 0} count={item.ratingCount ?? 0} />
                  </div>
                </div>

                {canEdit ? (
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label="Remove from collection"
                    onClick={() => handleRemove(item.id)}
                    disabled={busy}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                ) : null}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}