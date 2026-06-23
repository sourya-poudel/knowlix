'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import {
  INSTITUTIONS,
  getInstitution,
  emailMatchesInstitution,
} from '@/lib/institutions'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export function OnboardingForm({ email }: { email: string }) {
  const router = useRouter()
  const [institutionId, setInstitutionId] = useState('')
  const [loading, setLoading] = useState(false)

  const institution = useMemo(() => getInstitution(institutionId), [institutionId])

  const emailError = useMemo(() => {
    if (!email || !institution) return null
    return emailMatchesInstitution(email, institution)
      ? null
      : `Your account email must match @${institution.domain}`
  }, [email, institution])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!institution) {
      toast.error('Please select your institution.')
      return
    }
    if (emailError) {
      toast.error(emailError)
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/me/institution', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ institutionId: institution.id }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'Unable to save institution')

      toast.success('Profile complete!')
      router.replace('/dashboard')
      router.refresh()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to save institution')
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <Label htmlFor="institution">Institution</Label>
        <Select value={institutionId} onValueChange={(value) => setInstitutionId(value ?? '')}>
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
        {emailError ? (
          <p className="text-xs text-destructive">{emailError}</p>
        ) : institution ? (
          <p className="text-xs text-muted-foreground">
            Signed in as {email}. Must match @{institution.domain}.
          </p>
        ) : null}
      </div>

      <Button type="submit" className="h-11 w-full" disabled={loading || !!emailError}>
        {loading ? <Loader2 className="size-4 animate-spin" /> : null}
        {loading ? 'Saving…' : 'Continue to dashboard'}
      </Button>
    </form>
  )
}
