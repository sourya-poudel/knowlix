'use client'

import { useEffect, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Loader2, Search } from 'lucide-react'
import { toast } from 'sonner'

type AuditItem = {
  id: string
  actorId: string
  actorRole: string
  actorName: string | null
  action: string
  entityType: string
  entityId: string | null
  targetInstitutionId: string | null
  metadata: Record<string, unknown> | null
  createdAt: string
}

export function AuditLogPanel() {
  const [items, setItems] = useState<AuditItem[]>([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')

  async function loadLogs(search = query) {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (search.trim()) params.set('q', search.trim())
      const res = await fetch(`/api/admin/audit?${params.toString()}`)
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'Unable to load audit logs')
      setItems(data)
    } catch {
      toast.error('Unable to load audit logs')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadLogs()
  }, [])

  return (
    <div className="space-y-6">
      <Card className="rounded-[1.75rem] border-border/70 p-6 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold">Audit logs</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Track moderator and admin actions across the platform.
            </p>
          </div>
          <Badge variant="secondary">{items.length} events</Badge>
        </div>

        <div className="mt-4 flex gap-2">
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search actions or entity types" />
          <Button variant="outline" onClick={() => loadLogs(query)}>
            <Search className="size-4" />
            Search
          </Button>
        </div>
      </Card>

      {loading ? (
        <div className="flex items-center gap-2 rounded-2xl border border-dashed p-6 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" />
          Loading audit logs...
        </div>
      ) : (
        <div className="space-y-3">
          {items.length === 0 ? (
            <Card className="rounded-[1.75rem] border-dashed p-8 text-center text-sm text-muted-foreground shadow-none">
              No audit entries yet.
            </Card>
          ) : (
            items.map((item) => (
              <Card key={item.id} className="rounded-[1.5rem] border-border/70 p-5 shadow-sm">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="font-semibold text-foreground">{item.action}</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {item.actorName ?? item.actorId} · {item.actorRole} · {item.entityType}
                      {item.entityId ? ` · ${item.entityId}` : ''}
                    </p>
                  </div>
                  <p className="text-xs text-muted-foreground">{new Date(item.createdAt).toLocaleString()}</p>
                </div>
                {item.metadata ? (
                  <pre className="mt-3 overflow-auto rounded-2xl bg-muted/60 p-3 text-xs text-muted-foreground">
                    {JSON.stringify(item.metadata, null, 2)}
                  </pre>
                ) : null}
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  )
}