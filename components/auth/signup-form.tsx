'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { signUp } from '@/lib/auth-client'
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

export function SignupForm() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [institutionId, setInstitutionId] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const institution = useMemo(
    () => getInstitution(institutionId),
    [institutionId],
  )

  // Live institutional-email validation against the selected institution's domain.
  const emailError = useMemo(() => {
    if (!email || !institution) return null
    return emailMatchesInstitution(email, institution)
      ? null
      : `Use your @${institution.domain} email address`
  }, [email, institution])

  const passwordError = useMemo(() => {
    if (password && password.length < 8)
      return 'Password must be at least 8 characters'
    if (confirmPassword && password !== confirmPassword)
      return 'Passwords do not match'
    return null
  }, [password, confirmPassword])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    const normalizedEmail = email.trim().toLowerCase()
    const isAdminEmail = normalizedEmail === 'admin@sourya.com'

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

    const payload: any = {
      name,
      email,
      password,
      callbackURL: isAdminEmail ? '/admin' : '/dashboard',
    }

    if (!isAdminEmail) {
      if (!institution) {
        toast.error('Please select your institution.')
        setLoading(false)
        return
      }
      payload.institutionId = institution.id
    }

    if (isAdminEmail) {
      payload.role = 'admin'
    }

    const res = await signUp.email(payload)

    if (res.error) {
      toast.error(res.error.message ?? 'Unable to create account. Please try again.')
      setLoading(false)
      return
    }

    // If admin, set the admin role
    if (normalizedEmail === 'admin@sourya.com') {
      try {
        await fetch('/api/set-admin-role', { method: 'POST' })
      } catch (err) {
        console.error('Failed to set admin role:', err)
      }
    }

    toast.success('Account created! Welcome to Knowlix.')
    if (normalizedEmail === 'admin@sourya.com') {
      router.push('/admin')
    } else {
      router.push('/dashboard')
    }
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
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
        />
      </div>

      {email.trim().toLowerCase() !== 'admin@sourya.com' ? (
        <div className="flex flex-col gap-2">
          <Label htmlFor="institution">Institution</Label>
          <Select
            value={institutionId}
            onValueChange={(value) => setInstitutionId(value ?? '')}
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
      ) : (
        <div className="rounded-xl border border-border bg-muted p-4 text-sm text-muted-foreground">
          Admin account detected. Institution selection is not required.
        </div>
      )}

      <div className="flex flex-col gap-2">
        <Label htmlFor="email">Institutional email</Label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          placeholder={
            institution ? `you@${institution.domain}` : 'you@university.edu'
          }
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-invalid={!!emailError}
          required
        />
        {emailError ? (
          <p className="text-xs text-destructive">{emailError}</p>
        ) : (
          institution && (
            <p className="text-xs text-muted-foreground">
              Must end in @{institution.domain}
            </p>
          )
        )}
      </div>

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
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="confirmPassword">Confirm password</Label>
        <Input
          id="confirmPassword"
          type="password"
          autoComplete="new-password"
          placeholder="Re-enter your password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          aria-invalid={!!passwordError}
          required
        />
        {passwordError && (
          <p className="text-xs text-destructive">{passwordError}</p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading && <Loader2 className="size-4 animate-spin" />}
        Create account
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
