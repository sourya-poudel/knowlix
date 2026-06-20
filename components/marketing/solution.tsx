import { CheckCircle2 } from 'lucide-react'

const POINTS = [
  'A permanent, searchable home for every course resource on your campus',
  'Curated by students, verified by institution, and improved over time',
  'Reputation and upvotes surface the material that actually helps',
]

export function Solution() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-24">
      <div className="rounded-2xl border border-border bg-card p-8 sm:p-12">
        <div className="mx-auto max-w-3xl text-center">
          <span className="text-sm font-semibold uppercase tracking-wide text-accent">
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

        <div className="mx-auto mt-10 grid max-w-3xl gap-4 sm:grid-cols-1">
          {POINTS.map((point) => (
            <div
              key={point}
              className="flex items-start gap-3 rounded-lg border border-border bg-background p-4"
            >
              <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden="true" />
              <p className="text-pretty leading-relaxed text-foreground">{point}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
