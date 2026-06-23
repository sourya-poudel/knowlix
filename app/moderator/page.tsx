import type { Metadata } from 'next'
import { AdminDashboard } from '@/components/admin/admin-dashboard'
import { AppShell } from '@/components/layout/app-shell'
import { requireRole } from '@/lib/session'

export const metadata: Metadata = {
  title: 'Moderator Dashboard | Knowlix',
  description: 'Review and approve uploaded resources for your institution.',
}

export default async function ModeratorPage() {
  const currentUser = await requireRole(['moderator'])

  return (
    <AppShell user={currentUser}>
      <AdminDashboard showUsers={false} />
    </AppShell>
  )
}
