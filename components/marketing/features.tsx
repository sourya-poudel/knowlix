import { Library, Search, ShieldCheck, ThumbsUp, FolderTree, Bell } from 'lucide-react'

const FEATURES = [
  {
    icon: Library,
    title: 'Organized by course',
    body: 'Notes, past papers, cheat sheets, and study guides sorted by course, professor, and semester.',
  },
  {
    icon: Search,
    title: 'Powerful search',
    body: 'Find exactly what you need by course code, topic, or tag in seconds, not hours of scrolling.',
  },
  {
    icon: ShieldCheck,
    title: 'Verified students only',
    body: 'Institutional email verification keeps your campus library trusted and spam-free.',
  },
  {
    icon: ThumbsUp,
    title: 'Community curated',
    body: 'Upvotes and reputation lift the most accurate, helpful resources to the top.',
  },
  {
    icon: FolderTree,
    title: 'Personal collections',
    body: 'Bookmark and group resources into collections tailored to your own exam prep.',
  },
  {
    icon: Bell,
    title: 'Requests & alerts',
    body: 'Ask for material you cannot find and get notified the moment someone uploads it.',
  },
]

export function Features() {
  return (
    <section id="features" className="scroll-mt-16 border-t border-border bg-muted/40">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold uppercase tracking-wide text-primary">
            Features
          </span>
          <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Everything your campus needs to learn together
          </h2>
          <p className="mt-4 text-pretty text-lg leading-relaxed text-muted-foreground">
            Built for the way students actually study, share, and prepare for
            exams.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature) => (
            <div
              key={feature.title}
              className="flex flex-col gap-4 rounded-xl border border-border bg-card p-6 transition-colors hover:border-primary/40"
            >
              <span className="flex size-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <feature.icon className="size-5" aria-hidden="true" />
              </span>
              <h3 className="text-lg font-semibold text-card-foreground">
                {feature.title}
              </h3>
              <p className="text-pretty leading-relaxed text-muted-foreground">
                {feature.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
