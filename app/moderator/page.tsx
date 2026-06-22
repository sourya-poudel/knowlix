import type { Metadata } from 'next'
import { AdminDashboard } from '@/components/admin/admin-dashboard'
import { requireRole } from '@/lib/session'
import { AmbientBackdrop } from '@/components/ui/ambient-backdrop'

export const metadata: Metadata = {
  title: 'Moderator Dashboard | Knowlix',
  description: 'Review and approve uploaded resources for your institution.',
}

export default async function ModeratorPage() {
  await requireRole(['moderator'])

  return (
    <div className="relative min-h-dvh overflow-hidden bg-muted/30">
      <AmbientBackdrop className="opacity-75" variant="default" />
      <div className="relative">
        <AdminDashboard showUsers={false} />
      </div>
    </div>
  )
}