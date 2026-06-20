import Image from 'next/image'
import { Mail, ShieldCheck, Users } from 'lucide-react'

const POINTS = [
  {
    icon: Mail,
    title: 'Institutional email required',
    body: 'Every member signs up with a verified university email address tied to their institution.',
  },
  {
    icon: ShieldCheck,
    title: 'Trusted by design',
    body: 'Domain matching ensures resources stay relevant and authentic to your campus community.',
  },
  {
    icon: Users,
    title: 'Your campus, your library',
    body: 'You only see and share within communities you actually belong to.',
  },
]

export function Verification() {
  return (
    <section id="verification" className="scroll-mt-16 border-t border-border bg-muted/40">
      <div className="mx-auto grid max-w-6xl gap-12 px-4 py-16 sm:px-6 md:py-24 lg:grid-cols-2 lg:items-center">
        <div className="relative order-last lg:order-first">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-border shadow-sm">
            <Image
              src="/images/verification.png"
              alt="Institutional email verification with a university ID and verified badge"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <span className="text-sm font-semibold uppercase tracking-wide text-primary">
            Institution verification
          </span>
          <h2 className="text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            A trusted community, verified from day one
          </h2>
          <p className="text-pretty text-lg leading-relaxed text-muted-foreground">
            Knowlix keeps quality high by verifying that every student belongs
            to their institution before they can contribute or download.
          </p>

          <div className="flex flex-col gap-4">
            {POINTS.map((point) => (
              <div key={point.title} className="flex items-start gap-4">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <point.icon className="size-5" aria-hidden="true" />
                </span>
                <div>
                  <h3 className="font-semibold text-foreground">{point.title}</h3>
                  <p className="text-pretty leading-relaxed text-muted-foreground">
                    {point.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
