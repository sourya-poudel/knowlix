import { createAuthClient } from 'better-auth/react'
import { auth } from '@/lib/auth'

export const authClient = createAuthClient()

export const { signIn, signUp, signOut, useSession } = authClient
