import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { AuthShell } from '@/components/auth/auth-shell'
import { OnboardingForm } from '@/components/auth/onboarding-form'
import { requireUser } from '@/lib/session'

export const metadata: Metadata = {
  title: 'Complete profile | Knowlix',
  description: 'Select your institution to finish setting up Knowlix.',
}

export default async function OnboardingPage() {
  const user = await requireUser()

  if (user.role === 'admin') redirect('/admin')
  if (user.role === 'moderator') redirect('/moderator')
  if (user.institutionId) redirect('/dashboard')

  return (
    <AuthShell
      title="Complete your profile"
      subtitle="Select your institution to access campus resources."
    >
      <OnboardingForm email={user.email} />
    </AuthShell>
  )
}
