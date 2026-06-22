import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ResourceCard } from '@/components/dashboard/resource-card'
import type { MockResource } from '@/lib/mock-data'

export function ResourceSection({
  id,
  title,
  description,
  resources,
  showStatus = false,
  viewAllHref,
}: {
  id?: string
  title: string
  description: string
  resources: MockResource[]
  showStatus?: boolean
  viewAllHref?: string
}) {
  return (
    <section id={id} className="flex flex-col gap-5">
      <div className="flex items-end justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-semibold tracking-tight text-foreground">
            {title}
          </h2>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        {viewAllHref ? (
          <Button
            variant="ghost"
            size="sm"
            className="shrink-0"
            render={<Link href={viewAllHref} />}
          >
            View all
            <ArrowRight className="size-4" />
          </Button>
        ) : null}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {resources.map((resource) => (
          <ResourceCard
            key={resource.id}
            resource={resource}
            showStatus={showStatus}
          />
        ))}
      </div>
    </section>
  )
}
