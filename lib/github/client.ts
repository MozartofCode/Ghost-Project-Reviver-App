import { Octokit } from '@octokit/rest'

/**
 * Create an Octokit client for GitHub API interactions
 * Uses personal access token for higher rate limits
 */
export function createGitHubClient() {
    const token = process.env.GITHUB_PERSONAL_ACCESS_TOKEN

    return new Octokit({
        auth: token,
        userAgent: 'project-phoenix-reviver/1.0.0',
    })
}

/**
 * Parse repository full name into owner and repo
 * @param fullName - e.g., "facebook/react"
 */
export function parseRepoFullName(fullName: string): { owner: string; repo: string } {
    const [owner, repo] = fullName.split('/')
    return { owner, repo }
}

/**
 * Fetch repository data from GitHub API
 */
export async function fetchGitHubRepo(fullName: string) {
    const client = createGitHubClient()
    const { owner, repo } = parseRepoFullName(fullName)

    try {
        const { data } = await client.rest.repos.get({
            owner,
            repo,
        })

        return {
            success: true,
            data: {
                github_repo_id: data.id,
                full_name: data.full_name,
                name: data.name,
                description: data.description,
                language: data.language,
                stars_count: data.stargazers_count,
                forks_count: data.forks_count,
                watchers_count: data.watchers_count,
                open_issues_count: data.open_issues_count,
                size_kb: data.size,
                default_branch: data.default_branch,
                homepage_url: data.homepage,
                topics: data.topics || [],
                license_name: data.license?.name,
                created_at_github: data.created_at,
                last_push_at: data.pushed_at,
            },
        }
    } catch (error: any) {
        return {
            success: false,
            error: error.message || 'Failed to fetch repository',
        }
    }
}

/**
 * Fetch the latest commit date for a repository
 */
export async function fetchLatestCommitDate(fullName: string): Promise<string | null> {
    const client = createGitHubClient()
    const { owner, repo } = parseRepoFullName(fullName)

    try {
        const { data } = await client.rest.repos.listCommits({
            owner,
            repo,
            per_page: 1,
        })

        return data[0]?.commit?.author?.date || null
    } catch (error) {
        console.error('Error fetching latest commit:', error)
        return null
    }
}

/**
 * Search for abandoned repositories on GitHub
 * This is a simplified version for MVP
 */
export async function searchAbandonedRepos(options: {
    language?: string
    minStars?: number
    page?: number
}) {
    const client = createGitHubClient()
    const { language, minStars = 50, page = 1 } = options

    // Search for repos with:
    // - No commits in last year
    // - Decent star count (shows it was useful)
    const oneYearAgo = new Date()
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1)
    const dateString = oneYearAgo.toISOString().split('T')[0]

    let query = `stars:>=${minStars} pushed:<${dateString}`
    if (language) {
        query += ` language:${language}`
    }

    try {
        const { data } = await client.rest.search.repos({
            q: query,
            sort: 'stars',
            order: 'desc',
            per_page: 30,
            page,
        })

        return {
            success: true,
            repos: data.items,
            total: data.total_count,
        }
    } catch (error: any) {
        return {
            success: false,
            error: error.message || 'Failed to search repositories',
            repos: [],
            total: 0,
        }
    }
}
