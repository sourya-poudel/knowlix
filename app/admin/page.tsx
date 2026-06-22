import { requireRole } from '@/lib/session'
import { AdminDashboard } from '@/components/admin/admin-dashboard'
import { AmbientBackdrop } from '@/components/ui/ambient-backdrop'

export default async function AdminPage() {
  await requireRole(['admin'])

  return (
    <div className="relative min-h-dvh overflow-hidden bg-muted/30">
      <AmbientBackdrop className="opacity-75" variant="default" />
      <div className="relative">
        <AdminDashboard showUsers />
      </div>
    </div>
  )
}
