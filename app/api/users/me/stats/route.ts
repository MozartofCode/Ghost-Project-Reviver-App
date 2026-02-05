import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/service'
import { getSession } from '@/lib/auth/session'

/**
 * GET /api/users/me/stats
 * Get user statistics (projects, squads, contributions)
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

        const supabase = createServiceClient()

        // Get user info for account created date
        const { data: user } = await supabase
            .from('users')
            .select('created_at')
            .eq('id', session.userId)
            .single()

        // Count total squads
        const { count: totalSquads } = await supabase
            .from('squad_members')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', session.userId)

        // Count unique projects (via squad membership)
        const { data: squadMemberships } = await supabase
            .from('squad_members')
            .select(`
        squad:squads (
          repo_id
        )
      `)
            .eq('user_id', session.userId)

        // Extract unique repo IDs
        const uniqueRepoIds = new Set(
            squadMemberships?.map(item => item.squad?.repo_id).filter(Boolean) || []
        )

        const stats = {
            total_projects: uniqueRepoIds.size,
            total_squads: totalSquads || 0,
            total_contributions: 0, // Future: track actual contributions
            account_created: user?.created_at || null
        }

        return NextResponse.json({ stats })
    } catch (error) {
        console.error('Get user stats error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
