import Link from 'next/link'
import { BrandLogo } from '@/components/brand-logo'

const HIGHLIGHTS = [
  'Verified students from 40+ institutions',
  'Thousands of trusted course resources',
  'Built to keep campus knowledge alive',
]

export function AuthShell({
  children,
  title,
  subtitle,
}: {
  children: React.ReactNode
  title: string
  subtitle: string
}) {
  return (
    <div className="grid min-h-dvh lg:grid-cols-2">
      {/* Brand panel */}
      <aside className="relative hidden flex-col justify-between bg-primary p-12 text-primary-foreground lg:flex">
        <BrandLogo href="/" className="[&_span:last-child]:text-primary-foreground" />
        <div className="flex flex-col gap-6">
          <h2 className="text-balance text-3xl font-semibold leading-tight tracking-tight">
            The knowledge your campus already has, in one trusted place.
          </h2>
          <ul className="flex flex-col gap-3">
            {HIGHLIGHTS.map((item) => (
              <li key={item} className="flex items-center gap-3 text-primary-foreground/85">
                <span className="size-1.5 rounded-full bg-primary-foreground/70" aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
        </div>
        <p className="text-sm text-primary-foreground/70">
          {'\u00A9'} {new Date().getFullYear()} Knowlix
        </p>
      </aside>

      {/* Form panel */}
      <main className="flex flex-col items-center justify-center px-4 py-10 sm:px-6">
        <div className="flex w-full max-w-sm flex-col gap-8">
          <div className="flex flex-col gap-2 lg:hidden">
            <BrandLogo href="/" />
          </div>
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              {title}
            </h1>
            <p className="text-pretty leading-relaxed text-muted-foreground">
              {subtitle}
            </p>
          </div>
          {children}
          <p className="text-center text-sm text-muted-foreground">
            <Link href="/" className="transition-colors hover:text-foreground">
              {'\u2190'} Back to home
            </Link>
          </p>
        </div>
      </main>
    </div>
  )
}
