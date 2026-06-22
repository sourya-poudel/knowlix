import Link from 'next/link'
import { BrandLogo } from '@/components/brand-logo'

const FOOTER_GROUPS = [
  {
    heading: 'Product',
    links: [
      { label: 'Features', href: '#features' },
      { label: 'How it works', href: '#how-it-works' },
      { label: 'Verification', href: '#verification' },
    ],
  },
  {
    heading: 'Account',
    links: [
      { label: 'Log in', href: '/login' },
      { label: 'Sign up', href: '/signup' },
      { label: 'Dashboard', href: '/dashboard' },
    ],
  },
  {
    heading: 'Company',
    links: [
      { label: 'About', href: '#' },
      { label: 'Privacy', href: '#' },
      { label: 'Terms', href: '#' },
    ],
  },
]

export function SiteFooter() {
  return (
    <footer className="border-t border-border/70 bg-background/70">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="rounded-[2rem] border border-border/70 bg-card/70 p-8 shadow-[0_24px_90px_-64px_rgba(15,23,42,0.4)] backdrop-blur-sm sm:p-10">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr]">
            <div className="flex flex-col gap-5">
              <BrandLogo />
              <p className="max-w-lg text-pretty text-sm leading-relaxed text-muted-foreground sm:text-base">
                The verified knowledge library for students. Share, discover, and keep your campus&apos;s best work alive with a design that feels more like a modern product than a university portal.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-3">
              {FOOTER_GROUPS.map((group) => (
                <div key={group.heading} className="flex flex-col gap-3">
                  <h3 className="text-sm font-semibold uppercase tracking-[0.24em] text-foreground">
                    {group.heading}
                  </h3>
                  <ul className="flex flex-col gap-2">
                    {group.links.map((link) => (
                      <li key={link.label}>
                        <Link
                          href={link.href}
                          className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 flex flex-col items-start justify-between gap-4 border-t border-border/70 pt-6 sm:flex-row sm:items-center">
            <p className="text-sm text-muted-foreground">
              {'\u00A9'} {new Date().getFullYear()} Knowlix. All rights reserved.
            </p>
            <p className="text-sm text-muted-foreground">
              Built for students, by students.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
