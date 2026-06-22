import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, ShieldCheck, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_color-mix(in_oklch,var(--primary)_18%,transparent),_transparent_34%),radial-gradient(circle_at_85%_12%,_color-mix(in_oklch,var(--accent)_18%,transparent),_transparent_30%)]" />
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 md:py-24 lg:grid-cols-[1.02fr_0.98fr] lg:items-center">
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
              A polished home for the knowledge your campus keeps creating
            </h1>
            <p className="max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground">
              Knowlix helps students share notes, past questions, and study guides inside a verified institution network. Upload once, approve responsibly, and keep the best work alive for the next batch.
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
                className="rounded-2xl border border-border/70 bg-background/75 p-4 shadow-sm backdrop-blur-sm"
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
          <div className="absolute inset-0 translate-x-10 translate-y-10 rounded-[2.5rem] bg-primary/15 blur-3xl" />
          <div className="relative overflow-hidden rounded-[2rem] border border-border/80 bg-card/75 p-3 shadow-[0_40px_120px_-60px_rgba(15,23,42,0.45)] backdrop-blur">
            <div className="relative aspect-[4/3] overflow-hidden rounded-[1.5rem] bg-muted">
              <Image
                src="/images/hero-students.png"
                alt="University students collaborating over study notes in a library"
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>

            <div className="absolute left-5 top-5 rounded-2xl border border-border/70 bg-background/90 px-4 py-3 shadow-lg backdrop-blur-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-muted-foreground">
                Pending review
              </p>
              <p className="mt-1 text-sm font-medium text-foreground">Moderator-approved workflow</p>
            </div>

            <div className="absolute bottom-5 right-5 rounded-2xl border border-border/70 bg-background/90 px-4 py-3 shadow-lg backdrop-blur-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-muted-foreground">
                Discovery
              </p>
              <p className="mt-1 text-sm font-medium text-foreground">Searchable by course, batch, and type</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
