import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function CallToAction() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-24">
      <div className="flex flex-col items-center gap-6 rounded-2xl bg-primary px-6 py-14 text-center sm:px-12">
        <h2 className="text-balance text-3xl font-semibold tracking-tight text-primary-foreground sm:text-4xl">
          Ready to unlock your campus knowledge?
        </h2>
        <p className="max-w-xl text-pretty text-lg leading-relaxed text-primary-foreground/80">
          Join the students already building a smarter, shared library. It only
          takes a verified email to get started.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button size="lg" variant="secondary" render={<Link href="/signup" />}>
            Create your account
            <ArrowRight className="size-4" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
            render={<Link href="/login" />}
          >
            I already have an account
          </Button>
        </div>
      </div>
    </section>
  )
}
