'use client'

import { useEffect, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { EmptyState } from '@/components/ui/empty-state'
import { Input } from '@/components/ui/input'
import { Loader2, RefreshCw, Shield, ShieldOff, Search, UserX, UserCheck } from 'lucide-react'
import { toast } from 'sonner'

type AdminUser = {
  id: string
  name: string
  email: string
  role: string
  status: string
  bio: string | null
  reputation: number
  institutionId: string | null
  createdAt: string
  suspendedReason: string | null
  suspendedAt: string | null
  uploadCount: number
  commentCount: number
  lastActiveAt: string | null
}

export function UserManagement() {
  const [items, setItems] = useState<AdminUser[]>([])
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [busyId, setBusyId] = useState<string | null>(null)

  async function loadUsers(search = query) {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (search.trim()) params.set('q', search.trim())
      const res = await fetch(`/api/admin/users?${params.toString()}`)
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'Unable to load users')
      setItems(data)
    } catch {
      toast.error('Unable to load users')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadUsers()
  }, [])

  async function handleAction(userId: string, action: string) {
    const reason = action === 'suspend' ? window.prompt('Optional suspension reason') ?? undefined : undefined
    setBusyId(userId)
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, action, reason }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'Unable to update user')
      toast.success('User updated')
      await loadUsers()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to update user')
    } finally {
      setBusyId(null)
    }
  }

  return (
    <div className="space-y-6">
      <Card className="rounded-[1.75rem] border-border/70 p-6 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold">User management</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Search users, promote moderators, suspend accounts, and review contribution signals.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => loadUsers()}>
              <RefreshCw className="size-4" />
              Refresh
            </Button>
            <Badge variant="secondary">{items.length} users</Badge>
          </div>
        </div>

        <div className="mt-4 flex gap-2">
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search users by name or email" />
          <Button variant="outline" onClick={() => loadUsers(query)}>
            <Search className="size-4" />
            Search
          </Button>
        </div>
      </Card>

      {loading ? (
        <div className="flex items-center gap-2 rounded-2xl border border-dashed p-6 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" />
          Loading users...
        </div>
      ) : items.length === 0 ? (
        <EmptyState
          icon={Shield}
          title="No users found"
          description="Try a broader search query or adjust the current filters."
        />
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {items.map((item) => (
            <Card key={item.id} className="rounded-[1.5rem] border-border/70 p-5 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-semibold text-lg">{item.name}</h3>
                  <p className="text-sm text-muted-foreground">{item.email}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge variant={item.role === 'admin' ? 'default' : 'secondary'}>{item.role}</Badge>
                  <Badge variant={item.status === 'active' ? 'secondary' : 'destructive'}>{item.status}</Badge>
                </div>
              </div>

              {item.bio ? <p className="mt-3 text-sm text-muted-foreground">{item.bio}</p> : null}

              <div className="mt-4 grid grid-cols-3 gap-3 text-sm">
                <div className="rounded-2xl bg-muted/50 p-3">
                  <p className="text-xs text-muted-foreground">Uploads</p>
                  <p className="text-lg font-semibold">{item.uploadCount}</p>
                </div>
                <div className="rounded-2xl bg-muted/50 p-3">
                  <p className="text-xs text-muted-foreground">Comments</p>
                  <p className="text-lg font-semibold">{item.commentCount}</p>
                </div>
                <div className="rounded-2xl bg-muted/50 p-3">
                  <p className="text-xs text-muted-foreground">Reputation</p>
                  <p className="text-lg font-semibold">{item.reputation}</p>
                </div>
              </div>

              <div className="mt-3 text-xs text-muted-foreground">
                Institution: {item.institutionId ?? 'Unassigned'}
                {item.lastActiveAt ? ` · Last active ${new Date(item.lastActiveAt).toLocaleDateString()}` : ''}
              </div>

              {item.status === 'suspended' && item.suspendedReason ? (
                <p className="mt-2 rounded-2xl bg-destructive/5 p-3 text-sm text-muted-foreground">
                  Suspended: {item.suspendedReason}
                </p>
              ) : null}

              <div className="mt-4 flex flex-wrap gap-2">
                {item.role === 'moderator' ? (
                  <Button variant="outline" size="sm" onClick={() => handleAction(item.id, 'removeModerator')} disabled={busyId === item.id}>
                    <ShieldOff className="size-4" />
                    Remove moderator
                  </Button>
                ) : (
                  <Button variant="outline" size="sm" onClick={() => handleAction(item.id, 'promoteModerator')} disabled={busyId === item.id}>
                    <Shield className="size-4" />
                    Promote moderator
                  </Button>
                )}

                {item.status === 'active' ? (
                  <Button variant="destructive" size="sm" onClick={() => handleAction(item.id, 'suspend')} disabled={busyId === item.id}>
                    <UserX className="size-4" />
                    Suspend
                  </Button>
                ) : (
                  <Button variant="secondary" size="sm" onClick={() => handleAction(item.id, 'reinstate')} disabled={busyId === item.id}>
                    <UserCheck className="size-4" />
                    Reinstate
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}