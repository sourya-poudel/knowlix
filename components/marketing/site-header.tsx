'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet'
import { BrandLogo } from '@/components/brand-logo'
import { ThemeToggle } from '@/components/theme-toggle'

const NAV_LINKS = [
  { label: 'Features', href: '#features' },
  { label: 'How it works', href: '#how-it-works' },
  { label: 'Verification', href: '#verification' },
]

export function SiteHeader() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/70 bg-background/85 shadow-[0_12px_40px_-32px_rgba(15,23,42,0.45)] backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <BrandLogo />

        <nav className="hidden items-center gap-2 rounded-full border border-border/70 bg-background/75 px-2 py-1 md:flex" aria-label="Primary">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <ThemeToggle />
          <Button variant="ghost" render={<Link href="/login" />}>
            Log in
          </Button>
          <Button render={<Link href="/signup" />}>Get started</Button>
        </div>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger
            className="md:hidden"
            render={
              <Button variant="ghost" size="icon" aria-label="Open menu">
                <Menu className="size-5" />
              </Button>
            }
          />
          <SheetContent side="right" className="w-80 border-l border-border/70 bg-background/95 backdrop-blur-xl">
            <SheetTitle className="sr-only">Menu</SheetTitle>
            <div className="mt-2 flex flex-col gap-6">
              <BrandLogo />
              <div className="flex items-center justify-between rounded-2xl border border-border/70 bg-card px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-foreground">Appearance</p>
                  <p className="text-xs text-muted-foreground">Switch between light and dark modes</p>
                </div>
                <ThemeToggle />
              </div>
              <nav className="flex flex-col gap-1" aria-label="Mobile">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
              <div className="flex flex-col gap-2">
                <Button
                  variant="outline"
                  onClick={() => setOpen(false)}
                  render={<Link href="/login" />}
                >
                  Log in
                </Button>
                <Button
                  onClick={() => setOpen(false)}
                  render={<Link href="/signup" />}
                >
                  Get started
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
