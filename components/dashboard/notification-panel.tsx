'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Bell, CheckCheck, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { timeAgo } from '@/lib/constants'
import { markNotificationsRead } from '@/lib/resources'
import { toast } from 'sonner'

export type NotificationItem = {
  id: string
  type: string
  title: string
  body?: string | null
  linkUrl?: string | null
  isRead: boolean
  createdAt: string
}

export function NotificationPanel() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([])
  const [open, setOpen] = useState(false)

  const unreadCount = notifications.filter((n) => !n.isRead).length

  useEffect(() => {
    fetchNotifications()
  }, [])

  useEffect(() => {
    if (open) fetchNotifications()
  }, [open])

  async function fetchNotifications() {
    const res = await fetch('/api/notifications')
    if (!res.ok) {
      if (open) toast.error('Unable to load notifications')
      return
    }
    setNotifications(await res.json())
  }

  async function handleMarkAllRead() {
    try {
      await markNotificationsRead()
      setNotifications((items) => items.map((item) => ({ ...item, isRead: true })))
    } catch {
      toast.error('Unable to mark notifications read')
    }
  }

  return (
    <div className="relative">
      <Button variant="ghost" size="icon" onClick={() => setOpen(!open)} aria-label="Notifications">
        <Bell className="size-5" aria-hidden="true" />
        {unreadCount > 0 ? (
          <Badge className="absolute -right-1 -top-1 size-5 justify-center rounded-full p-0 text-[10px]">
            {unreadCount > 9 ? '9+' : unreadCount}
          </Badge>
        ) : null}
      </Button>
      {open ? (
        <div className="absolute right-0 z-20 mt-2 w-80 rounded-3xl border border-border bg-card p-4 shadow-lg sm:w-96">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold">Notifications</h2>
              {unreadCount > 0 ? (
                <p className="text-xs text-muted-foreground">{unreadCount} unread</p>
              ) : null}
            </div>
            <div className="flex items-center gap-1">
              {unreadCount > 0 ? (
                <Button variant="ghost" size="icon-sm" aria-label="Mark all read" onClick={handleMarkAllRead}>
                  <CheckCheck className="size-4" />
                </Button>
              ) : null}
              <Button variant="ghost" size="icon-sm" onClick={() => setOpen(false)}>
                <X className="size-4" />
              </Button>
            </div>
          </div>
          <div className="max-h-96 space-y-3 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="text-sm text-muted-foreground">No notifications yet.</p>
            ) : (
              notifications.map((notification) => (
                <Card
                  key={notification.id}
                  className={`p-3 shadow-none ${notification.isRead ? 'opacity-70' : 'border-primary/20 bg-primary/5'}`}
                >
                  <p className="text-sm font-semibold">{notification.title}</p>
                  {notification.body ? (
                    <p className="mt-1 text-sm text-muted-foreground">{notification.body}</p>
                  ) : null}
                  <div className="mt-2 flex items-center justify-between gap-2">
                    <span className="text-xs text-muted-foreground">{timeAgo(notification.createdAt)}</span>
                    {notification.linkUrl ? (
                      <Link
                        href={notification.linkUrl}
                        className="text-sm font-medium text-primary hover:underline"
                        onClick={() => setOpen(false)}
                      >
                        View
                      </Link>
                    ) : null}
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>
      ) : null}
    </div>
  )
}
