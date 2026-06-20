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
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {STATS.map((stat) => (
        <Card key={stat.key} className="border-border bg-background/70 shadow-sm shadow-slate-100/80 transition-all hover:-translate-y-0.5 hover:shadow-md">
          <CardContent className="flex items-center gap-4 p-5">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <stat.icon className="size-5" aria-hidden="true" />
            </span>
            <div className="flex flex-col">
              <span className="text-3xl font-semibold tracking-tight text-card-foreground">
                {stats[stat.key].toLocaleString()}
              </span>
              <span className="text-sm uppercase tracking-[0.24em] text-muted-foreground">
                {stat.label}
              </span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
