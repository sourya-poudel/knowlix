export const RESOURCE_TYPES = [
  { value: 'notes', label: 'Lecture Notes' },
  { value: 'cheatsheet', label: 'Cheat Sheet' },
  { value: 'exam', label: 'Past Exam' },
  { value: 'problemset', label: 'Problem Set' },
  { value: 'slides', label: 'Slides' },
  { value: 'summary', label: 'Study Guide' },
] as const

export type ResourceType = (typeof RESOURCE_TYPES)[number]['value']

export function resourceTypeLabel(value: string) {
  return RESOURCE_TYPES.find((t) => t.value === value)?.label ?? 'Resource'
}

export const REPORT_REASONS = [
  { value: 'copyright', label: 'Copyright violation' },
  { value: 'incorrect', label: 'Incorrect or misleading' },
  { value: 'duplicate', label: 'Duplicate upload' },
  { value: 'spam', label: 'Spam or low quality' },
  { value: 'other', label: 'Other' },
] as const

export function reputationTier(reputation: number) {
  if (reputation >= 5000) return { label: 'Luminary', color: 'text-chart-5' }
  if (reputation >= 2000) return { label: 'Scholar', color: 'text-chart-1' }
  if (reputation >= 1000) return { label: 'Contributor', color: 'text-chart-3' }
  if (reputation >= 250) return { label: 'Rising', color: 'text-chart-2' }
  return { label: 'Newcomer', color: 'text-muted-foreground' }
}

export function formatFileSize(bytes: number | null | undefined) {
  if (!bytes) return '—'
  const units = ['B', 'KB', 'MB', 'GB']
  let size = bytes
  let i = 0
  while (size >= 1024 && i < units.length - 1) {
    size /= 1024
    i++
  }
  return `${size.toFixed(size < 10 && i > 0 ? 1 : 0)} ${units[i]}`
}

export function timeAgo(date: Date | string) {
  const d = typeof date === 'string' ? new Date(date) : date
  const seconds = Math.floor((Date.now() - d.getTime()) / 1000)
  const intervals: [number, string][] = [
    [31536000, 'year'],
    [2592000, 'month'],
    [604800, 'week'],
    [86400, 'day'],
    [3600, 'hour'],
    [60, 'minute'],
  ]
  for (const [secs, label] of intervals) {
    const count = Math.floor(seconds / secs)
    if (count >= 1) return `${count} ${label}${count > 1 ? 's' : ''} ago`
  }
  return 'just now'
}
