'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { signIn } from '@/lib/auth-client'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function LoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const bootstrapEmail = process.env.NEXT_PUBLIC_ADMIN_BOOTSTRAP_EMAIL?.toLowerCase() ?? ''

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    const normalizedEmail = email.trim().toLowerCase()
    const callbackURL = normalizedEmail === bootstrapEmail ? '/admin' : '/dashboard'

    const res = await signIn.email({
      email,
      password,
      callbackURL,
    } as any)

    if (res.error) {
      toast.error(res.error.message ?? 'Unable to sign in. Please try again.')
      setLoading(false)
      return
    }

    // Bootstrap the initial admin account without changing runtime authorization.
    if (bootstrapEmail && normalizedEmail === bootstrapEmail) {
      try {
        await fetch('/api/set-admin-role', { method: 'POST' })
      } catch (err) {
        console.error('Failed to set admin role:', err)
      }
    }

    toast.success('Welcome back!')
    router.push(callbackURL)
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="rounded-2xl border border-border/70 bg-background/70 p-4">
        <div className="flex items-center justify-between gap-3">
          <Badge className="border-primary/15 bg-primary/8 text-primary" variant="secondary">
            Student access
          </Badge>
          <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
            Verified account only
          </span>
        </div>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          Sign in to access your campus library, pending uploads, bookmarks, and moderator feedback.
        </p>
      </div>

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
        />
      </div>

      <div className="flex flex-col gap-3 rounded-2xl border border-border/70 bg-muted/50 p-4">
        <Button type="submit" className="w-full shadow-sm shadow-primary/10" disabled={loading}>
          {loading && <Loader2 className="size-4 animate-spin" />}
          Sign in
        </Button>
        <p className="text-center text-xs leading-5 text-muted-foreground">
          Access is limited to approved institutional accounts.
        </p>
      </div>

      <p className="text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{' '}
        <Link href="/signup" className="font-medium text-primary hover:underline">
          Create one
        </Link>
      </p>
    </form>
  )
}
