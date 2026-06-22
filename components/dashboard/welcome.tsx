'use client'

import { useState } from 'react'
import { Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { reputationTier } from '@/lib/constants'
import { UploadResourceDialog } from '@/components/dashboard/upload-resource-dialog'

export function Welcome({
  name,
  institutionName,
  reputation,
}: {
  name: string
  institutionName: string
  reputation: number
}) {
  const firstName = name.split(' ')[0]
  const tier = reputationTier(reputation)
  const [isUploadOpen, setIsUploadOpen] = useState(false)

  return (
    <>
      <section className="grid gap-6 overflow-hidden rounded-3xl border border-border/70 bg-card/95 p-6 shadow-sm sm:grid-cols-[1.5fr_1fr] sm:items-center sm:p-8">
        <div className="flex flex-col gap-3">
          <span className="text-sm font-semibold uppercase tracking-[0.36em] text-primary/80">
            Student dashboard
          </span>
          <div className="space-y-3">
            <h1 className="text-3xl font-semibold tracking-tight text-card-foreground sm:text-4xl">
              Welcome back, {firstName}
            </h1>
            <p className="max-w-xl text-sm leading-6 text-muted-foreground sm:text-base">
              Review your uploaded resources, manage saved materials, and share new study content with your institution.
            </p>
          </div>
          <div className="grid gap-3 text-sm text-muted-foreground sm:grid-cols-2">
            <span>{institutionName}</span>
            <span className="inline-flex items-center gap-2">
              <Badge variant="secondary" className={tier.color}>
                {tier.label}
              </Badge>
              {reputation.toLocaleString()} reputation
            </span>
          </div>
          <Button size="lg" className="mt-4 w-full sm:w-auto" onClick={() => setIsUploadOpen(true)}>
            <Upload className="size-4" />
            Upload resource
          </Button>
        </div>
        <div className="rounded-[2rem] border border-border/70 bg-background/70 p-6 text-card-foreground shadow-sm">
          <div className="flex items-center gap-3 text-sm font-semibold text-primary">
            <Upload className="size-5" />
            Ready to share your research?
          </div>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            Use the button above to add notes, summaries, or study guides for your classmates.
          </p>
        </div>
      </section>
      <UploadResourceDialog open={isUploadOpen} onOpenChange={setIsUploadOpen} />
    </>
  )
}
