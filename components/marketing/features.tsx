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
    <section id="features" className="scroll-mt-16 border-t border-border/70 bg-background/60">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold uppercase tracking-[0.35em] text-primary">
            Features
          </span>
          <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Everything your campus needs to share, review, and rediscover knowledge
          </h2>
          <p className="mt-4 text-pretty text-lg leading-relaxed text-muted-foreground">
            A cleaner, more intentional interface that makes the academic flow feel professional instead of generic.
          </p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature) => (
            <div
              key={feature.title}
              className="group flex flex-col gap-4 rounded-[1.5rem] border border-border/70 bg-card/80 p-6 shadow-[0_24px_80px_-56px_rgba(15,23,42,0.45)] transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-[0_30px_100px_-60px_rgba(37,99,235,0.35)]"
            >
              <span className="flex size-12 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,color-mix(in_oklch,var(--primary)_24%,transparent),color-mix(in_oklch,var(--accent)_24%,transparent))] text-primary shadow-sm ring-1 ring-border/70">
                <feature.icon className="size-5" aria-hidden="true" />
              </span>
              <h3 className="text-lg font-semibold tracking-tight text-card-foreground">
                {feature.title}
              </h3>
              <p className="text-pretty leading-relaxed text-muted-foreground">
                {feature.body}
              </p>
              <div className="mt-auto h-px w-full bg-gradient-to-r from-border/0 via-border to-border/0 opacity-60" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
