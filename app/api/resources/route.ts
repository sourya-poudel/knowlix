import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { resource as resourceTable } from '@/lib/db/schema'

export async function POST(req: Request) {
  const session = await auth.api.getSession({ headers: req.headers })
  if (!session?.user) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })

  const body = await req.json()
  const id = crypto.randomUUID()

  await db.insert(resourceTable).values({
    id,
    userId: session.user.id,
    institutionId: body.institutionId ?? session.user.institutionId,
    title: body.title ?? 'Untitled',
    description: body.description ?? null,
    type: body.type ?? 'notes',
    courseCode: body.courseCode ?? null,
    courseName: body.courseName ?? null,
    professor: body.professor ?? null,
    semester: body.semester ?? null,
    year: body.year ?? null,
    fileUrl: body.fileUrl ?? null,
    fileName: body.fileName ?? null,
    fileSize: body.fileSize ?? null,
    fileType: body.fileType ?? null,
    status: body.status ?? 'pending',
  })

  return new Response(JSON.stringify({ success: true, id }), { status: 201 })
}

export async function GET(req: Request) {
  // Optional: list resources (simple implementation)
  const url = new URL(req.url)
  const userId = url.searchParams.get('userId')
  if (!userId) return new Response(JSON.stringify({ error: 'userId required' }), { status: 400 })

  const rows = await db.select().from(resourceTable).where(resourceTable.userId.eq(userId))
  return new Response(JSON.stringify(rows), { status: 200 })
}
