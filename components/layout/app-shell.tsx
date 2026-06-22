import type { ReactNode } from 'react'
import { DashboardNav } from '@/components/dashboard/dashboard-nav'
import { AmbientBackdrop } from '@/components/ui/ambient-backdrop'

function getInitials(name: string) {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
}

export function AppShell({
  user,
  children,
}: {
  user: { id: string; name: string; email: string; role: string }
  children: ReactNode
}) {
  return (
    <div className="relative flex min-h-dvh flex-col overflow-hidden bg-muted/30">
      <AmbientBackdrop className="opacity-80" variant="default" />
      <DashboardNav
        name={user.name}
        email={user.email}
        initials={getInitials(user.name)}
        userId={user.id}
        role={user.role}
      />
      <main className="relative mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6">{children}</main>
    </div>
  )
}
