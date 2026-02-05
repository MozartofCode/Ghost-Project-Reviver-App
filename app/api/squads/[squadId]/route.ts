import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/service'
import { getSession } from '@/lib/auth/session'

/**
 * GET /api/squads/[squadId]
 * Get squad details with members
 */
export async function GET(
    request: NextRequest,
    { params }: { params: { squadId: string } }
) {
    try {
        const { squadId } = params
        const supabase = createServiceClient()

        // Get squad with creator info
        const { data: squad, error: squadError } = await supabase
            .from('squads')
            .select(`
        *,
        creator:users!squads_created_by_fkey(id, username, avatar_url)
      `)
            .eq('id', squadId)
            .single()

        if (squadError || !squad) {
            return NextResponse.json(
                { error: 'Squad not found' },
                { status: 404 }
            )
        }

        // Get squad members with user info
        const { data: members, error: membersError } = await supabase
            .from('squad_members')
            .select(`
        *,
        user:users(id, username, avatar_url, github_id)
      `)
            .eq('squad_id', squadId)
            .order('joined_at', { ascending: true })

        if (membersError) {
            console.error('Error fetching squad members:', membersError)
        }

        // Check if current user is a member
        const session = await getSession()
        const isUserMember = session && members?.some(m => m.user_id === session.userId)
        const userRole = members?.find(m => m.user_id === session?.userId)?.role

        return NextResponse.json({
            squad: {
                ...squad,
                members: members || [],
                is_user_member: !!isUserMember,
                user_role: userRole || null
            }
        })
    } catch (error) {
        console.error('Get squad error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}

/**
 * PATCH /api/squads/[squadId]
 * Update squad details (only creator can update)
 */
export async function PATCH(
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
        const body = await request.json()
        const { name, description, is_active } = body

        const supabase = createServiceClient()

        // Check if user is the creator
        const { data: squad } = await supabase
            .from('squads')
            .select('created_by')
            .eq('id', squadId)
            .single()

        if (!squad || squad.created_by !== session.userId) {
            return NextResponse.json(
                { error: 'Only the squad creator can update this squad' },
                { status: 403 }
            )
        }

        // Update squad
        const updateData: any = {}
        if (name !== undefined) updateData.name = name
        if (description !== undefined) updateData.description = description
        if (is_active !== undefined) updateData.is_active = is_active

        const { data: updatedSquad, error } = await supabase
            .from('squads')
            .update(updateData)
            .eq('id', squadId)
            .select()
            .single()

        if (error) {
            console.error('Error updating squad:', error)
            return NextResponse.json(
                { error: 'Failed to update squad' },
                { status: 500 }
            )
        }

        return NextResponse.json({
            squad: updatedSquad,
            message: 'Squad updated successfully'
        })
    } catch (error) {
        console.error('Update squad error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}

/**
 * DELETE /api/squads/[squadId]
 * Delete squad (only creator can delete)
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

        // Check if user is the creator
        const { data: squad } = await supabase
            .from('squads')
            .select('created_by, name')
            .eq('id', squadId)
            .single()

        if (!squad || squad.created_by !== session.userId) {
            return NextResponse.json(
                { error: 'Only the squad creator can delete this squad' },
                { status: 403 }
            )
        }

        // Delete squad (cascade will delete members)
        const { error } = await supabase
            .from('squads')
            .delete()
            .eq('id', squadId)

        if (error) {
            console.error('Error deleting squad:', error)
            return NextResponse.json(
                { error: 'Failed to delete squad' },
                { status: 500 }
            )
        }

        return NextResponse.json({
            message: `Squad "${squad.name}" deleted successfully`
        })
    } catch (error) {
        console.error('Delete squad error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
