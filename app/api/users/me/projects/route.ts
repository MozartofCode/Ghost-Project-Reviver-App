import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/service'
import { getSession } from '@/lib/auth/session'

/**
 * GET /api/users/me/projects
 * Get all projects the user is involved in (via squad membership)
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

        // Get all unique projects where user is in at least one squad
        const { data, error } = await supabase
            .from('squad_members')
            .select(`
        squad:squads (
          repo:repositories (
            id,
            name,
            full_name,
            description,
            abandonment_status,
            maintenance_score,
            last_commit_at,
            stars_count,
            language
          )
        )
      `)
            .eq('user_id', session.userId)

        if (error) {
            console.error('Error fetching user projects:', error)
            return NextResponse.json(
                { error: 'Failed to fetch projects' },
                { status: 500 }
            )
        }

        // Extract unique projects and count squads per project
        const projectMap = new Map()

        data?.forEach((item: any) => {
            const repo = item.squad?.repo
            if (!repo) return

            if (projectMap.has(repo.id)) {
                // Increment squad count for this project
                projectMap.get(repo.id).squad_count++
            } else {
                // Add new project
                projectMap.set(repo.id, {
                    id: repo.id,
                    name: repo.name,
                    full_name: repo.full_name,
                    description: repo.description,
                    abandonment_status: repo.abandonment_status,
                    maintenance_score: repo.maintenance_score,
                    last_activity: repo.last_commit_at,
                    stars_count: repo.stars_count,
                    language: repo.language,
                    squad_count: 1,
                    url: `/repositories/${repo.id}`
                })
            }
        })

        // Convert map to array and sort by last activity
        const projects = Array.from(projectMap.values()).sort((a, b) => {
            if (!a.last_activity) return 1
            if (!b.last_activity) return -1
            return new Date(b.last_activity).getTime() - new Date(a.last_activity).getTime()
        })

        return NextResponse.json({ projects })
    } catch (error) {
        console.error('Get user projects error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
