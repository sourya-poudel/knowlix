const STEPS = [
  {
    step: '01',
    title: 'Verify your campus',
    body: 'Sign up with your institutional email. We confirm you belong to your university before you join.',
  },
  {
    step: '02',
    title: 'Share & discover',
    body: 'Upload your best notes and browse thousands of resources contributed by students across your courses.',
  },
  {
    step: '03',
    title: 'Build your reputation',
    body: 'Earn upvotes and recognition as your contributions help classmates and future batches succeed.',
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="scroll-mt-16">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold uppercase tracking-wide text-primary">
            How it works
          </span>
          <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Up and running in three steps
          </h2>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {STEPS.map((item) => (
            <div
              key={item.step}
              className="relative flex flex-col gap-4 rounded-xl border border-border bg-card p-8"
            >
              <span className="text-4xl font-semibold tracking-tight text-primary/30">
                {item.step}
              </span>
              <h3 className="text-xl font-semibold text-card-foreground">
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
