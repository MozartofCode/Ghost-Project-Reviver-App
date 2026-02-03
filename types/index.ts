// Database types based on our schema

export type AbandonmentStatus = 'active' | 'at-risk' | 'abandoned' | 'reviving'

export type SquadRole = 'lead' | 'frontend' | 'backend' | 'designer' | 'qa' | 'docs' | 'contributor'

export interface User {
    id: string
    github_id: number
    username: string
    email?: string
    avatar_url?: string
    bio?: string
    location?: string
    website_url?: string
    twitter_username?: string
    is_active: boolean
    created_at: string
    updated_at: string
}

export interface Repository {
    id: string
    github_repo_id: number
    full_name: string
    name: string
    description?: string
    language?: string
    stars_count: number
    forks_count: number
    watchers_count: number
    open_issues_count: number
    size_kb: number
    default_branch: string
    homepage_url?: string
    topics: string[]
    license_name?: string
    created_at_github: string
    last_commit_at?: string
    last_push_at?: string
    abandonment_status: AbandonmentStatus
    maintenance_score?: number
    owner_id?: string
    is_analyzed: boolean
    last_analyzed_at?: string
    analysis_error?: string
    views_count: number
    interest_count: number
    created_at: string
    updated_at: string

    // Relations
    owner?: User
    squad?: SquadMember[]
}

export interface RepositoryMetrics {
    id: string
    repo_id: string
    dependency_debt_score?: number
    issue_backlog_score?: number
    doc_coverage_score?: number
    cyclomatic_complexity_avg?: number
    commit_frequency_score?: number
    contributor_diversity_score?: number
    test_coverage_percentage?: number
    total_dependencies: number
    outdated_dependencies: number
    total_issues: number
    stale_issues: number
    has_readme: boolean
    has_contributing_guide: boolean
    has_license: boolean
    has_tests: boolean
    code_comment_ratio?: number
    calculated_at: string
    created_at: string
    updated_at: string
}

export interface Squad {
    id: string
    repo_id: string
    created_at: string
    member_count: number
}

export interface SquadMember {
    id: string
    squad_id: string
    user_id: string
    role: SquadRole
    is_lead: boolean
    joined_at: string

    // Relations
    user?: User
}

export interface ActivityFeed {
    id: string
    user_id?: string
    repo_id?: string
    activity_type: 'repo_added' | 'squad_joined' | 'squad_created' | 'milestone_reached'
    title: string
    description?: string
    metadata?: Record<string, any>
    is_public: boolean
    created_at: string

    // Relations
    user?: User
    repository?: Repository
}

// API Response types
export interface ApiResponse<T> {
    data?: T
    error?: string
    message?: string
}

export interface PaginatedResponse<T> {
    data: T[]
    total: number
    page: number
    pageSize: number
    hasMore: boolean
}

// Form types
export interface JoinSquadForm {
    role: SquadRole
    message?: string
}

export interface SearchFilters {
    language?: string
    status?: AbandonmentStatus
    minScore?: number
    maxScore?: number
    sortBy?: 'stars' | 'recent' | 'score' | 'name'
    query?: string
}
