import { FileX2, MessagesSquare, Clock } from 'lucide-react'

const PROBLEMS = [
  {
    icon: FileX2,
    title: 'Knowledge disappears every year',
    body: 'Carefully written notes and solved papers vanish into old laptops and graduated seniors\u2019 drives the moment a batch leaves.',
  },
  {
    icon: MessagesSquare,
    title: 'Scattered across chats and drives',
    body: 'Useful material is buried in group chats, random folders, and dead links that nobody can find when exams arrive.',
  },
  {
    icon: Clock,
    title: 'Everyone re-solves the same problems',
    body: 'Each batch starts from zero, spending nights recreating resources that already existed somewhere on campus.',
  },
]

export function Problem() {
  return (
    <section className="border-t border-border bg-muted/40">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold uppercase tracking-wide text-primary">
            The problem
          </span>
          <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Great study material gets lost between batches
          </h2>
          <p className="mt-4 text-pretty text-lg leading-relaxed text-muted-foreground">
            Every campus produces years of valuable academic work, yet almost
            none of it survives long enough to help the next student.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {PROBLEMS.map((item) => (
            <div
              key={item.title}
              className="flex flex-col gap-4 rounded-xl border border-border bg-card p-6"
            >
              <span className="flex size-11 items-center justify-center rounded-lg bg-destructive/10 text-destructive">
                <item.icon className="size-5" aria-hidden="true" />
              </span>
              <h3 className="text-lg font-semibold text-card-foreground">
                {item.title}
              </h3>
              <p className="text-pretty leading-relaxed text-muted-foreground">
                {item.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
