'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { LayoutDashboard, LogOut, Search, Upload, User } from 'lucide-react'
import { toast } from 'sonner'
import { signOut } from '@/lib/auth-client'
import { BrandLogo } from '@/components/brand-logo'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export function DashboardNav({
  name,
  email,
  initials,
}: {
  name: string
  email: string
  initials: string
}) {
  const router = useRouter()

  async function handleSignOut() {
    await signOut()
    toast.success('Signed out')
    router.push('/login')
    router.refresh()
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <div className="flex items-center gap-6">
          <BrandLogo href="/dashboard" />
          <nav className="hidden items-center gap-1 md:flex" aria-label="Dashboard">
            <Button variant="ghost" size="sm" render={<Link href="/dashboard" />}>
              <LayoutDashboard className="size-4" />
              Dashboard
            </Button>
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" aria-label="Search" className="hidden sm:inline-flex">
            <Search className="size-4" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button variant="ghost" size="icon" className="rounded-full" aria-label="Account menu">
                  <Avatar className="size-8">
                    <AvatarFallback className="bg-primary text-xs text-primary-foreground">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              }
            />
            <DropdownMenuContent align="end" className="w-56">
              <div className="px-1.5 py-1 text-xs font-medium text-muted-foreground">
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm font-medium text-foreground">{name}</span>
                  <span className="text-xs font-normal text-muted-foreground">{email}</span>
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="size-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut} variant="destructive">
                <LogOut className="size-4" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
