import Link from 'next/link'
import { BrandLogo } from '@/components/brand-logo'
import { AmbientBackdrop } from '@/components/ui/ambient-backdrop'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { ShieldCheck, Sparkles, Users2 } from 'lucide-react'

const HIGHLIGHTS = [
  'Verified students from 40+ institutions',
  'Thousands of trusted course resources',
  'Built to keep campus knowledge alive',
]

const TRUST_METRICS = [
  { label: 'Institution communities', value: '40+' },
  { label: 'Review-driven uploads', value: '24/7' },
  { label: 'Student trust score', value: '98%' },
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
    <div className="relative grid min-h-dvh overflow-hidden bg-background lg:grid-cols-[1.02fr_0.98fr]">
      {/* Brand panel */}
      <aside className="relative hidden overflow-hidden border-r border-border/60 bg-[linear-gradient(155deg,rgba(41,98,255,0.96),rgba(29,78,216,0.96)_48%,rgba(12,125,122,0.96))] p-12 text-primary-foreground lg:flex lg:flex-col lg:justify-between">
        <AmbientBackdrop className="opacity-80 mix-blend-screen" variant="panel" />
        <div className="relative z-10 flex items-center justify-between">
          <BrandLogo href="/" className="[&_span:last-child]:text-primary-foreground" />
          <Badge className="border-white/15 bg-white/10 text-white/90 backdrop-blur" variant="secondary">
            <Sparkles className="mr-1 size-3.5" />
            Verified network
          </Badge>
        </div>

        <div className="relative z-10 flex max-w-xl flex-col gap-7">
          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.5em] text-primary-foreground/70">
              Institutional access, modern interface
            </p>
            <h2 className="text-balance text-4xl font-semibold leading-tight tracking-tight xl:text-5xl">
              A sharper home for the knowledge your campus already creates.
            </h2>
            <p className="max-w-lg text-pretty text-base leading-7 text-primary-foreground/80">
              Knowlix keeps the academic flow professional: verified sign-in, trusted uploads, moderator review, and clean discovery all inside one refined workspace.
            </p>
          </div>

          <div className="grid gap-3">
            {HIGHLIGHTS.map((item) => (
              <div key={item} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/8 px-4 py-3 backdrop-blur-sm">
                <span className="flex size-8 items-center justify-center rounded-full bg-white/12 text-white">
                  <ShieldCheck className="size-4" />
                </span>
                <span className="text-sm font-medium text-primary-foreground/90">{item}</span>
              </div>
            ))}
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {TRUST_METRICS.map((metric) => (
              <Card key={metric.label} className="border-white/10 bg-white/10 p-4 text-primary-foreground backdrop-blur">
                <p className="text-2xl font-semibold tracking-tight">{metric.value}</p>
                <p className="mt-1 text-[0.68rem] uppercase tracking-[0.22em] text-primary-foreground/75">
                  {metric.label}
                </p>
              </Card>
            ))}
          </div>
        </div>

        <div className="relative z-10 flex items-center gap-3 text-sm text-primary-foreground/75">
          <Users2 className="size-4" />
          Built for students, moderators, and administrators.
        </div>
      </aside>

      {/* Form panel */}
      <main className="relative flex flex-col items-center justify-center px-4 py-10 sm:px-6 lg:px-10">
        <AmbientBackdrop className="lg:hidden opacity-60" variant="default" />
        <div className="relative z-10 flex w-full max-w-md flex-col gap-8 rounded-[2rem] border border-border/70 bg-card/85 p-6 shadow-[0_28px_90px_-60px_rgba(15,23,42,0.45)] backdrop-blur-xl sm:p-8">
          <div className="flex flex-col gap-2 lg:hidden">
            <BrandLogo href="/" />
          </div>
          <div className="flex flex-col gap-2">
            <Badge className="w-fit border-border/70 bg-background/80 text-muted-foreground" variant="secondary">
              Secure entry
            </Badge>
            <h1 className="text-3xl font-semibold tracking-tight text-foreground">
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
