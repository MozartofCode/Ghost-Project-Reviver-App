import { cookies } from 'next/headers'

export interface SessionData {
    userId: string
    githubId: number
    username: string
    email?: string
    avatarUrl?: string
    createdAt: number
}

const SESSION_COOKIE_NAME = 'phoenix_session'
const SESSION_DURATION = 30 * 24 * 60 * 60 * 1000 // 30 days in ms

/**
 * Generate a simple session token
 * For production, use proper JWT library like 'jose' or 'jsonwebtoken'
 */
export function generateSessionToken(data: Omit<SessionData, 'createdAt'>): string {
    const sessionData: SessionData = {
        ...data,
        createdAt: Date.now(),
    }

    // Simple base64 encoding - In production, use proper JWT with signing
    const payload = JSON.stringify(sessionData)
    const token = Buffer.from(payload).toString('base64url')

    return token
}

/**
 * Verify and decode session token
 */
export function verifySessionToken(token: string): SessionData | null {
    try {
        const payload = Buffer.from(token, 'base64url').toString('utf-8')
        const data: SessionData = JSON.parse(payload)

        // Check if token is expired
        const age = Date.now() - data.createdAt
        if (age > SESSION_DURATION) {
            return null
        }

        return data
    } catch (error) {
        console.error('Invalid session token:', error)
        return null
    }
}

/**
 * Create session cookie (server-side only)
 */
export async function createSession(data: Omit<SessionData, 'createdAt'>) {
    const token = generateSessionToken(data)
    const cookieStore = await cookies()

    cookieStore.set(SESSION_COOKIE_NAME, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: SESSION_DURATION / 1000, // in seconds
        path: '/',
    })

    return token
}

/**
 * Get current session (server-side only)
 */
export async function getSession(): Promise<SessionData | null> {
    const cookieStore = await cookies()
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value

    if (!token) {
        return null
    }

    return verifySessionToken(token)
}

/**
 * Delete session cookie (server-side only)
 */
export async function deleteSession() {
    const cookieStore = await cookies()
    cookieStore.delete(SESSION_COOKIE_NAME)
}

/**
 * Check if user is authenticated (server-side only)
 */
export async function isAuthenticated(): Promise<boolean> {
    const session = await getSession()
    return session !== null
}

