import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { fetchGitHubRepo } from '@/lib/github/client'

// A curated list of repositories that are either deprecated, abandoned, or in "maintenance mode"
const TARGET_REPOS = [
    'request/request', // Deprecated
    'moment/moment', // Maintenance mode
    'browserify/browserify', // Old
    'kriskowal/q', // Old promise library
    'jquery/jquery', // Classic
    'mustache/mustache.js',
    'marionettejs/backbone.marionette',
    'jashkenas/backbone',
    'meteor/meteor',
    'senchalabs/connect',
    'Automattic/mongoose', // Active but huge backlog, good example
    'socketio/socket.io',
    'gulpjs/gulp'
]

export async function GET() {
    try {
        const supabase = await createClient()
        const seededRepos = []
        const failedInserts = []
        const errors = []

        for (const fullName of TARGET_REPOS) {
            // Check existence logic skipped for brevity/simplicity in this step or handled by "ON CONFLICT" if I use SQL
            // But let's keep the check
            const { data: existing } = await supabase
                .from('repositories')
                .select('id')
                .eq('full_name', fullName)
                .single()

            if (existing) continue

            const result = await fetchGitHubRepo(fullName)
            if (!result.success || !result.data) {
                errors.push(`${fullName}: ${result.error}`)
                continue
            }

            const githubRepo = result.data

            let abandonmentStatus = 'at-risk'
            if (['request/request', 'kriskowal/q', 'marionettejs/backbone.marionette'].includes(fullName)) {
                abandonmentStatus = 'abandoned'
            }

            const maintenanceScore = Math.floor(Math.random() * 60) + 20

            const repoData = {
                github_repo_id: githubRepo.github_repo_id,
                full_name: githubRepo.full_name,
                name: githubRepo.name,
                description: githubRepo.description,
                language: githubRepo.language,
                stars_count: githubRepo.stars_count,
                forks_count: githubRepo.forks_count,
                watchers_count: githubRepo.watchers_count,
                open_issues_count: githubRepo.open_issues_count,
                size_kb: githubRepo.size_kb,
                default_branch: githubRepo.default_branch,
                topics: githubRepo.topics,
                license_name: githubRepo.license_name,
                created_at_github: githubRepo.created_at_github,
                last_commit_at: githubRepo.last_push_at,
                last_push_at: githubRepo.last_push_at,
                abandonment_status: abandonmentStatus,
                maintenance_score: maintenanceScore,
                homepage_url: githubRepo.homepage_url,
                is_analyzed: true,
                interest_count: Math.floor(Math.random() * 50)
            }

            const { data: repo, error } = await supabase
                .from('repositories')
                .insert(repoData)
                .select()
                .single()

            if (!error && repo) {
                seededRepos.push(repo.full_name)
            } else if (error) {
                errors.push(`${fullName}: ${error.message}`)
                failedInserts.push(repoData)
            }
        }

        return NextResponse.json({
            success: true,
            message: `Seeded ${seededRepos.length} repositories, ${failedInserts.length} failed inserts returned`,
            repos: seededRepos,
            failedInserts: failedInserts,
            errors: errors
        })

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
