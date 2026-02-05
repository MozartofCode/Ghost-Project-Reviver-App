import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { fetchGitHubRepo, fetchLatestCommitDate } from '@/lib/github/client'

export async function POST(request: Request) {
    try {
        const { repoFullName } = await request.json()

        if (!repoFullName || !repoFullName.includes('/')) {
            return NextResponse.json(
                { error: 'Invalid repository name. Format should be: owner/repo' },
                { status: 400 }
            )
        }

        // Fetch repository data from GitHub
        const githubRepoResult = await fetchGitHubRepo(repoFullName)

        if (!githubRepoResult.success || !githubRepoResult.data) {
            return NextResponse.json(
                { error: githubRepoResult.error || 'Repository not found on GitHub' },
                { status: 404 }
            )
        }

        const githubRepo = githubRepoResult.data

        // Get last commit date
        const lastCommitDate = await fetchLatestCommitDate(repoFullName)

        // Calculate abandonment status based on last commit
        const daysSinceLastCommit = lastCommitDate
            ? Math.floor((Date.now() - new Date(lastCommitDate).getTime()) / (1000 * 60 * 60 * 24))
            : 999

        let abandonmentStatus: 'active' | 'at-risk' | 'abandoned' = 'active'
        if (daysSinceLastCommit > 365) {
            abandonmentStatus = 'abandoned'
        } else if (daysSinceLastCommit > 180) {
            abandonmentStatus = 'at-risk'
        }

        // Calculate a simple maintenance score (0-100)
        // Lower score = harder to maintain
        const maintenanceScore = Math.max(
            0,
            Math.min(
                100,
                100 - (daysSinceLastCommit / 10) - (githubRepo.open_issues_count / 10)
            )
        )

        // Insert into Supabase
        const supabase = await createClient()

        const { data: repository, error } = await supabase
            .from('repositories')
            .insert({
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
                topics: githubRepo.topics || [],
                license_name: githubRepo.license_name,
                homepage_url: githubRepo.homepage_url,
                created_at_github: githubRepo.created_at_github,
                last_commit_at: lastCommitDate,
                last_push_at: githubRepo.last_push_at,
                abandonment_status: abandonmentStatus,
                maintenance_score: Math.round(maintenanceScore),
                is_analyzed: true,
            })
            .select()
            .single()

        if (error) {
            // Check if it's a duplicate
            if (error.code === '23505') {
                return NextResponse.json(
                    { error: 'Repository already exists in the database' },
                    { status: 409 }
                )
            }

            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        // Create activity feed entry
        await supabase.from('activity_feed').insert({
            activity_type: 'repo_added',
            repo_id: repository.id,
            metadata: {
                repo_name: repository.full_name,
                stars: repository.stars_count,
            },
        })

        return NextResponse.json({ repository }, { status: 201 })
    } catch (error: any) {
        console.error('Error importing repository:', error)
        return NextResponse.json(
            { error: error.message || 'Failed to import repository' },
            { status: 500 }
        )
    }
}
