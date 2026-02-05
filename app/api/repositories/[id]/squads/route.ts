import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/service'
import { getSession } from '@/lib/auth/session'

/**
 * GET /api/repositories/[id]/squads
 * Get all squads for a specific repository
 */
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { id: repoId } = params
        const session = await getSession()
        const supabase = createServiceClient()

        // Get all squads for this repo
        const { data: squads, error } = await supabase
            .from('squads')
            .select('*')
            .eq('repo_id', repoId)
            // .eq('is_active', true) // Column doesn't exist
            .order('created_at', { ascending: false })

        if (error) {
            console.error('Error fetching repository squads:', error)
            return NextResponse.json(
                { error: 'Failed to fetch squads' },
                { status: 500 }
            )
        }

        // If user is authenticated, check which squads they're in
        if (session && squads && squads.length > 0) {
            const squadIds = squads.map(s => s.id)

            const { data: memberships } = await supabase
                .from('squad_members')
                .select('squad_id, role')
                .eq('user_id', session.userId)
                .in('squad_id', squadIds)

            const membershipMap = new Map(
                memberships?.map(m => [m.squad_id, m.role]) || []
            )

            // Add is_user_member and user_role to each squad
            const squadsWithMembership = squads.map(squad => ({
                ...squad,
                is_user_member: membershipMap.has(squad.id),
                user_role: membershipMap.get(squad.id) || null
            }))

            return NextResponse.json({ squads: squadsWithMembership })
        }

        // For non-authenticated users, just return squads without membership info
        const squadsWithMembership = squads?.map(squad => ({
            ...squad,
            is_user_member: false,
            user_role: null
        })) || []

        return NextResponse.json({ squads: squadsWithMembership })
    } catch (error) {
        console.error('Get repository squads error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
