import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth/session'
import { createServiceClient } from '@/lib/supabase/service'

/**
 * Get current authenticated user
 * GET /api/auth/me
 */
export async function GET(request: NextRequest) {
    try {
        const session = await getSession()

        if (!session) {
            return NextResponse.json(
                { error: 'Not authenticated' },
                { status: 401 }
            )
        }

        // Fetch full user data from database using service client
        const supabase = createServiceClient()
        const { data: user, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.userId)
            .single()

        if (error || !user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            )
        }

        return NextResponse.json({ user })
    } catch (error) {
        console.error('Error fetching user:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
