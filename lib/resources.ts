export async function createResource(data: any) {
  const res = await fetch('/api/resources', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  return res.json()
}

export async function toggleBookmark(resourceId: string, isBookmarked: boolean) {
  const method = isBookmarked ? 'DELETE' : 'POST'
  const res = await fetch('/api/bookmarks', {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ resourceId }),
  })

  const data = await res.json()
  if (!res.ok) throw new Error(data?.error || 'Bookmark request failed')
  return data
}
