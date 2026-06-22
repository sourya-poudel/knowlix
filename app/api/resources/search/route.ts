import { getRequestUser } from '@/lib/session'
import {
  getPopularResources,
  getRecommendedForUser,
  getTrendingResources,
  searchResources,
} from '@/lib/resource-queries'

export async function GET(req: Request) {
  const user = await getRequestUser(req.headers)
  if (!user?.institutionId) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
  }

  const url = new URL(req.url)
  const mode = url.searchParams.get('mode')

  if (mode === 'popular') {
    const items = await getPopularResources(user.institutionId)
    return new Response(JSON.stringify(items), { status: 200 })
  }

  if (mode === 'trending') {
    const items = await getTrendingResources(user.institutionId)
    return new Response(JSON.stringify(items), { status: 200 })
  }

  if (mode === 'recommended') {
    const items = await getRecommendedForUser(user.institutionId, user.id)
    return new Response(JSON.stringify(items), { status: 200 })
  }

  const yearParam = url.searchParams.get('year')
  const items = await searchResources(
    user.institutionId,
    {
      q: url.searchParams.get('q') ?? undefined,
      type: url.searchParams.get('type') ?? undefined,
      subject: url.searchParams.get('subject') ?? undefined,
      year: yearParam ? Number(yearParam) : undefined,
      contributorId: url.searchParams.get('contributor') ?? undefined,
      tag: url.searchParams.get('tag') ?? undefined,
    },
    user.id,
  )

  return new Response(JSON.stringify(items), { status: 200 })
}
