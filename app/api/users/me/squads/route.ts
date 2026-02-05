import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/service'
import { getSession } from '@/lib/auth/session'

/**
 * GET /api/users/me/squads
 * Get all squads the user is a member of
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

        // Get all squads with project info
        const { data: squads, error } = await supabase
            .from('squad_members')
            .select(`
        id,
        role,
        joined_at,
        squad:squads (
          id,
          name,
          description,
          // member_count, // Column not in schema
          repo:repositories (
            id,
            name,
            full_name,
            description,
            abandonment_status,
            maintenance_score,
            language
          )
        )
      `)
            .eq('user_id', session.userId)
            .order('joined_at', { ascending: false })

        if (error) {
            console.error('Error fetching user squads:', error)
            return NextResponse.json(
                { error: 'Failed to fetch squads' },
                { status: 500 }
            )
        }

        // Format the response
        const formattedSquads = (squads as any)?.map((item: any) => ({
            id: item.squad.id,
            name: item.squad.name,
            description: item.squad.description,
            member_count: 0, // item.squad.member_count,
            role: item.role,
            joined_at: item.joined_at,
            project: {
                id: item.squad.repo.id,
                name: item.squad.repo.name,
                full_name: item.squad.repo.full_name,
                description: item.squad.repo.description,
                abandonment_status: item.squad.repo.abandonment_status,
                maintenance_score: item.squad.repo.maintenance_score,
                language: item.squad.repo.language,
                url: `/repositories/${item.squad.repo.id}`
            }
        })) || []

        return NextResponse.json({ squads: formattedSquads })
    } catch (error) {
        console.error('Get user squads error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
