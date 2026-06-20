import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ResourceCard } from '@/components/dashboard/resource-card'
import type { MockResource } from '@/lib/mock-data'

export function ResourceSection({
  title,
  description,
  resources,
  showStatus = false,
}: {
  title: string
  description: string
  resources: MockResource[]
  showStatus?: boolean
}) {
  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-end justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-semibold tracking-tight text-foreground">
            {title}
          </h2>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        <Button variant="ghost" size="sm" className="shrink-0">
          View all
          <ArrowRight className="size-4" />
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
