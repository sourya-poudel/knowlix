'use client'

import { useEffect, useState } from 'react'
import { BrandLogo } from '@/components/brand-logo'

const SPLASH_KEY = 'knowlix-splash-shown'

export function InitialSplash() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const seen = sessionStorage.getItem(SPLASH_KEY)
    if (seen) return

    setVisible(true)
    sessionStorage.setItem(SPLASH_KEY, '1')

    const timeout = window.setTimeout(() => setVisible(false), 350)
    return () => window.clearTimeout(timeout)
  }, [])

  if (!visible) return null

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 z-[100] flex items-center justify-center bg-background/90 backdrop-blur-sm"
    >
      <div className="flex flex-col items-center gap-4">
        <BrandLogo showWordmark={false} />
        <div className="h-1 w-24 overflow-hidden rounded-full bg-muted">
          <div className="knowlix-loading-bar h-full w-1/2 rounded-full bg-primary" />
        </div>
      </div>
    </div>
  )
}
