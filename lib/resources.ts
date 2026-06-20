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
