import Link from 'next/link'
import { Compass, Bookmark, MessageSquarePlus } from 'lucide-react'
import { Card } from '@/components/ui/card'

const ACTIONS = [
  {
    title: 'Explore library',
    description: 'Browse uploaded and bookmarked resources',
    icon: Compass,
    href: '#uploads',
  },
  {
    title: 'Saved resources',
    description: 'Jump back into your bookmarked materials',
    icon: Bookmark,
    href: '#saved-resources',
  },
  {
    title: 'Request material',
    description: 'Ask classmates for study material you need',
    icon: MessageSquarePlus,
    href: '#request-material',
  },
]

export function QuickActions() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {ACTIONS.map((action) => (
        <Link key={action.title} href={action.href} className="group block rounded-3xl transition-all hover:-translate-y-0.5 hover:shadow-xl">
          <Card className="cursor-pointer p-6 transition-colors hover:border-primary/40 hover:bg-muted/40">
            <div className="flex items-center justify-between gap-4">
              <span className="flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <action.icon className="size-5" aria-hidden="true" />
              </span>
              <span className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                {action.title}
              </span>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              {action.description}
            </p>
          </Card>
        </Link>
      ))}
    </div>
  )
}
