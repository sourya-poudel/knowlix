'use client'

import { useEffect, useState } from 'react'
import { Moon, SunMedium } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTheme } from 'next-themes'

export function ThemeToggle() {
  const { theme, resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const activeTheme = mounted ? resolvedTheme ?? theme : 'light'
  const isDark = activeTheme === 'dark'

  return (
    <Button
      className="relative overflow-hidden"
      variant="ghost"
      size="icon"
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
    >
      <SunMedium
        aria-hidden="true"
        className={`size-4 transition-all ${isDark ? 'scale-0 rotate-90 opacity-0' : 'scale-100 opacity-100'}`}
      />
      <Moon
        aria-hidden="true"
        className={`absolute size-4 transition-all ${isDark ? 'scale-100 opacity-100' : 'scale-0 -rotate-90 opacity-0'}`}
      />
    </Button>
  )
}