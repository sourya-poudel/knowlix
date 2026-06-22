'use client'

import { useEffect, useState } from 'react'
import { Loader2, MessageSquare, MoreHorizontal, Pencil, Trash2, Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { timeAgo } from '@/lib/constants'
import {
  createComment,
  deleteComment,
  markCommentHelpful,
  moderateComment,
  updateComment,
} from '@/lib/resources'
import { toast } from 'sonner'
import type { CommentWithAuthor } from '@/lib/resource-queries'

function CommentNode({
  comment,
  currentUserId,
  isModerator,
  resourceId,
  depth,
  onRefresh,
}: {
  comment: CommentWithAuthor
  currentUserId: string
  isModerator: boolean
  resourceId: string
  depth: number
  onRefresh: () => void
}) {
  const [replyOpen, setReplyOpen] = useState(false)
  const [editing, setEditing] = useState(false)
  const [body, setBody] = useState(comment.body)
  const [replyBody, setReplyBody] = useState('')
  const [busy, setBusy] = useState(false)

  const isOwner = comment.userId === currentUserId

  async function handleReply() {
    if (!replyBody.trim()) return
    setBusy(true)
    try {
      await createComment({ resourceId, body: replyBody.trim(), parentId: comment.id })
      setReplyBody('')
      setReplyOpen(false)
      onRefresh()
      toast.success('Reply posted')
    } catch {
      toast.error('Unable to post reply')
    } finally {
      setBusy(false)
    }
  }

  async function handleSaveEdit() {
    if (!body.trim()) return
    setBusy(true)
    try {
      await updateComment(comment.id, body.trim())
      setEditing(false)
      onRefresh()
      toast.success('Comment updated')
    } catch {
      toast.error('Unable to update comment')
    } finally {
      setBusy(false)
    }
  }

  async function handleDelete() {
    setBusy(true)
    try {
      await deleteComment(comment.id)
      onRefresh()
      toast.success('Comment deleted')
    } catch {
      toast.error('Unable to delete comment')
    } finally {
      setBusy(false)
    }
  }

  async function handleModerate(action: 'hide' | 'unhide') {
    setBusy(true)
    try {
      await moderateComment(comment.id, action)
      onRefresh()
      toast.success(action === 'hide' ? 'Comment hidden' : 'Comment restored')
    } catch {
      toast.error('Moderation failed')
    } finally {
      setBusy(false)
    }
  }

  async function handleHelpful() {
    try {
      await markCommentHelpful(comment.id)
      onRefresh()
      toast.success('Marked as helpful')
    } catch {
      toast.error('Unable to mark helpful')
    }
  }

  return (
    <div id={`comment-${comment.id}`} className={depth > 0 ? 'ml-4 border-l border-border/70 pl-4 sm:ml-6 sm:pl-6' : ''}>
      <Card className="rounded-2xl border-border/70 p-4 shadow-none">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-semibold">{comment.authorName}</span>
              <span className="text-xs text-muted-foreground">{timeAgo(comment.createdAt)}</span>
              {comment.isHidden ? (
                <Badge variant="secondary" className="text-xs">
                  Hidden
                </Badge>
              ) : null}
            </div>
            {editing ? (
              <div className="mt-3 space-y-2">
                <Textarea value={body} onChange={(e) => setBody(e.target.value)} rows={3} />
                <div className="flex gap-2">
                  <Button size="sm" onClick={handleSaveEdit} disabled={busy}>
                    Save
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setEditing(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-foreground">{comment.body}</p>
            )}
          </div>

          {(isOwner || isModerator) && !comment.isDeleted ? (
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button variant="ghost" size="icon-sm" aria-label="Comment actions">
                    <MoreHorizontal className="size-4" />
                  </Button>
                }
              />
              <DropdownMenuContent align="end">
                {isOwner ? (
                  <>
                    <DropdownMenuItem onClick={() => setEditing(true)}>
                      <Pencil className="size-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleDelete} variant="destructive">
                      <Trash2 className="size-4" />
                      Delete
                    </DropdownMenuItem>
                  </>
                ) : null}
                {isModerator ? (
                  <DropdownMenuItem onClick={() => handleModerate(comment.isHidden ? 'unhide' : 'hide')}>
                    <Shield className="size-4" />
                    {comment.isHidden ? 'Restore comment' : 'Hide comment'}
                  </DropdownMenuItem>
                ) : null}
              </DropdownMenuContent>
            </DropdownMenu>
          ) : null}
        </div>

        {!comment.isDeleted && !editing ? (
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <Button variant="ghost" size="xs" onClick={() => setReplyOpen(!replyOpen)}>
              Reply
            </Button>
            {!isOwner ? (
              <Button variant="ghost" size="xs" onClick={handleHelpful}>
                Helpful ({comment.helpfulCount})
              </Button>
            ) : (
              <span className="text-xs text-muted-foreground">{comment.helpfulCount} found helpful</span>
            )}
          </div>
        ) : null}

        {replyOpen ? (
          <div className="mt-3 space-y-2">
            <Textarea
              value={replyBody}
              onChange={(e) => setReplyBody(e.target.value)}
              placeholder="Write a reply..."
              rows={3}
            />
            <div className="flex gap-2">
              <Button size="sm" onClick={handleReply} disabled={busy}>
                Post reply
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setReplyOpen(false)}>
                Cancel
              </Button>
            </div>
          </div>
        ) : null}
      </Card>

      {comment.replies.length > 0 ? (
        <div className="mt-3 space-y-3">
          {comment.replies.map((reply) => (
            <CommentNode
              key={reply.id}
              comment={reply}
              currentUserId={currentUserId}
              isModerator={isModerator}
              resourceId={resourceId}
              depth={depth + 1}
              onRefresh={onRefresh}
            />
          ))}
        </div>
      ) : null}
    </div>
  )
}

