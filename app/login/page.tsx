import type { Metadata } from 'next'
import { AuthShell } from '@/components/auth/auth-shell'
import { LoginForm } from '@/components/auth/login-form'

export const metadata: Metadata = {
  title: 'Log in | Knowlix',
  description: 'Sign in to your Knowlix account.',
}

export default function LoginPage() {
  return (
    <AuthShell title="Welcome back" subtitle="Sign in to your Knowlix workspace.">
      <LoginForm />
    </AuthShell>
  )
}
