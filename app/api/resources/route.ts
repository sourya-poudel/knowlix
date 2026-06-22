import { eq } from 'drizzle-orm'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { resource as resourceTable } from '@/lib/db/schema'
import { BlobServiceClient } from '@azure/storage-blob'
import path from 'node:path'

export async function POST(req: Request) {
  const session = await auth.api.getSession({ headers: req.headers })
  if (!session?.user) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })

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

  const title = getValue('title') || 'Untitled'
  const description = getValue('description') || null
  const type = (getValue('type') || 'notes') as string
  const courseCode = getValue('courseCode') || null
  const courseName = getValue('courseName') || null
  const semester = getValue('semester') || null
  const yearValue = getValue('year')
  const year = yearValue ? Number(yearValue) : null

  const institutionId = getValue('institutionId') || session.user.institutionId
  if (!institutionId) {
    return new Response(JSON.stringify({ error: 'Institution ID is required' }), { status: 400 })
  }

  await db.insert(resourceTable).values({
    id,
    userId: session.user.id,
    institutionId,
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
  const url = new URL(req.url)
  const userId = url.searchParams.get('userId')
  if (!userId) return new Response(JSON.stringify({ error: 'userId required' }), { status: 400 })

  const rows = await db.select().from(resourceTable).where(eq(resourceTable.userId, userId))
  return new Response(JSON.stringify(rows), { status: 200 })
}
