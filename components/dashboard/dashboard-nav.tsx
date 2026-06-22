'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  Bookmark,
  Compass,
  FolderOpen,
  LayoutDashboard,
  LogOut,
  MessageSquarePlus,
  Search,
  Shield,
  User,
} from 'lucide-react'
import { toast } from 'sonner'
import { signOut } from '@/lib/auth-client'
import { BrandLogo } from '@/components/brand-logo'
import { Button } from '@/components/ui/button'
import { NotificationPanel } from '@/components/dashboard/notification-panel'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { ThemeToggle } from '@/components/theme-toggle'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/resources', label: 'Explore', icon: Compass },
  { href: '/bookmarks', label: 'Bookmarks', icon: Bookmark },
  { href: '/collections', label: 'Collections', icon: FolderOpen },
  { href: '/requests', label: 'Requests', icon: MessageSquarePlus },
]

export function DashboardNav({
  name,
  email,
  initials,
  userId,
  role,
}: {
  name: string
  email: string
  initials: string
  userId?: string
  role?: string
}) {
  const router = useRouter()

  async function handleSignOut() {
    await signOut()
    toast.success('Signed out')
    router.push('/login')
    router.refresh()
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/70 bg-background/85 shadow-[0_12px_40px_-32px_rgba(15,23,42,0.45)] backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <div className="flex items-center gap-4 lg:gap-6">
          <BrandLogo href="/dashboard" />
          <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
            {NAV_ITEMS.map((item) => (
              <Button key={item.href} variant="ghost" size="sm" render={<Link href={item.href} />}>
                <item.icon className="size-4" />
                {item.label}
              </Button>
            ))}
            {role === 'moderator' || role === 'admin' ? (
              <Button variant="ghost" size="sm" render={<Link href="/moderator" />}>
                <Shield className="size-4" />
                Moderate
              </Button>
            ) : null}
          </nav>
        </div>

        <div className="flex items-center gap-1.5">
          <ThemeToggle />
          <Button variant="ghost" size="icon" aria-label="Search" render={<Link href="/resources" />}>
            <Search className="size-4" />
          </Button>

          <NotificationPanel />

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
              {userId ? (
                <DropdownMenuItem render={<Link href={`/profile/${userId}`} />}>
                  <User className="size-4" />
                  Profile
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem>
                  <User className="size-4" />
                  Profile
                </DropdownMenuItem>
              )}
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
