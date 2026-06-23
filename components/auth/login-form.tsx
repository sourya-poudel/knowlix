'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Loader2, ShieldCheck } from 'lucide-react'
import { toast } from 'sonner'
import { signIn } from '@/lib/auth-client'
import { getPostAuthPath } from '@/lib/auth-routing'
import { isPublicAdminEmail } from '@/lib/admin-emails'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

async function resolvePostLoginPath(): Promise<string> {
  try {
    await fetch('/api/set-admin-role', { method: 'POST' })
    const res = await fetch('/api/me', { cache: 'no-store' })
    if (res.ok) {
      const profile = await res.json()
      return getPostAuthPath(profile.role)
    }
  } catch {
    // Fall back to dashboard if profile lookup fails.
  }
  return '/dashboard'
}

export function LoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const normalizedEmail = email.trim().toLowerCase()
  const isAdminLogin = useMemo(
    () => (normalizedEmail ? isPublicAdminEmail(normalizedEmail) : false),
    [normalizedEmail],
  )

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    const res = await signIn.email({
      email: email.trim(),
      password,
      callbackURL: '/dashboard',
    } as Parameters<typeof signIn.email>[0])

    if (res.error) {
      toast.error(res.error.message ?? 'Unable to sign in. Check your email and password.')
      setLoading(false)
      return
    }

    const destination = await resolvePostLoginPath()
    toast.success(isAdminLogin ? 'Welcome, administrator.' : 'Welcome back!')
    router.replace(destination)
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {isAdminLogin ? (
        <div className="flex items-start gap-3 rounded-xl border border-primary/20 bg-primary/5 px-4 py-3">
          <ShieldCheck className="mt-0.5 size-4 shrink-0 text-primary" />
          <p className="text-sm leading-relaxed text-muted-foreground">
            Administrator account detected. You&apos;ll be routed to the admin panel after sign-in.
          </p>
        </div>
      ) : null}

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@university.edu"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
          />
        </div>
      </div>

      <Button type="submit" className="h-11 w-full" disabled={loading}>
        {loading ? <Loader2 className="size-4 animate-spin" /> : null}
        {loading ? 'Signing in…' : 'Sign in'}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{' '}
        <Link href="/signup" className="font-medium text-primary hover:underline">
          Create one
        </Link>
      </p>
    </form>
  )
}
