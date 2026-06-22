export async function createResource(data: any) {
  const formData = new FormData()
  formData.append('title', data.title ?? '')
  formData.append('description', data.description ?? '')
  formData.append('type', data.type ?? 'notes')
  formData.append('courseCode', data.courseCode ?? '')
  formData.append('courseName', data.courseName ?? '')
  formData.append('semester', data.semester ?? '')
  formData.append('year', data.year != null ? String(data.year) : '')

  if (data.file) {
    formData.append('file', data.file)
  }

  const res = await fetch('/api/resources', {
    method: 'POST',
    body: formData,
  })

  const json = await res.json()
  if (!res.ok) throw new Error(json?.error || 'Resource upload failed')
  return json
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

export async function fetchResource(id: string) {
  const res = await fetch(`/api/resources/${id}`)
  const data = await res.json()
  if (!res.ok) throw new Error(data?.error || 'Failed to load resource')
  return data
}

export async function rateResource(resourceId: string, value: number) {
  const res = await fetch('/api/ratings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ resourceId, value }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data?.error || 'Rating failed')
  return data
}

export async function createComment(input: {
  resourceId: string
  body: string
  parentId?: string | null
}) {
  const res = await fetch('/api/comments', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data?.error || 'Comment failed')
  return data
}

export async function updateComment(id: string, body: string) {
  const res = await fetch(`/api/comments/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ body }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data?.error || 'Update failed')
  return data
}

export async function deleteComment(id: string) {
  const res = await fetch(`/api/comments/${id}`, { method: 'DELETE' })
  const data = await res.json()
  if (!res.ok) throw new Error(data?.error || 'Delete failed')
  return data
}

export async function moderateComment(id: string, action: 'hide' | 'unhide') {
  const res = await fetch(`/api/comments/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data?.error || 'Moderation failed')
  return data
}

export async function markCommentHelpful(id: string) {
  const res = await fetch(`/api/comments/${id}/helpful`, { method: 'POST' })
  const data = await res.json()
  if (!res.ok) throw new Error(data?.error || 'Helpful vote failed')
  return data
}

export async function createCollection(name: string, description?: string, isPublic = false) {
  const res = await fetch('/api/collections', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, description, isPublic }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data?.error || 'Collection creation failed')
  return data
}

export async function addToCollection(collectionId: string, resourceId: string) {
  const res = await fetch(`/api/collections/${collectionId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ resourceId }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data?.error || 'Add to collection failed')
  return data
}

export async function removeFromCollection(collectionId: string, resourceId: string) {
  const res = await fetch(`/api/collections/${collectionId}?resourceId=${resourceId}`, {
    method: 'DELETE',
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data?.error || 'Remove from collection failed')
  return data
}

export async function createRequest(input: {
  title: string
  description?: string
  courseCode?: string
}) {
  const res = await fetch('/api/requests', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data?.error || 'Request failed')
  return data
}

export async function voteRequest(requestId: string) {
  const res = await fetch(`/api/requests/${requestId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'vote' }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data?.error || 'Vote failed')
  return data
}

export async function fulfillRequest(requestId: string, resourceId: string) {
  const res = await fetch(`/api/requests/${requestId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'fulfill', resourceId }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data?.error || 'Fulfill failed')
  return data
}

export async function markNotificationsRead(ids?: string[]) {
  const res = await fetch('/api/notifications', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ids }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data?.error || 'Mark read failed')
  return data
}
