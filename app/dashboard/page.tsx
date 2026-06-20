import type { Metadata } from 'next'
import { DashboardNav } from '@/components/dashboard/dashboard-nav'
import { Welcome } from '@/components/dashboard/welcome'
import { StatCards } from '@/components/dashboard/stat-cards'
import { QuickActions } from '@/components/dashboard/quick-actions'
import { ResourceSection } from '@/components/dashboard/resource-section'
import {
  CURRENT_USER,
  MY_UPLOADS,
  SAVED_RESOURCES,
  RECENT_RESOURCES,
} from '@/lib/mock-data'

export const metadata: Metadata = {
  title: 'Dashboard | Knowlix',
  description: 'Your Knowlix student dashboard.',
}

export default function DashboardPage() {
  const user = CURRENT_USER

  return (
    <div className="flex min-h-dvh flex-col bg-muted/30">
      <DashboardNav
        name={user.name}
        email={user.email}
        initials={user.initials}
      />

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6">
        <div className="flex flex-col gap-10">
          <Welcome
            name={user.name}
            institutionName={user.institutionName}
            reputation={user.reputation}
          />

          <div className="flex flex-col gap-4">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Quick actions
            </h2>
            <QuickActions />
          </div>

          <StatCards />

          <ResourceSection
            title="My uploads"
            description="Resources you have shared with your campus"
            resources={MY_UPLOADS}
            showStatus
          />

          <ResourceSection
            title="Saved resources"
            description="Material you have bookmarked for later"
            resources={SAVED_RESOURCES}
          />

          <ResourceSection
            title="Recent on campus"
            description="The latest resources added by your community"
            resources={RECENT_RESOURCES}
          />
        </div>
      </main>
    </div>
  )
}
