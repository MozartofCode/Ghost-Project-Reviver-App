import { NextRequest, NextResponse } from 'next/server'
import { deleteSession } from '@/lib/auth/session'

/**
 * Logout user
 * POST /api/auth/logout
 */
export async function POST(request: NextRequest) {
    try {
        await deleteSession()

        return NextResponse.json({ message: 'Logged out successfully' })
    } catch (error) {
        console.error('Error logging out:', error)
        return NextResponse.json(
            { error: 'Failed to logout' },
            { status: 500 }
        )
    }
}
