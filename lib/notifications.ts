import { db } from '@/lib/db'
import { notification } from '@/lib/db/schema'

export type NotificationType =
  | 'resource_approved'
  | 'resource_rejected'
  | 'new_comment'
  | 'comment_reply'
  | 'request_fulfilled'
  | 'bookmark_update'
  | 'info'

export async function createNotification(input: {
  userId: string
  type: NotificationType
  title: string
  body?: string
  linkUrl?: string
}) {
  await db.insert(notification).values({
    id: crypto.randomUUID(),
    userId: input.userId,
    type: input.type,
    title: input.title,
    body: input.body ?? null,
    linkUrl: input.linkUrl ?? null,
    isRead: false,
  })
}

export async function notifyMany(
  userIds: string[],
  input: Omit<Parameters<typeof createNotification>[0], 'userId'>,
) {
  const uniqueIds = [...new Set(userIds.filter(Boolean))]
  if (uniqueIds.length === 0) return

  await db.insert(notification).values(
    uniqueIds.map((userId) => ({
      id: crypto.randomUUID(),
      userId,
      type: input.type,
      title: input.title,
      body: input.body ?? null,
      linkUrl: input.linkUrl ?? null,
      isRead: false,
    })),
  )
}
