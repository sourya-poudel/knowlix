import type { Metadata } from 'next'
import { AppShell } from '@/components/layout/app-shell'
import { RequestsBoard } from '@/components/requests/requests-board'
import { requireInstitutionUser } from '@/lib/session'

export const metadata: Metadata = {
  title: 'Resource Requests | Knowlix',
  description: 'Request and vote on missing campus resources.',
}

export default async function RequestsPage() {
  const user = await requireInstitutionUser()

  return (
    <AppShell user={user}>
      <div className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight">Resource requests</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
          Crowdsource missing study material from your institution and track when requests are fulfilled.
        </p>
      </div>
      <RequestsBoard />
    </AppShell>
  )
}
