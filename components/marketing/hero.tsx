import Link from 'next/link'
import { ArrowRight, BarChart3, BookOpen, ShieldCheck, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_color-mix(in_oklch,var(--primary)_12%,transparent),_transparent_36%),radial-gradient(circle_at_85%_12%,_color-mix(in_oklch,var(--accent)_12%,transparent),_transparent_32%)]" />
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 md:py-24 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <div className="flex flex-col gap-7">
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-border/80 bg-background/70 px-4 py-2 text-xs font-medium text-muted-foreground shadow-sm backdrop-blur-sm">
            <ShieldCheck className="size-3.5 text-primary" />
            Verified academic community
          </span>

          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.42em] text-muted-foreground">
              Academic resources, preserved
            </p>
            <h1 className="max-w-3xl text-balance text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              A professional library for your campus knowledge
            </h1>
            <p className="max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground">
              Knowlix helps students and moderators organize notes, past questions, and study guides inside a verified institution network. The result is a clean, trusted archive built for serious academic use.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button size="lg" render={<Link href="/signup" />}>
              Join your campus
              <ArrowRight className="size-4" />
            </Button>
            <Button size="lg" variant="outline" render={<Link href="#how-it-works" />}>
              See how it works
            </Button>
          </div>

          <div className="grid gap-3 pt-2 sm:grid-cols-3">
            {[
              ['40+', 'Verified institutions'],
              ['24h', 'Average moderation cycle'],
              ['10k+', 'Student uploads preserved'],
            ].map(([value, label]) => (
              <div
                key={label}
                className="rounded-2xl border border-border/70 bg-background/80 p-4 shadow-sm backdrop-blur-sm"
              >
                <div className="text-2xl font-semibold tracking-tight text-foreground">{value}</div>
                <div className="mt-1 text-sm text-muted-foreground">{label}</div>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-0.5 text-chart-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="size-4 fill-current" aria-hidden="true" />
              ))}
            </div>
            <span>Built for campuses that want a serious, trustworthy archive</span>
          </div>
        </div>

        <div className="relative">
          <div className="absolute inset-0 translate-x-10 translate-y-10 rounded-[2.5rem] bg-primary/10 blur-3xl" />
          <Card className="relative overflow-hidden rounded-[2rem] border-border/80 bg-card/85 p-5 shadow-[0_40px_120px_-60px_rgba(15,23,42,0.45)] backdrop-blur">
            <div className="grid gap-4">
              <div className="rounded-[1.5rem] border border-border/70 bg-background/80 p-4 shadow-sm">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.28em] text-muted-foreground">
                      Campus overview
                    </p>
                    <p className="mt-1 text-lg font-semibold text-foreground">Shared knowledge, organized</p>
                  </div>
                  <BarChart3 className="size-5 text-primary" aria-hidden="true" />
                </div>
                <div className="mt-4 grid grid-cols-3 gap-3 text-sm">
                  <div className="rounded-2xl bg-muted/70 p-3">
                    <div className="font-semibold text-foreground">128</div>
                    <div className="text-muted-foreground">Uploads</div>
                  </div>
                  <div className="rounded-2xl bg-muted/70 p-3">
                    <div className="font-semibold text-foreground">4.8/5</div>
                    <div className="text-muted-foreground">Avg rating</div>
                  </div>
                  <div className="rounded-2xl bg-muted/70 p-3">
                    <div className="font-semibold text-foreground">92%</div>
                    <div className="text-muted-foreground">Approved</div>
                  </div>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-[1.5rem] border border-border/70 bg-background/80 p-4 shadow-sm">
                  <BookOpen className="size-5 text-primary" aria-hidden="true" />
                  <p className="mt-3 text-sm font-semibold text-foreground">Curated study sets</p>
                  <p className="mt-1 text-sm text-muted-foreground">Collections for board prep, exam revision, and shared notes.</p>
                </div>
                <div className="rounded-[1.5rem] border border-border/70 bg-background/80 p-4 shadow-sm">
                  <ShieldCheck className="size-5 text-primary" aria-hidden="true" />
                  <p className="mt-3 text-sm font-semibold text-foreground">Moderator review</p>
                  <p className="mt-1 text-sm text-muted-foreground">Reliable approvals keep the archive useful and credible.</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  )
}
