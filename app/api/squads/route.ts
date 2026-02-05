import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/service'
import { getSession } from '@/lib/auth/session'

/**
 * GET /api/squads
 * List all squads (with optional repo_id filter)
 */
export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams
        const repoId = searchParams.get('repo_id')

        const supabase = createServiceClient()

        let query = supabase
            .from('squads')
            .select(`
        *,
        creator:users!squads_created_by_fkey(id, username, avatar_url)
      `)
            .eq('is_active', true)
            .order('created_at', { ascending: false })

        if (repoId) {
            query = query.eq('repo_id', repoId)
        }

        const { data: squads, error } = await query

        if (error) {
            console.error('Error fetching squads:', error)
            return NextResponse.json(
                { error: 'Failed to fetch squads' },
                { status: 500 }
            )
        }

        return NextResponse.json({ squads })
    } catch (error) {
        console.error('Squads API error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}

/**
 * POST /api/squads
 * Create a new squad
 */
export async function POST(request: NextRequest) {
    try {
        const session = await getSession()

        if (!session) {
            return NextResponse.json(
                { error: 'Not authenticated' },
                { status: 401 }
            )
        }

        const body = await request.json()
        const { repo_id, name, description } = body

        if (!repo_id || !name) {
            return NextResponse.json(
                { error: 'repo_id and name are required' },
                { status: 400 }
            )
        }

        const supabase = createServiceClient()

        // Create the squad
        const { data: squad, error: squadError } = await supabase
            .from('squads')
            .insert({
                repo_id,
                name,
                description: description || null,
                created_by: session.userId,
            })
            .select()
            .single()

        if (squadError) {
            console.error('Error creating squad:', squadError)

            // Check for duplicate name error
            if (squadError.code === '23505') {
                return NextResponse.json(
                    { error: 'A squad with this name already exists for this project' },
                    { status: 409 }
                )
            }

            return NextResponse.json(
                { error: 'Failed to create squad' },
                { status: 500 }
            )
        }

        // Auto-join creator as first member with 'creator' role
        const { error: memberError } = await supabase
            .from('squad_members')
            .insert({
                squad_id: squad.id,
                user_id: session.userId,
                role: 'creator',
            })

        if (memberError) {
            console.error('Error adding creator to squad:', memberError)
            // Squad was created but creator wasn't added - this is a partial failure
            // We should still return success but log the error
        }

        return NextResponse.json({
            squad,
            message: 'Squad created successfully'
        }, { status: 201 })
    } catch (error) {
        console.error('Create squad error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
