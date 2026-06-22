import { getRequestUser } from '@/lib/session'
import { getUserProfile } from '@/lib/resource-queries'

type RouteContext = { params: Promise<{ id: string }> }

export async function GET(req: Request, context: RouteContext) {
  const user = await getRequestUser(req.headers)
  if (!user) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })

  const { id } = await context.params
  const profile = await getUserProfile(id)
  if (!profile) {
    return new Response(JSON.stringify({ error: 'User not found' }), { status: 404 })
  }

  return new Response(
    JSON.stringify({
      ...profile,
      user: {
        ...profile.user,
        createdAt: profile.user.createdAt.toISOString(),
        updatedAt: profile.user.updatedAt.toISOString(),
      },
      institution: profile.institution
        ? { ...profile.institution, createdAt: profile.institution.createdAt.toISOString() }
        : null,
      uploads: profile.uploads.map((u) => ({
        ...u,
        createdAt: u.createdAt.toISOString(),
        updatedAt: u.updatedAt.toISOString(),
      })),
      collections: profile.collections.map((c) => ({
        ...c,
        createdAt: c.createdAt.toISOString(),
      })),
    }),
    { status: 200 },
  )
}
