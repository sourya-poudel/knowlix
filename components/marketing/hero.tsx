import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, ShieldCheck, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto grid max-w-6xl gap-12 px-4 py-16 sm:px-6 md:py-24 lg:grid-cols-2 lg:items-center">
        <div className="flex flex-col items-start gap-6">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
            <ShieldCheck className="size-3.5 text-primary" />
            Verified student community
          </span>

          <h1 className="text-balance text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            The knowledge your campus already has, finally in one place
          </h1>

          <p className="text-pretty text-lg leading-relaxed text-muted-foreground">
            Knowlix is where students share and discover trusted course notes,
            past papers, and study guides. Stop losing brilliant work between
            batches and start learning from those who came before you.
          </p>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button size="lg" render={<Link href="/signup" />}>
              Join your campus
              <ArrowRight className="size-4" />
            </Button>
            <Button size="lg" variant="outline" render={<Link href="#how-it-works" />}>
              See how it works
            </Button>
          </div>

          <div className="flex items-center gap-3 pt-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-0.5 text-chart-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="size-4 fill-current" aria-hidden="true" />
              ))}
            </div>
            <span>Trusted by students at 40+ institutions</span>
          </div>
        </div>

        <div className="relative">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-border shadow-sm">
            <Image
              src="/images/hero-students.png"
              alt="University students collaborating over study notes in a library"
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
