import Link from 'next/link'
import { GraduationCap } from 'lucide-react'
import { cn } from '@/lib/utils'

export function BrandLogo({
  className,
  href = '/',
  showWordmark = true,
}: {
  className?: string
  href?: string
  showWordmark?: boolean
}) {
  return (
    <Link
      href={href}
      className={cn('inline-flex items-center gap-2', className)}
      aria-label="Knowlix home"
    >
      <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
        <GraduationCap className="size-5" aria-hidden="true" />
      </span>
      {showWordmark && (
        <span className="text-lg font-semibold tracking-tight text-foreground">
          Knowlix
        </span>
      )}
    </Link>
  )
}
