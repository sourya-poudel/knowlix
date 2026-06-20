export async function createResource(data: any) {
  const res = await fetch('/api/resources', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  return res.json()
}

export async function toggleBookmark(resourceId: string, isBookmarked: boolean) {
  if (isBookmarked) {
    const res = await fetch('/api/bookmarks', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ resourceId }),
    })
    return res.json()
  }
  const res = await fetch('/api/bookmarks', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ resourceId }),
  })
  return res.json()
}
