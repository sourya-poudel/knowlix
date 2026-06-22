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
      <span className="flex size-9 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,var(--primary),var(--accent))] text-primary-foreground shadow-[0_12px_30px_-16px_rgba(37,99,235,0.55)] ring-1 ring-white/15">
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
