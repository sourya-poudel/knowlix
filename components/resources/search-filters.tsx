'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Search, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { RESOURCE_TYPES } from '@/lib/constants'

export function ResourceSearchFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const q = searchParams.get('q') ?? ''
  const type = searchParams.get('type') ?? ''
  const subject = searchParams.get('subject') ?? ''
  const year = searchParams.get('year') ?? ''
  const tag = searchParams.get('tag') ?? ''
  const contributor = searchParams.get('contributor') ?? ''

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (value) params.set(key, value)
    else params.delete(key)
    router.push(`/resources?${params.toString()}`)
  }

  function clearFilters() {
    router.push('/resources')
  }

  const hasFilters = q || type || subject || year || tag || contributor

  return (
    <div className="rounded-[1.75rem] border border-border/70 bg-card/85 p-5 shadow-sm backdrop-blur-sm">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Search className="size-4 text-primary" aria-hidden="true" />
          <h2 className="text-sm font-semibold uppercase tracking-[0.24em] text-muted-foreground">
            Advanced search
          </h2>
        </div>
        {hasFilters ? (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            <X className="size-4" />
            Clear
          </Button>
        ) : null}
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <div className="space-y-2 md:col-span-2 xl:col-span-3">
          <Label htmlFor="search-q">Keywords</Label>
          <Input
            id="search-q"
            defaultValue={q}
            placeholder="Search title, course, description..."
            onKeyDown={(e) => {
              if (e.key === 'Enter') updateParam('q', (e.target as HTMLInputElement).value)
            }}
          />
        </div>

        <div className="space-y-2">
          <Label>Resource type</Label>
          <Select value={type || 'all'} onValueChange={(value) => updateParam('type', value === 'all' || !value ? '' : value)}>
            <SelectTrigger>
              <SelectValue placeholder="All types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All types</SelectItem>
              {RESOURCE_TYPES.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="search-subject">Subject / course</Label>
          <Input
            id="search-subject"
            defaultValue={subject}
            placeholder="e.g. Physics, MATH 51"
            onKeyDown={(e) => {
              if (e.key === 'Enter') updateParam('subject', (e.target as HTMLInputElement).value)
            }}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="search-year">Academic year</Label>
          <Input
            id="search-year"
            defaultValue={year}
            placeholder="e.g. 2080"
            inputMode="numeric"
            onKeyDown={(e) => {
              if (e.key === 'Enter') updateParam('year', (e.target as HTMLInputElement).value)
            }}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="search-tag">Tag</Label>
          <Input
            id="search-tag"
            defaultValue={tag}
            placeholder="e.g. board-prep"
            onKeyDown={(e) => {
              if (e.key === 'Enter') updateParam('tag', (e.target as HTMLInputElement).value)
            }}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="search-contributor">Contributor ID</Label>
          <Input
            id="search-contributor"
            defaultValue={contributor}
            placeholder="User profile ID"
            onKeyDown={(e) => {
              if (e.key === 'Enter') updateParam('contributor', (e.target as HTMLInputElement).value)
            }}
          />
        </div>
      </div>
    </div>
  )
}
