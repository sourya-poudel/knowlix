import { and, eq } from 'drizzle-orm'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { resource as resourceTable } from '@/lib/db/schema'
import { user as userTable } from '@/lib/db/schema'
import { BlobServiceClient } from '@azure/storage-blob'
import path from 'node:path'
import { RESOURCE_TYPES } from '@/lib/constants'

export async function POST(req: Request) {
  const session = await auth.api.getSession({ headers: req.headers })
  if (!session?.user) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })

  const currentUserRows = await db
    .select()
    .from(userTable)
    .where(eq(userTable.id, session.user.id))
    .limit(1)
  const currentUser = currentUserRows[0]

  if (!currentUser?.institutionId) {
    return new Response(JSON.stringify({ error: 'Institution membership is required' }), {
      status: 400,
    })
  }

  const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING
  const containerName = process.env.AZURE_STORAGE_CONTAINER_NAME
  if (!connectionString || !containerName) {
    return new Response(JSON.stringify({ error: 'Azure storage is not configured' }), { status: 500 })
  }

  const contentType = req.headers.get('content-type') ?? ''
  const isMultipart = contentType.startsWith('multipart/form-data')
  const body = isMultipart ? await req.formData() : null

  const id = crypto.randomUUID()
  let fileUrl: string | null = null
  let fileName: string | null = null
  let fileSize: number | null = null
  let fileType: string | null = null

  if (isMultipart && body) {
    const file = body.get('file') as File | null
    if (file && file instanceof File && file.size > 0) {
      const safeName = path.basename(file.name).replace(/[^a-zA-Z0-9_.-]/g, '_')
      const storedName = `resources/${crypto.randomUUID()}-${safeName}`

      const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString)
      const containerClient = blobServiceClient.getContainerClient(containerName)
      await containerClient.createIfNotExists()
      const blobClient = containerClient.getBlockBlobClient(storedName)
      await blobClient.uploadData(await file.arrayBuffer(), {
        blobHTTPHeaders: { blobContentType: file.type || 'application/octet-stream' },
      })

      fileUrl = blobClient.url
      fileName = file.name
      fileSize = file.size
      fileType = file.type || path.extname(file.name).slice(1)
    }
  }

  const getValue = (field: string) => {
    if (isMultipart && body) {
      const value = body.get(field)
      return value === null ? null : String(value)
    }
    return null
  }

  const title = (getValue('title') || '').trim()
  const description = getValue('description')?.trim() || null
  const type = getValue('type') || 'notes'
  const courseCode = getValue('courseCode') || null
  const courseName = getValue('courseName') || null
  const semester = getValue('semester') || null
  const yearValue = getValue('year')
  const year = yearValue ? Number(yearValue) : null

  if (!title) {
    return new Response(JSON.stringify({ error: 'title is required' }), { status: 400 })
  }

  if (!RESOURCE_TYPES.some((option) => option.value === type)) {
    return new Response(JSON.stringify({ error: 'Invalid resource type' }), { status: 400 })
  }

  if (yearValue && Number.isNaN(year)) {
    return new Response(JSON.stringify({ error: 'Invalid year value' }), { status: 400 })
  }

  await db.insert(resourceTable).values({
    id,
    userId: session.user.id,
    institutionId: currentUser.institutionId,
    title,
    description,
    type,
    courseCode,
    courseName,
    professor: getValue('professor') || null,
    semester,
    year,
    fileUrl,
    fileName,
    fileSize,
    fileType,
    status: 'pending',
  })

  return new Response(JSON.stringify({ success: true, id }), { status: 201 })
}

export async function GET(req: Request) {
  const session = await auth.api.getSession({ headers: req.headers })
  if (!session?.user) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })

  const url = new URL(req.url)
  const userId = url.searchParams.get('userId')

  const currentUserRows = await db
    .select()
    .from(userTable)
    .where(eq(userTable.id, session.user.id))
    .limit(1)
  const currentUser = currentUserRows[0]

  if (!currentUser) {
    return new Response(JSON.stringify({ error: 'User record not found' }), { status: 404 })
  }

  if (!currentUser.institutionId) {
    return new Response(JSON.stringify({ error: 'Institution membership is required' }), {
      status: 400,
    })
  }

  if (userId && userId !== currentUser.id && !['admin', 'moderator'].includes(currentUser.role)) {
    return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403 })
  }

  const rows = userId
    ? await db.select().from(resourceTable).where(eq(resourceTable.userId, userId))
    : await db
        .select()
        .from(resourceTable)
        .where(
          and(
            eq(resourceTable.institutionId, currentUser.institutionId),
            eq(resourceTable.status, 'approved'),
          ),
        )

  return new Response(JSON.stringify(rows), { status: 200 })
}
