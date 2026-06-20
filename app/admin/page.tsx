import { redirect } from 'next/navigation'
import { requireRole } from '@/lib/session'
import { AdminDashboard } from '@/components/admin/admin-dashboard'

export default async function AdminPage() {
  const user = await requireRole(['admin'])
  if (!user) {
    redirect('/login')
  }

  return <AdminDashboard />
}
