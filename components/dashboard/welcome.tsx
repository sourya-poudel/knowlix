import { Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { reputationTier } from '@/lib/constants'

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

  return (
    <section className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold tracking-tight text-card-foreground sm:text-3xl">
          Welcome back, {firstName}
        </h1>
        <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <span>{institutionName}</span>
          <span aria-hidden="true">{'\u00B7'}</span>
          <Badge variant="secondary" className={tier.color}>
            {tier.label}
          </Badge>
          <span>{reputation.toLocaleString()} reputation</span>
        </div>
      </div>
      <Button size="lg" className="w-full sm:w-auto">
        <Upload className="size-4" />
        Upload resource
      </Button>
    </section>
  )
}
