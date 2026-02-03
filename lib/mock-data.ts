// Mock repository data for MVP (will be replaced with real Supabase data later)

import type { Repository } from '@/types'

const mockRepos: Repository[] = [
    {
        id: '1',
        github_repo_id: 123456,
        full_name: 'awesome-dev/react-native-maps',
        name: 'react-native-maps',
        description: 'React Native Mapview component for iOS + Android. Last updated 2 years ago, needs maintenance.',
        language: 'JavaScript',
        stars_count: 14523,
        forks_count: 4201,
        watchers_count: 423,
        open_issues_count: 234,
        size_kb: 5432,
        default_branch: 'main',
        topics: ['react-native', 'maps', 'ios', 'android'],
        license_name: 'MIT',
        created_at_github: '2018-03-15T10:00:00Z',
        last_commit_at: '2022-06-20T14:30:00Z',
        last_push_at: '2022-06-20T14:30:00Z',
        abandonment_status: 'abandoned',
        maintenance_score: 45,
        is_analyzed: true,
        views_count: 1234,
        interest_count: 23,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
    },
    {
        id: '2',
        github_repo_id: 234567,
        full_name: 'dev-tools/webpack-bundle-analyzer',
        name: 'webpack-bundle-analyzer',
        description: 'Webpack plugin and CLI utility that represents bundle content with an interactive zoomable treemap',
        language: 'TypeScript',
        stars_count: 12304,
        forks_count: 789,
        watchers_count: 234,
        open_issues_count: 89,
        size_kb: 2345,
        default_branch: 'master',
        topics: ['webpack', 'bundle', 'analyzer', 'performance'],
        license_name: 'MIT',
        created_at_github: '2017-05-10T08:00:00Z',
        last_commit_at: '2023-01-15T09:20:00Z',
        last_push_at: '2023-01-15T09:20:00Z',
        abandonment_status: 'at-risk',
        maintenance_score: 62,
        is_analyzed: true,
        views_count: 892,
        interest_count: 15,
        created_at: '2024-01-02T00:00:00Z',
        updated_at: '2024-01-02T00:00:00Z',
    },
    {
        id: '3',
        github_repo_id: 345678,
        full_name: 'amazing-tools/awesome-cli',
        name: 'awesome-cli',
        description: 'A powerful CLI tool for managing your workflows. Active development, great for contribution!',
        language: 'Python',
        stars_count: 8921,
        forks_count: 456,
        watchers_count: 178,
        open_issues_count: 23,
        size_kb: 1234,
        default_branch: 'main',
        topics: ['cli', 'python', 'automation', 'workflow'],
        license_name: 'Apache-2.0',
        created_at_github: '2021-08-20T12:00:00Z',
        last_commit_at: '2024-01-25T16:45:00Z',
        last_push_at: '2024-01-25T16:45:00Z',
        abandonment_status: 'reviving',
        maintenance_score: 78,
        is_analyzed: true,
        views_count: 567,
        interest_count: 31,
        created_at: '2024-01-03T00:00:00Z',
        updated_at: '2024-01-03T00:00:00Z',
    },
    {
        id: '4',
        github_repo_id: 456789,
        full_name: 'frontend-tools/css-in-js-lib',
        name: 'css-in-js-lib',
        description: 'Lightweight CSS-in-JS library with TypeScript support. Great performance, needs updates.',
        language: 'TypeScript',
        stars_count: 6234,
        forks_count: 312,
        watchers_count: 89,
        open_issues_count: 67,
        size_kb: 890,
        default_branch: 'main',
        topics: ['css', 'css-in-js', 'typescript', 'styling'],
        license_name: 'MIT',
        created_at_github: '2019-11-12T09:00:00Z',
        last_commit_at: '2022-09-08T11:30:00Z',
        last_push_at: '2022-09-08T11:30:00Z',
        abandonment_status: 'abandoned',
        maintenance_score: 38,
        is_analyzed: true,
        views_count: 423,
        interest_count: 18,
        created_at: '2024-01-04T00:00:00Z',
        updated_at: '2024-01-04T00:00:00Z',
    },
    {
        id: '5',
        github_repo_id: 567890,
        full_name: 'backend-tools/node-api-framework',
        name: 'node-api-framework',
        description: 'Express-based API framework with built-in validation and error handling. Solid foundation.',
        language: 'JavaScript',
        stars_count: 4567,
        forks_count: 234,
        watchers_count: 67,
        open_issues_count: 45,
        size_kb: 1567,
        default_branch: 'master',
        topics: ['nodejs', 'api', 'framework', 'backend'],
        license_name: 'MIT',
        created_at_github: '2020-04-05T14:00:00Z',
        last_commit_at: '2023-06-12T10:15:00Z',
        last_push_at: '2023-06-12T10:15:00Z',
        abandonment_status: 'at-risk',
        maintenance_score: 55,
        is_analyzed: true,
        views_count: 345,
        interest_count: 12,
        created_at: '2024-01-05T00:00:00Z',
        updated_at: '2024-01-05T00:00:00Z',
    },
    {
        id: '6',
        github_repo_id: 678901,
        full_name: 'data-viz/chart-library',
        name: 'chart-library',
        description: 'Beautiful, responsive charts for React. Great documentation, needs dependency updates.',
        language: 'TypeScript',
        stars_count: 11234,
        forks_count: 923,
        watchers_count: 201,
        open_issues_count: 156,
        size_kb: 3456,
        default_branch: 'main',
        topics: ['react', 'charts', 'data-visualization', 'typescript'],
        license_name: 'MIT',
        created_at_github: '2018-07-22T11:00:00Z',
        last_commit_at: '2022-11-30T15:20:00Z',
        last_push_at: '2022-11-30T15:20:00Z',
        abandonment_status: 'abandoned',
        maintenance_score: 42,
        is_analyzed: true,
        views_count: 1567,
        interest_count: 44,
        created_at: '2024-01-06T00:00:00Z',
        updated_at: '2024-01-06T00:00:00Z',
    },
]

export function getMockRepositories() {
    return mockRepos
}

export function getMockRepository(id: string) {
    return mockRepos.find(repo => repo.id === id)
}

export function filterRepositories(filters: {
    language?: string
    status?: string
    query?: string
}) {
    let filtered = [...mockRepos]

    if (filters.language && filters.language !== 'all') {
        filtered = filtered.filter(repo => repo.language === filters.language)
    }

    if (filters.status && filters.status !== 'all') {
        filtered = filtered.filter(repo => repo.abandonment_status === filters.status)
    }

    if (filters.query) {
        const query = filters.query.toLowerCase()
        filtered = filtered.filter(repo =>
            repo.name.toLowerCase().includes(query) ||
            repo.description?.toLowerCase().includes(query) ||
            repo.full_name.toLowerCase().includes(query)
        )
    }

    return filtered
}
