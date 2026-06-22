'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Bookmark, Loader2, Plus, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { EmptyState } from '@/components/ui/empty-state'
import { createCollection } from '@/lib/resources'

type CollectionItem = {
  id: string
  name: string
  description: string | null
  isPublic: boolean
  resourceCount: number
  createdAt: string
}

export function CollectionsManager() {
  const [collections, setCollections] = useState<CollectionItem[]>([])
  const [loading, setLoading] = useState(true)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [creating, setCreating] = useState(false)

  async function loadCollections() {
    setLoading(true)
    try {
      const res = await fetch('/api/collections')
      if (!res.ok) throw new Error('Failed')
      setCollections(await res.json())
    } catch {
      toast.error('Unable to load collections')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCollections()
  }, [])

  async function handleCreate() {
    if (!name.trim()) return
    setCreating(true)
    try {
      await createCollection(name.trim(), description.trim() || undefined)
      setName('')
      setDescription('')
      await loadCollections()
      toast.success('Collection created')
    } catch {
      toast.error('Unable to create collection')
    } finally {
      setCreating(false)
    }
  }

  async function handleDelete(id: string) {
    try {
      const res = await fetch(`/api/collections/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed')
      await loadCollections()
      toast.success('Collection deleted')
    } catch {
      toast.error('Unable to delete collection')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="size-4 animate-spin" />
        Loading collections...
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-8">
      <Card className="rounded-[1.75rem] border-border/70 p-6 shadow-sm">
        <h2 className="text-lg font-semibold">Create a collection</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Organize resources into themed lists like exam prep or subject notes.
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Physics Notes" />
          <Input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Optional description"
          />
        </div>
        <Button className="mt-4" onClick={handleCreate} disabled={creating || !name.trim()}>
          <Plus className="size-4" />
          Create collection
        </Button>
      </Card>

      {collections.length === 0 ? (
        <EmptyState
          icon={Bookmark}
          title="No collections yet"
          description="Create your first collection to organize saved resources by topic, exam, or study goal."
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {collections.map((col) => (
            <Card key={col.id} className="rounded-2xl p-5 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <Link href={`/collections/${col.id}`} className="font-semibold hover:text-primary">
                    {col.name}
                  </Link>
                  {col.description ? (
                    <p className="mt-1 text-sm text-muted-foreground">{col.description}</p>
                  ) : null}
                  <p className="mt-3 text-xs text-muted-foreground">
                    {col.resourceCount} resources · {col.isPublic ? 'Public' : 'Private'}
                  </p>
                </div>
                <Button variant="ghost" size="icon-sm" aria-label="Delete collection" onClick={() => handleDelete(col.id)}>
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
