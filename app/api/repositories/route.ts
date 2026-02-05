import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const language = searchParams.get('language')
    const status = searchParams.get('status')
    const query = searchParams.get('query')

    const supabase = await createClient()

    let dbQuery = supabase
        .from('repositories')
        .select('*')
        .order('stars_count', { ascending: false })

    // Apply filters
    if (language && language !== 'all') {
        dbQuery = dbQuery.eq('language', language)
    }

    if (status && status !== 'all') {
        dbQuery = dbQuery.eq('abandonment_status', status)
    }

    if (query) {
        dbQuery = dbQuery.or(`name.ilike.%${query}%,description.ilike.%${query}%,full_name.ilike.%${query}%`)
    }

    const { data: repositories, error } = await dbQuery

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ repositories })
}
