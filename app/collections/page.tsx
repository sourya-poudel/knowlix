import type { Metadata } from 'next'
import { AppShell } from '@/components/layout/app-shell'
import { CollectionsManager } from '@/components/collections/collections-manager'
import { requireInstitutionUser } from '@/lib/session'

export const metadata: Metadata = {
  title: 'Collections | Knowlix',
  description: 'Organize saved resources into collections.',
}

export default async function CollectionsPage() {
  const user = await requireInstitutionUser()

  return (
    <AppShell user={user}>
      <div className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight">Collections</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
          Group bookmarks into curated lists for exam prep, subjects, or projects.
        </p>
      </div>
      <CollectionsManager />
    </AppShell>
  )
}
