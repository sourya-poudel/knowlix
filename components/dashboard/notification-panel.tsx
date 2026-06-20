'use client'

import { useEffect, useState } from 'react'
import { Bell, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { toast } from 'sonner'

export type NotificationItem = {
  id: string
  type: string
  title: string
  body?: string
  linkUrl?: string
  isRead: boolean
  createdAt: string
}

export function NotificationPanel() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([])
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (open) {
      fetchNotifications()
    }
  }, [open])

  async function fetchNotifications() {
    const res = await fetch('/api/notifications')
    if (!res.ok) {
      toast.error('Unable to load notifications')
      return
    }
    setNotifications(await res.json())
  }

  return (
    <div className="relative">
      <Button variant="ghost" size="icon" onClick={() => setOpen(!open)}>
        <Bell className="size-5" aria-hidden="true" />
      </Button>
      {open ? (
        <div className="absolute right-0 z-20 mt-2 w-80 rounded-3xl border border-border bg-card p-4 shadow-lg">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold">Notifications</h2>
            <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
              <X className="size-4" />
            </Button>
          </div>
          <div className="space-y-3">
            {notifications.length === 0 ? (
              <p className="text-sm text-muted-foreground">No notifications yet.</p>
            ) : (
              notifications.map((notification) => (
                <Card key={notification.id} className="p-3">
                  <p className="text-sm font-semibold">{notification.title}</p>
                  {notification.body ? (
                    <p className="mt-1 text-sm text-muted-foreground">{notification.body}</p>
                  ) : null}
                  {notification.linkUrl ? (
                    <a
                      href={notification.linkUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-2 inline-block text-sm font-medium text-primary hover:underline"
                    >
                      Open link
                    </a>
                  ) : null}
                </Card>
              ))
            )}
          </div>
        </div>
      ) : null}
    </div>
  )
}