export function CommentThread({
  resourceId,
  currentUserId,
  isModerator,
}: {
  resourceId: string
  currentUserId: string
  isModerator: boolean
}) {
  const [comments, setComments] = useState<CommentWithAuthor[]>([])
  const [loading, setLoading] = useState(true)
  const [body, setBody] = useState('')
  const [posting, setPosting] = useState(false)

  async function loadComments() {
    setLoading(true)
    try {
      const res = await fetch(`/api/comments?resourceId=${resourceId}`)
      if (!res.ok) throw new Error('Failed')
      setComments(await res.json())
    } catch {
      toast.error('Unable to load comments')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadComments()
  }, [resourceId])

  async function handleSubmit() {
    if (!body.trim()) return
    setPosting(true)
    try {
      await createComment({ resourceId, body: body.trim() })
      setBody('')
      await loadComments()
      toast.success('Comment posted')
    } catch {
      toast.error('Unable to post comment')
    } finally {
      setPosting(false)
    }
  }

  return (
    <section className="space-y-5" aria-label="Discussion">
      <div className="flex items-center gap-2">
        <MessageSquare className="size-5 text-primary" aria-hidden="true" />
        <h2 className="text-lg font-semibold">Discussion</h2>
        <Badge variant="secondary">{comments.length} threads</Badge>
      </div>

      <Card className="rounded-2xl border-border/70 p-4 shadow-none">
        <Textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Share feedback, ask a question, or help classmates..."
          rows={4}
          aria-label="Write a comment"
        />
        <div className="mt-3 flex justify-end">
          <Button onClick={handleSubmit} disabled={posting || !body.trim()}>
            {posting ? <Loader2 className="size-4 animate-spin" /> : null}
            Post comment
          </Button>
        </div>
      </Card>

      {loading ? (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" />
          Loading discussion...
        </div>
      ) : comments.length === 0 ? (
        <Card className="rounded-2xl border-dashed p-8 text-center shadow-none">
          <p className="text-sm font-medium text-foreground">No comments yet</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Start the conversation — ask a question or share how this resource helped you.
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <CommentNode
              key={comment.id}
              comment={comment}
              currentUserId={currentUserId}
              isModerator={isModerator}
              resourceId={resourceId}
              depth={0}
              onRefresh={loadComments}
            />
          ))}
        </div>
      )}
    </section>
  )
}
