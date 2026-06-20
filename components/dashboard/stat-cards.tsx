import { Upload, Bookmark, Download, ThumbsUp } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { DASHBOARD_STATS } from '@/lib/mock-data'

const STATS = [
  { key: 'uploads', label: 'My uploads', value: DASHBOARD_STATS.uploads, icon: Upload },
  { key: 'saved', label: 'Saved', value: DASHBOARD_STATS.saved, icon: Bookmark },
  { key: 'downloads', label: 'Downloads', value: DASHBOARD_STATS.downloads, icon: Download },
  { key: 'upvotes', label: 'Upvotes earned', value: DASHBOARD_STATS.upvotes, icon: ThumbsUp },
] as const

export function StatCards() {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {STATS.map((stat) => (
        <Card key={stat.key}>
          <CardContent className="flex items-center gap-4">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <stat.icon className="size-5" aria-hidden="true" />
            </span>
            <div className="flex flex-col">
              <span className="text-2xl font-semibold tracking-tight text-card-foreground">
                {stat.value.toLocaleString()}
              </span>
              <span className="text-sm text-muted-foreground">{stat.label}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
