import { getRequestUser } from '@/lib/session'
import { getOpenRequests } from '@/lib/resource-queries'
import { db } from '@/lib/db'
import { request as requestTable } from '@/lib/db/schema'

export async function GET(req: Request) {
  const user = await getRequestUser(req.headers)
  if (!user?.institutionId) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
  }

  const items = await getOpenRequests(user.institutionId, user.id)
  return new Response(JSON.stringify(items), { status: 200 })
}

export async function POST(req: Request) {
  const user = await getRequestUser(req.headers)
  if (!user?.institutionId) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
  }

  const body = await req.json().catch(() => ({}))
  const title = String(body.title ?? '').trim()
  const description = body.description ? String(body.description).trim() : null
  const courseCode = body.courseCode ? String(body.courseCode).trim() : null

  if (!title) {
    return new Response(JSON.stringify({ error: 'title is required' }), { status: 400 })
  }

  const id = crypto.randomUUID()
  await db.insert(requestTable).values({
    id,
    institutionId: user.institutionId,
    userId: user.id,
    title,
    description,
    courseCode,
  })

  return new Response(JSON.stringify({ success: true, id }), { status: 201 })
}
