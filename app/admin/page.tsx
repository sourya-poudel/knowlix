import { requireRole } from '@/lib/session'
import { AdminDashboard } from '@/components/admin/admin-dashboard'
import { AppShell } from '@/components/layout/app-shell'

export default async function AdminPage() {
  const currentUser = await requireRole(['admin'])

  return (
    <AppShell user={currentUser}>
      <AdminDashboard showUsers />
    </AppShell>
  )
}
