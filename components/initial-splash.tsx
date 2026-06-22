'use client'

import { useEffect, useState } from 'react'
import { BrandLogo } from '@/components/brand-logo'

export function InitialSplash() {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const timeout = window.setTimeout(() => setVisible(false), 900)
    return () => window.clearTimeout(timeout)
  }, [])

  if (!visible) return null

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 z-[100] flex items-center justify-center bg-background/95 px-4 backdrop-blur-xl"
    >
      <div className="relative w-full max-w-sm overflow-hidden rounded-[2rem] border border-border/70 bg-card/95 p-7 text-center shadow-[0_30px_90px_-45px_rgba(15,23,42,0.45)]">
        <div className="absolute inset-x-0 top-0 h-1 bg-[linear-gradient(90deg,var(--primary),var(--accent),var(--primary))]" />
        <div className="mx-auto flex w-fit items-center justify-center">
          <div className="relative flex size-20 items-center justify-center rounded-full border border-border/70 bg-background/85">
            <div className="absolute inset-0 rounded-full border border-primary/15" />
            <div className="absolute inset-1.5 animate-spin rounded-full border border-transparent border-t-primary border-r-accent [animation-duration:1.6s]" />
            <div className="absolute inset-4 animate-pulse rounded-full bg-primary/10" />
            <div className="relative z-10 scale-110">
              <BrandLogo showWordmark={false} />
            </div>
          </div>
        </div>

        <h1 className="mt-5 text-xl font-semibold tracking-tight text-foreground">Loading Knowlix</h1>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Preparing your campus workspace.
        </p>

        <div className="mt-5 overflow-hidden rounded-full bg-muted/70 p-1">
          <div className="knowlix-loading-bar h-1.5 rounded-full bg-[linear-gradient(90deg,var(--primary),var(--accent))]" />
        </div>
      </div>
    </div>
  )
}