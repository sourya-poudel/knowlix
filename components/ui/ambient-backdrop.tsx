import { cn } from '@/lib/utils'

export function AmbientBackdrop({
  className,
  variant = 'default',
}: {
  className?: string
  variant?: 'default' | 'hero' | 'panel'
}) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        'pointer-events-none absolute inset-0 overflow-hidden',
        variant === 'hero' && 'opacity-100',
        variant === 'panel' && 'opacity-90',
        variant === 'default' && 'opacity-100',
        className,
      )}
    >
      <div className="knowlix-noise absolute inset-0 opacity-[0.13]" />
      <div
        className={cn(
          'knowlix-orb knowlix-orb-a absolute -top-24 left-[-8rem] h-80 w-80 rounded-full bg-[radial-gradient(circle,rgba(46,120,255,0.22),transparent_68%)] blur-3xl',
          variant === 'panel' && 'opacity-80',
        )}
      />
      <div className="knowlix-orb knowlix-orb-b absolute top-8 right-[-6rem] h-96 w-96 rounded-full bg-[radial-gradient(circle,rgba(38,184,181,0.2),transparent_68%)] blur-3xl" />
      <div className="knowlix-orb knowlix-orb-c absolute bottom-[-8rem] left-1/2 h-[26rem] w-[26rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(100,168,255,0.16),transparent_68%)] blur-3xl" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.07),transparent_40%)]" />
    </div>
  )
}
