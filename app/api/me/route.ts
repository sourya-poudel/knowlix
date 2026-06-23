import { getRequestUser } from '@/lib/session'

export async function GET(req: Request) {
  const user = await getRequestUser(req.headers)
  if (!user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  return Response.json({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    institutionId: user.institutionId,
    reputation: user.reputation,
    status: user.status,
  })
}
