import { Badge } from '@/components/ui/badge'
import { reputationTier } from '@/lib/constants'

export function ReputationBadge({ reputation }: { reputation: number }) {
  const tier = reputationTier(reputation)
  return (
    <Badge variant="secondary" className={tier.color}>
      {tier.label}
    </Badge>
  )
}
