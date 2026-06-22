'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Loader2, MessageSquarePlus, ThumbsUp } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { EmptyState } from '@/components/ui/empty-state'
import { createRequest, fulfillRequest, voteRequest } from '@/lib/resources'
import { timeAgo } from '@/lib/constants'

type RequestItem = {
  id: string
  title: string
  description: string | null
  courseCode: string | null
  status: string
  upvoteCount: number
  fulfilledResourceId: string | null
  userId: string
  authorName: string
  hasVoted: boolean
  createdAt: string
}

export function RequestsBoard() {
  const [requests, setRequests] = useState<RequestItem[]>([])
  const [loading, setLoading] = useState(true)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [courseCode, setCourseCode] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function loadRequests() {
    setLoading(true)
    try {
      const res = await fetch('/api/requests')
      if (!res.ok) throw new Error('Failed')
      setRequests(await res.json())
    } catch {
      toast.error('Unable to load requests')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadRequests()
  }, [])

  async function handleSubmit() {
    if (!title.trim()) return
    setSubmitting(true)
    try {
      await createRequest({
        title: title.trim(),
        description: description.trim() || undefined,
        courseCode: courseCode.trim() || undefined,
      })
      setTitle('')
      setDescription('')
      setCourseCode('')
      await loadRequests()
      toast.success('Request submitted')
    } catch {
      toast.error('Unable to submit request')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleVote(id: string) {
    try {
      await voteRequest(id)
      await loadRequests()
      toast.success('Vote recorded')
    } catch {
      toast.error('Unable to vote')
    }
  }

  async function handleFulfill(id: string) {
    const resourceId = window.prompt('Enter the approved resource ID to link:')
    if (!resourceId) return
    try {
      await fulfillRequest(id, resourceId.trim())
      await loadRequests()
      toast.success('Request marked fulfilled')
    } catch {
      toast.error('Unable to fulfill request')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="size-4 animate-spin" />
        Loading requests...
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-8">
      <Card className="rounded-[1.75rem] border-border/70 p-6 shadow-sm">
        <h2 className="text-lg font-semibold">Request missing material</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Ask your campus for resources you need. Classmates can vote and link uploads when fulfilled.
        </p>
        <div className="mt-4 space-y-3">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder='e.g. Grade 12 Physics Board Questions 2080'
          />
          <Input
            value={courseCode}
            onChange={(e) => setCourseCode(e.target.value)}
            placeholder="Course code (optional)"
          />
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe what you need..."
            rows={3}
          />
        </div>
        <Button className="mt-4" onClick={handleSubmit} disabled={submitting || !title.trim()}>
          Submit request
        </Button>
      </Card>

      {requests.length === 0 ? (
        <EmptyState
          icon={MessageSquarePlus}
          title="No requests yet"
          description="Be the first to ask your campus for study material that's missing from the library."
        />
      ) : (
        <div className="space-y-4">
          {requests.map((item) => (
            <Card key={item.id} className="rounded-2xl p-5 shadow-sm">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold">{item.title}</h3>
                    <Badge variant={item.status === 'fulfilled' ? 'secondary' : 'outline'}>
                      {item.status}
                    </Badge>
                  </div>
                  {item.description ? (
                    <p className="text-sm leading-6 text-muted-foreground">{item.description}</p>
                  ) : null}
                  <p className="text-xs text-muted-foreground">
                    {item.authorName}
                    {item.courseCode ? ` · ${item.courseCode}` : ''} · {timeAgo(item.createdAt)}
                  </p>
                  {item.fulfilledResourceId ? (
                    <Link
                      href={`/resources/${item.fulfilledResourceId}`}
                      className="text-sm font-medium text-primary hover:underline"
                    >
                      View fulfilled resource
                    </Link>
                  ) : null}
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant={item.hasVoted ? 'secondary' : 'outline'}
                    size="sm"
                    onClick={() => handleVote(item.id)}
                    disabled={item.hasVoted || item.status === 'fulfilled'}
                  >
                    <ThumbsUp className="size-4" />
                    {item.upvoteCount}
                  </Button>
                  {item.status !== 'fulfilled' ? (
                    <Button variant="ghost" size="sm" onClick={() => handleFulfill(item.id)}>
                      Mark fulfilled
                    </Button>
                  ) : null}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
