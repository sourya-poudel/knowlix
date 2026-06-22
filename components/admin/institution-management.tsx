'use client'

import { useEffect, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { EmptyState } from '@/components/ui/empty-state'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Building2, CheckCircle2, Loader2, PencilLine, Power, PowerOff, Plus, Search } from 'lucide-react'
import { toast } from 'sonner'

type InstitutionItem = {
  id: string
  name: string
  slug: string
  domain: string
  logo: string | null
  description: string | null
  bannerImage: string | null
  domainRestrictions: string[]
  isApproved: boolean
  isActive: boolean
  memberCount: number
  resourceCount: number
  approvedAt: string | null
  disabledAt: string | null
  createdAt: string
}

const emptyForm = {
  name: '',
  slug: '',
  domain: '',
  description: '',
  logo: '',
  bannerImage: '',
  domainRestrictions: '',
}

export function InstitutionManagement() {
  const [items, setItems] = useState<InstitutionItem[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [query, setQuery] = useState('')
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState<string | null>(null)

  async function loadInstitutions(search = query) {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (search.trim()) params.set('q', search.trim())
      const res = await fetch(`/api/admin/institutions?${params.toString()}`)
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'Unable to load institutions')
      setItems(data)
    } catch {
      toast.error('Unable to load institutions')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadInstitutions()
  }, [])

  function startEdit(item: InstitutionItem) {
    setEditingId(item.id)
    setForm({
      name: item.name,
      slug: item.slug,
      domain: item.domain,
      description: item.description ?? '',
      logo: item.logo ?? '',
      bannerImage: item.bannerImage ?? '',
      domainRestrictions: item.domainRestrictions.join(', '),
    })
  }

  function resetForm() {
    setEditingId(null)
    setForm(emptyForm)
  }

  async function handleSubmit() {
    if (!form.name.trim() || !form.slug.trim() || !form.domain.trim()) {
      toast.error('Name, slug, and domain are required')
      return
    }

    setSaving(true)
    try {
      const payload = {
        ...form,
        name: form.name.trim(),
        slug: form.slug.trim(),
        domain: form.domain.trim(),
        description: form.description.trim() || undefined,
        logo: form.logo.trim() || undefined,
        bannerImage: form.bannerImage.trim() || undefined,
        domainRestrictions: form.domainRestrictions
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean),
      }

      const res = await fetch(editingId ? `/api/admin/institutions/${editingId}` : '/api/admin/institutions', {
        method: editingId ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'Unable to save institution')
      toast.success(editingId ? 'Institution updated' : 'Institution created')
      resetForm()
      await loadInstitutions()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to save institution')
    } finally {
      setSaving(false)
    }
  }

  async function handleAction(id: string, action: 'approve' | 'disable' | 'enable') {
    try {
      const res = await fetch(`/api/admin/institutions/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'Unable to update institution')
      toast.success(`Institution ${action}d`)
      await loadInstitutions()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to update institution')
    }
  }

  return (
    <div className="space-y-6">
      <Card className="rounded-[1.75rem] border-border/70 p-6 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold">Institution management</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Create, approve, disable, and update institutions across the platform.
            </p>
          </div>
          <Badge variant="secondary">{items.length} institutions</Badge>
        </div>

        <div className="mt-4 flex gap-2">
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search institutions" />
          <Button
            variant="outline"
            onClick={() => loadInstitutions(query)}
          >
            <Search className="size-4" />
            Search
          </Button>
        </div>

        <div className="mt-6 grid gap-3 lg:grid-cols-2">
          <Input value={form.name} onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))} placeholder="Name" />
          <Input value={form.slug} onChange={(e) => setForm((prev) => ({ ...prev, slug: e.target.value }))} placeholder="Slug" />
          <Input value={form.domain} onChange={(e) => setForm((prev) => ({ ...prev, domain: e.target.value }))} placeholder="Domain" />
          <Input
            value={form.logo}
            onChange={(e) => setForm((prev) => ({ ...prev, logo: e.target.value }))}
            placeholder="Logo URL"
          />
          <Input
            value={form.bannerImage}
            onChange={(e) => setForm((prev) => ({ ...prev, bannerImage: e.target.value }))}
            placeholder="Banner image URL"
          />
          <Input
            value={form.domainRestrictions}
            onChange={(e) => setForm((prev) => ({ ...prev, domainRestrictions: e.target.value }))}
            placeholder="Domain restrictions, comma separated"
          />
          <div className="lg:col-span-2">
            <Textarea
              value={form.description}
              onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="Institution description"
              rows={3}
            />
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <Button onClick={handleSubmit} disabled={saving}>
            {saving ? <Loader2 className="size-4 animate-spin" /> : editingId ? <PencilLine className="size-4" /> : <Plus className="size-4" />}
            {editingId ? 'Save institution' : 'Create institution'}
          </Button>
          {editingId ? (
            <Button variant="ghost" onClick={resetForm}>Cancel edit</Button>
          ) : null}
        </div>
      </Card>

      {loading ? (
        <div className="flex items-center gap-2 rounded-2xl border border-dashed p-6 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" />
          Loading institutions...
        </div>
      ) : items.length === 0 ? (
        <EmptyState
          icon={Building2}
          title="No institutions found"
          description="Create the first institution or adjust your search filters."
        />
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {items.map((item) => (
            <Card key={item.id} className="rounded-[1.5rem] border-border/70 p-5 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-semibold text-lg">{item.name}</h3>
                  <p className="text-sm text-muted-foreground">{item.slug} · {item.domain}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge variant={item.isApproved ? 'secondary' : 'outline'}>{item.isApproved ? 'Approved' : 'Pending'}</Badge>
                  <Badge variant={item.isActive ? 'secondary' : 'destructive'}>{item.isActive ? 'Active' : 'Disabled'}</Badge>
                </div>
              </div>

              {item.description ? <p className="mt-3 text-sm text-muted-foreground">{item.description}</p> : null}
              <div className="mt-4 grid grid-cols-3 gap-3 text-sm">
                <div className="rounded-2xl bg-muted/50 p-3">
                  <p className="text-xs text-muted-foreground">Members</p>
                  <p className="text-lg font-semibold">{item.memberCount}</p>
                </div>
                <div className="rounded-2xl bg-muted/50 p-3">
                  <p className="text-xs text-muted-foreground">Resources</p>
                  <p className="text-lg font-semibold">{item.resourceCount}</p>
                </div>
                <div className="rounded-2xl bg-muted/50 p-3">
                  <p className="text-xs text-muted-foreground">Domains</p>
                  <p className="text-lg font-semibold">{item.domainRestrictions.length}</p>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <Button variant="outline" size="sm" onClick={() => startEdit(item)}>
                  <PencilLine className="size-4" />
                  Edit
                </Button>
                {!item.isApproved ? (
                  <Button size="sm" onClick={() => handleAction(item.id, 'approve')}>
                    <CheckCircle2 className="size-4" />
                    Approve
                  </Button>
                ) : null}
                <Button
                  size="sm"
                  variant={item.isActive ? 'destructive' : 'secondary'}
                  onClick={() => handleAction(item.id, item.isActive ? 'disable' : 'enable')}
                >
                  {item.isActive ? <PowerOff className="size-4" /> : <Power className="size-4" />}
                  {item.isActive ? 'Disable' : 'Enable'}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}