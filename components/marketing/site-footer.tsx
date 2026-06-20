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
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 md:grid-cols-[1.5fr_repeat(3,1fr)]">
          <div className="flex flex-col gap-4">
            <BrandLogo />
            <p className="max-w-xs text-pretty text-sm leading-relaxed text-muted-foreground">
              The verified knowledge library for students. Share, discover, and
              keep your campus&apos;s best work alive.
            </p>
          </div>

          {FOOTER_GROUPS.map((group) => (
            <div key={group.heading} className="flex flex-col gap-3">
              <h3 className="text-sm font-semibold text-foreground">
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

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-border pt-6 sm:flex-row">
          <p className="text-sm text-muted-foreground">
            {'\u00A9'} {new Date().getFullYear()} Knowlix. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground">
            Built for students, by students.
          </p>
        </div>
      </div>
    </footer>
  )
}
