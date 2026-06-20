import { Upload, Compass, Bookmark, MessageSquarePlus } from 'lucide-react'
import { Card } from '@/components/ui/card'

const ACTIONS = [
  {
    title: 'Upload a resource',
    description: 'Share your notes with your campus',
    icon: Upload,
  },
  {
    title: 'Explore library',
    description: 'Browse resources by course',
    icon: Compass,
  },
  {
    title: 'Saved resources',
    description: 'Jump back into your bookmarks',
    icon: Bookmark,
  },
  {
    title: 'Request material',
    description: 'Ask classmates for what you need',
    icon: MessageSquarePlus,
  },
]

export function QuickActions() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {ACTIONS.map((action) => (
        <Card
          key={action.title}
          className="group cursor-pointer p-5 transition-colors hover:border-primary/40 hover:bg-muted/40"
        >
          <span className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
            <action.icon className="size-5" aria-hidden="true" />
          </span>
          <div className="mt-4 flex flex-col gap-1">
            <h3 className="font-semibold text-card-foreground">{action.title}</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {action.description}
            </p>
          </div>
        </Card>
      ))}
    </div>
  )
}
