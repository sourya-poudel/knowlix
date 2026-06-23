import Link from 'next/link'
import { Suspense } from 'react'
import { BrandLogo } from '@/components/brand-logo'
import { ShieldCheck } from 'lucide-react'

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
    <div className="grid min-h-dvh bg-background lg:grid-cols-2">
      <aside className="relative hidden flex-col justify-between overflow-hidden bg-primary p-10 text-primary-foreground lg:flex">
        <div className="absolute inset-0 bg-[linear-gradient(145deg,rgba(255,255,255,0.08),transparent_55%)]" />
        <div className="relative z-10">
          <BrandLogo href="/" className="[&_span:last-child]:text-primary-foreground" />
        </div>

        <div className="relative z-10 max-w-md space-y-5">
          <p className="text-xs font-medium uppercase tracking-[0.35em] text-primary-foreground/70">
            Campus knowledge platform
          </p>
          <h2 className="text-balance text-3xl font-semibold leading-tight tracking-tight xl:text-4xl">
            Verified resources, trusted by your institution.
          </h2>
          <p className="text-pretty text-sm leading-7 text-primary-foreground/80">
            Sign in to upload, discover, and share course materials with students and moderators
            across your campus.
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-2 text-sm text-primary-foreground/75">
          <ShieldCheck className="size-4" />
          Secure, institution-verified access
        </div>
      </aside>

      <main className="flex flex-col items-center justify-center px-4 py-10 sm:px-8">
        <div className="flex w-full max-w-[420px] flex-col gap-8">
          <div className="flex flex-col gap-2 lg:hidden">
            <BrandLogo href="/" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              {title}
            </h1>
            <p className="text-sm leading-relaxed text-muted-foreground">{subtitle}</p>
          </div>

          {children}

          <p className="text-center text-sm text-muted-foreground">
            <Link href="/" className="transition-colors duration-150 hover:text-foreground">
              ← Back to home
            </Link>
          </p>
        </div>
      </main>
    </div>
  )
}
