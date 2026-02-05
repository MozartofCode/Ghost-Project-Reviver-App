import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/service'
import { getSession } from '@/lib/auth/session'

/**
 * GET /api/squads/[squadId]/members
 * Get all members in a squad
 */
export async function GET(
    request: NextRequest,
    { params }: { params: { squadId: string } }
) {
    try {
        const { squadId } = params
        const supabase = createServiceClient()

        const { data: members, error } = await supabase
            .from('squad_members')
            .select(`
        *,
        user:users(id, username, avatar_url, github_id, bio)
      `)
            .eq('squad_id', squadId)
            .order('joined_at', { ascending: true })

        if (error) {
            console.error('Error fetching squad members:', error)
            return NextResponse.json(
                { error: 'Failed to fetch members' },
                { status: 500 }
            )
        }

        return NextResponse.json({ members: members || [] })
    } catch (error) {
        console.error('Get squad members error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}

/**
 * POST /api/squads/[squadId]/members
 * Join a squad
 */
export async function POST(
    request: NextRequest,
    { params }: { params: { squadId: string } }
) {
    try {
        const session = await getSession()

        if (!session) {
            return NextResponse.json(
                { error: 'Not authenticated' },
                { status: 401 }
            )
        }

        const { squadId } = params
        const body = await request.json().catch(() => ({}))
        const role = body.role || 'member'

        const supabase = createServiceClient()

        // Check if squad exists
        const { data: squad, error: squadError } = await supabase
            .from('squads')
            .select('id, name, is_active')
            .eq('id', squadId)
            .single()

        if (squadError || !squad) {
            return NextResponse.json(
                { error: 'Squad not found' },
                { status: 404 }
            )
        }

        if (!squad.is_active) {
            return NextResponse.json(
                { error: 'This squad is no longer active' },
                { status: 400 }
            )
        }

        // Check if user is already a member
        const { data: existingMember } = await supabase
            .from('squad_members')
            .select('id')
            .eq('squad_id', squadId)
            .eq('user_id', session.userId)
            .single()

        if (existingMember) {
            return NextResponse.json(
                { error: 'You are already a member of this squad' },
                { status: 409 }
            )
        }

        // Add user to squad
        const { data: member, error: memberError } = await supabase
            .from('squad_members')
            .insert({
                squad_id: squadId,
                user_id: session.userId,
                role: role === 'creator' || role === 'moderator' ? 'member' : role, // Prevent self-promotion
            })
            .select(`
        *,
        user:users(id, username, avatar_url)
      `)
            .single()

        if (memberError) {
            console.error('Error joining squad:', memberError)
            return NextResponse.json(
                { error: 'Failed to join squad' },
                { status: 500 }
            )
        }

        return NextResponse.json({
            member,
            message: `Successfully joined "${squad.name}"`
        }, { status: 201 })
    } catch (error) {
        console.error('Join squad error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}

/**
 * DELETE /api/squads/[squadId]/members
 * Leave a squad (remove own membership)
 */
export async function DELETE(
    request: NextRequest,
    { params }: { params: { squadId: string } }
) {
    try {
        const session = await getSession()

        if (!session) {
            return NextResponse.json(
                { error: 'Not authenticated' },
                { status: 401 }
            )
        }

        const { squadId } = params
        const supabase = createServiceClient()

        // Get squad name for response message
        const { data: squad } = await supabase
            .from('squads')
            .select('name')
            .eq('id', squadId)
            .single()

        // Remove user from squad
        const { error } = await supabase
            .from('squad_members')
            .delete()
            .eq('squad_id', squadId)
            .eq('user_id', session.userId)

        if (error) {
            console.error('Error leaving squad:', error)
            return NextResponse.json(
                { error: 'Failed to leave squad' },
                { status: 500 }
            )
        }

        return NextResponse.json({
            message: squad ? `Left "${squad.name}" successfully` : 'Left squad successfully'
        })
    } catch (error) {
        console.error('Leave squad error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
