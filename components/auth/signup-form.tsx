'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Loader2, ShieldCheck } from 'lucide-react'
import { toast } from 'sonner'
import { signUp } from '@/lib/auth-client'
import { getPostAuthPath } from '@/lib/auth-routing'
import { isPublicAdminEmail } from '@/lib/admin-emails'
import {
  INSTITUTIONS,
  getInstitution,
  emailMatchesInstitution,
} from '@/lib/institutions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

async function resolvePostSignupPath(): Promise<string> {
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

export function SignupForm() {
  const router = useRouter()

  const [name, setName] = useState('')
  const [institutionId, setInstitutionId] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const normalizedEmail = email.trim().toLowerCase()
  const isAdminEmail = useMemo(
    () => (normalizedEmail ? isPublicAdminEmail(normalizedEmail) : false),
    [normalizedEmail],
  )

  const institution = useMemo(() => getInstitution(institutionId), [institutionId])

  const emailError = useMemo(() => {
    if (isAdminEmail || !email || !institution) return null
    return emailMatchesInstitution(email, institution)
      ? null
      : `Use your @${institution.domain} email address`
  }, [email, institution, isAdminEmail])

  const passwordError = useMemo(() => {
    if (password && password.length < 8) return 'Password must be at least 8 characters'
    if (confirmPassword && password !== confirmPassword) return 'Passwords do not match'
    return null
  }, [password, confirmPassword])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!isAdminEmail && !institution) {
      toast.error('Please select your institution.')
      return
    }
    if (!isAdminEmail && emailError) {
      toast.error(emailError)
      return
    }
    if (password.length < 8) {
      toast.error('Password must be at least 8 characters.')
      return
    }
    if (password !== confirmPassword) {
      toast.error('Passwords do not match.')
      return
    }

    setLoading(true)

    const payload: Record<string, string> = {
      name,
      email: email.trim(),
      password,
      callbackURL: '/dashboard',
    }

    if (!isAdminEmail && institution) {
      payload.institutionId = institution.id
    }

    const res = await signUp.email(payload as Parameters<typeof signUp.email>[0])

    if (res.error) {
      toast.error(res.error.message ?? 'Unable to create account. Please try again.')
      setLoading(false)
      return
    }

    const destination = await resolvePostSignupPath()
    toast.success('Account created successfully.')
    router.replace(destination)
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {isAdminEmail ? (
        <div className="flex items-start gap-3 rounded-xl border border-primary/20 bg-primary/5 px-4 py-3">
          <ShieldCheck className="mt-0.5 size-4 shrink-0 text-primary" />
          <p className="text-sm leading-relaxed text-muted-foreground">
            Administrator account. Institution selection is not required.
          </p>
        </div>
      ) : null}

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="name">Full name</Label>
          <Input
            id="name"
            type="text"
            autoComplete="name"
            placeholder="Jane Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        {!isAdminEmail ? (
          <div className="flex flex-col gap-2">
            <Label htmlFor="institution">Institution</Label>
            <Select
              value={institutionId}
              onValueChange={(value) => setInstitutionId(value ?? '')}
              disabled={loading}
            >
              <SelectTrigger id="institution" className="w-full">
                <SelectValue>
                  {institution ? institution.name : 'Select your university'}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {INSTITUTIONS.map((inst) => (
                  <SelectItem key={inst.id} value={inst.id}>
                    {inst.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ) : null}

        <div className="flex flex-col gap-2">
          <Label htmlFor="email">{isAdminEmail ? 'Email' : 'Institutional email'}</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder={
              institution && !isAdminEmail ? `you@${institution.domain}` : 'you@university.edu'
            }
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-invalid={!!emailError}
            required
            disabled={loading}
          />
          {emailError ? (
            <p className="text-xs text-destructive">{emailError}</p>
          ) : institution && !isAdminEmail ? (
            <p className="text-xs text-muted-foreground">Must end in @{institution.domain}</p>
          ) : null}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              autoComplete="new-password"
              placeholder="At least 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="confirmPassword">Confirm</Label>
            <Input
              id="confirmPassword"
              type="password"
              autoComplete="new-password"
              placeholder="Re-enter password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              aria-invalid={!!passwordError}
              required
              disabled={loading}
            />
          </div>
        </div>
        {passwordError ? <p className="text-xs text-destructive">{passwordError}</p> : null}
      </div>

      <Button type="submit" className="h-11 w-full" disabled={loading}>
        {loading ? <Loader2 className="size-4 animate-spin" /> : null}
        {loading ? 'Creating account…' : 'Create account'}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{' '}
        <Link href="/login" className="font-medium text-primary hover:underline">
          Sign in
        </Link>
      </p>
    </form>
  )
}
