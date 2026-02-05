import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const supabase = await createClient()

        const { data: repository, error } = await supabase
            .from('repositories')
            .select('*')
            .eq('id', id)
            .single()

        if (error) {
            if (error.code === 'PGRST116') {
                return NextResponse.json(
                    { error: 'Repository not found' },
                    { status: 404 }
                )
            }
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        // Increment views count
        await supabase
            .from('repositories')
            .update({ views_count: (repository.views_count || 0) + 1 })
            .eq('id', id)

        return NextResponse.json({ repository })
    } catch (error: any) {
        console.error('Error fetching repository:', error)
        return NextResponse.json(
            { error: error.message || 'Failed to fetch repository' },
            { status: 500 }
        )
    }
}
