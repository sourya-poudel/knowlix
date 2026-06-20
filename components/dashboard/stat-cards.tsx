import { Upload, Bookmark, Download, ThumbsUp } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

const STATS = [
  { key: 'uploads', label: 'My uploads', icon: Upload },
  { key: 'saved', label: 'Saved', icon: Bookmark },
  { key: 'downloads', label: 'Downloads', icon: Download },
  { key: 'upvotes', label: 'Upvotes earned', icon: ThumbsUp },
] as const

export function StatCards({ stats }: { stats: { uploads: number; saved: number; downloads: number; upvotes: number } }) {
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
                {stats[stat.key].toLocaleString()}
              </span>
              <span className="text-sm text-muted-foreground">{stat.label}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
