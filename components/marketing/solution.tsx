import { CheckCircle2 } from 'lucide-react'

const POINTS = [
  'A permanent, searchable home for every course resource on your campus',
  'Curated by students, verified by institution, and improved over time',
  'Reputation and upvotes surface the material that actually helps',
]

export function Solution() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-24">
      <div className="grid gap-10 rounded-[2rem] border border-border/70 bg-card/75 p-8 shadow-[0_30px_100px_-72px_rgba(15,23,42,0.4)] backdrop-blur-sm lg:grid-cols-[0.95fr_1.05fr] lg:items-center lg:p-12">
        <div className="mx-auto max-w-2xl lg:mx-0">
          <span className="text-sm font-semibold uppercase tracking-[0.35em] text-accent">
            The solution
          </span>
          <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight text-card-foreground sm:text-4xl">
            Knowlix turns scattered knowledge into a shared library
          </h2>
          <p className="mt-4 text-pretty text-lg leading-relaxed text-muted-foreground">
            One trusted platform where verified students contribute, organize,
            and discover academic resources, so the best work lives on long
            after its author graduates.
          </p>
        </div>

        <div className="grid gap-4">
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              ['Verified', 'institution-bound access'],
              ['Moderated', 'approval before publish'],
              ['Discoverable', 'search by course and type'],
            ].map(([label, detail]) => (
              <div key={label} className="rounded-2xl border border-border/70 bg-background/75 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">{label}</p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{detail}</p>
              </div>
            ))}
          </div>

          <div className="grid gap-3">
            {POINTS.map((point, index) => (
              <div
                key={point}
                className="flex items-start gap-4 rounded-[1.25rem] border border-border/70 bg-background/80 p-4"
              >
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                  0{index + 1}
                </span>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="size-4 shrink-0 text-primary" aria-hidden="true" />
                    <p className="font-medium text-foreground">{point}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
