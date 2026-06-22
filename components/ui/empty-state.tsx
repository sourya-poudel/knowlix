import type { LucideIcon } from 'lucide-react'
import { Card } from '@/components/ui/card'

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: LucideIcon
  title: string
  description: string
  action?: React.ReactNode
}) {
  return (
    <Card className="flex flex-col items-center justify-center rounded-[1.75rem] border-dashed p-10 text-center shadow-none">
      <span className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <Icon className="size-7" aria-hidden="true" />
      </span>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">{description}</p>
      {action ? <div className="mt-5">{action}</div> : null}
    </Card>
  )
}
