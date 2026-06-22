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
    <section id="verification" className="scroll-mt-16 border-t border-border/70 bg-background/60">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 md:py-24 lg:grid-cols-2 lg:items-center">
        <div className="relative order-last lg:order-first">
          <div className="absolute inset-0 -z-10 translate-y-8 rounded-[2rem] bg-accent/10 blur-3xl" />
          <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] border border-border/70 bg-card/80 p-3 shadow-[0_40px_120px_-70px_rgba(15,23,42,0.45)] backdrop-blur-sm">
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
          <span className="text-sm font-semibold uppercase tracking-[0.35em] text-primary">
            Institution verification
          </span>
          <h2 className="text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            A trusted community, verified from day one
          </h2>
          <p className="text-pretty text-lg leading-relaxed text-muted-foreground">
            Knowlix keeps quality high by verifying that every student belongs
            to their institution before they can contribute or download.
          </p>

          <div className="grid gap-4">
            {POINTS.map((point) => (
              <div key={point.title} className="flex items-start gap-4 rounded-[1.25rem] border border-border/70 bg-card/70 p-4 shadow-sm">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,color-mix(in_oklch,var(--primary)_22%,transparent),color-mix(in_oklch,var(--accent)_18%,transparent))] text-primary ring-1 ring-border/70">
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
