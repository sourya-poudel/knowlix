import { CallToAction } from '@/components/marketing/cta'
import { Features } from '@/components/marketing/features'
import { Hero } from '@/components/marketing/hero'
import { HowItWorks } from '@/components/marketing/how-it-works'
import { SiteFooter } from '@/components/marketing/site-footer'
import { SiteHeader } from '@/components/marketing/site-header'
import { Verification } from '@/components/marketing/verification'
import { AmbientBackdrop } from '@/components/ui/ambient-backdrop'

export default function Page() {
  return (
    <div className="relative overflow-hidden bg-background text-foreground">
      <AmbientBackdrop variant="hero" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[28rem] bg-[radial-gradient(circle_at_top,_color-mix(in_oklch,var(--primary)_18%,transparent),_transparent_55%)] opacity-80" />
      <SiteHeader />
      <main className="relative">
        <Hero />
        <Features />
        <HowItWorks />
        <Verification />
        <CallToAction />
      </main>
      <SiteFooter />
    </div>
  )
}
