'use client'

import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'

export function StarRatingDisplay({
  value,
  count,
  size = 'sm',
}: {
  value: number
  count?: number
  size?: 'sm' | 'md'
}) {
  const iconSize = size === 'md' ? 'size-5' : 'size-4'

  return (
    <div className="inline-flex items-center gap-1.5" aria-label={`Rated ${value.toFixed(1)} out of 5`}>
      <div className="inline-flex items-center gap-0.5">
        {Array.from({ length: 5 }).map((_, index) => {
          const filled = value >= index + 1
          const partial = !filled && value > index
          return (
            <Star
              key={index}
              className={cn(
                iconSize,
                filled || partial ? 'fill-chart-4 text-chart-4' : 'text-muted-foreground/40',
              )}
              aria-hidden="true"
            />
          )
        })}
      </div>
      <span className={cn('font-medium text-foreground', size === 'md' ? 'text-sm' : 'text-xs')}>
        {value > 0 ? value.toFixed(1) : '—'}
      </span>
      {count !== undefined ? (
        <span className="text-xs text-muted-foreground">({count.toLocaleString()})</span>
      ) : null}
    </div>
  )
}

export function StarRatingInput({
  value,
  onChange,
  disabled = false,
}: {
  value: number | null
  onChange: (value: number) => void
  disabled?: boolean
}) {
  return (
    <div className="inline-flex items-center gap-1" role="radiogroup" aria-label="Rate this resource">
      {Array.from({ length: 5 }).map((_, index) => {
        const starValue = index + 1
        const active = (value ?? 0) >= starValue
        return (
          <button
            key={starValue}
            type="button"
            disabled={disabled}
            aria-label={`Rate ${starValue} stars`}
            onClick={() => onChange(starValue)}
            className="rounded-full p-1 transition hover:scale-110 disabled:opacity-50"
          >
            <Star
              className={cn(
                'size-6',
                active ? 'fill-chart-4 text-chart-4' : 'text-muted-foreground/40 hover:text-chart-4',
              )}
            />
          </button>
        )
      })}
    </div>
  )
}
