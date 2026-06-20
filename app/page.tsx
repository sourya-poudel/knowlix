import { CallToAction } from '@/components/marketing/cta'
import { Features } from '@/components/marketing/features'
import { Hero } from '@/components/marketing/hero'
import { HowItWorks } from '@/components/marketing/how-it-works'
import { SiteFooter } from '@/components/marketing/site-footer'
import { SiteHeader } from '@/components/marketing/site-header'
import { Verification } from '@/components/marketing/verification'

export default function Page() {
  return (
    <div className="bg-background text-foreground">
      <SiteHeader />
      <main>
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
