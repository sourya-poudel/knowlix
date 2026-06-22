import { BrandLogo } from '@/components/brand-logo'

export default function Loading() {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-background px-4">
      <div className="relative w-full max-w-md overflow-hidden rounded-[2rem] border border-border/70 bg-card/95 p-8 text-center shadow-[0_30px_90px_-45px_rgba(15,23,42,0.45)] backdrop-blur-xl">
        <div className="absolute inset-x-0 top-0 h-1 bg-[linear-gradient(90deg,var(--primary),var(--accent),var(--primary))]" />
        <div className="mx-auto flex w-fit items-center justify-center">
          <div className="relative flex size-20 items-center justify-center rounded-full border border-border/70 bg-background/85">
            <div className="absolute inset-0 rounded-full border border-primary/15" />
            <div className="absolute inset-1.5 rounded-full border border-transparent border-t-primary/90 border-r-accent animate-spin [animation-duration:1.6s]" />
            <div className="absolute inset-4 animate-pulse rounded-full bg-primary/10" />
            <div className="absolute inset-6 rounded-full bg-background shadow-inner" />
            <div className="relative z-10 scale-110">
              <BrandLogo showWordmark={false} />
            </div>
          </div>
        </div>

        <h1 className="mt-6 text-2xl font-semibold tracking-tight text-foreground">Loading Knowlix</h1>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Preparing your campus library, notifications, and discussions.
        </p>

        <div className="mt-6 grid gap-4">
          <div className="overflow-hidden rounded-full bg-muted/70 p-1">
            <div className="knowlix-loading-bar h-1.5 rounded-full bg-[linear-gradient(90deg,var(--primary),var(--accent))]" />
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div className="h-10 animate-pulse rounded-2xl bg-muted/60" />
            <div className="h-10 animate-pulse rounded-2xl bg-muted/60 [animation-delay:150ms]" />
            <div className="h-10 animate-pulse rounded-2xl bg-muted/60 [animation-delay:300ms]" />
          </div>
        </div>
      </div>
    </div>
  )
}