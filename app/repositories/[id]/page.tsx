'use client'

import { useEffect, useState, use } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
    Star, GitFork, AlertCircle, ExternalLink, Github,
    Users, Clock, Code2, FileText, Shield, ArrowLeft, Loader2
} from 'lucide-react'
import { formatNumber, getRelativeTime, cn } from '@/lib/utils'
import type { Repository } from '@/types'
import { SquadList } from '@/components/squads/squad-list'
import { getCurrentUser } from '@/lib/auth/client'

export default function RepositoryDetailPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = use(params)
    const [repo, setRepo] = useState<Repository | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const router = useRouter()

    useEffect(() => {
        fetchRepository()
        checkAuth()
    }, [id])

    const checkAuth = async () => {
        const user = await getCurrentUser()
        setIsAuthenticated(!!user)
    }

    const fetchRepository = async () => {
        try {
            setLoading(true)
            const response = await fetch(`/api/repositories/${id}`)

            if (response.status === 404) {
                setError('Repository not found')
                setLoading(false)
                return
            }

            if (!response.ok) {
                throw new Error('Failed to fetch repository')
            }

            const data = await response.json()
            setRepo(data.repository)
        } catch (err: any) {
            setError(err.message || 'Failed to load repository')
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-phoenix-dark flex items-center justify-center">
                <Loader2 className="w-12 h-12 animate-spin text-phoenix-primary" />
            </div>
        )
    }

    if (error || !repo) {
        return (
            <div className="min-h-screen bg-phoenix-dark flex items-center justify-center">
                <Card glass className="p-8 text-center max-w-md">
                    <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold mb-2">Repository Not Found</h2>
                    <p className="text-gray-400 mb-6">{error || 'The repository you are looking for does not exist.'}</p>
                    <Link href="/explore">
                        <Button>Back to Explore</Button>
                    </Link>
                </Card>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-phoenix-dark">
            {/* Simple Navigation */}
            <nav className="border-b border-white/10 backdrop-blur-lg bg-phoenix-dark/80">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <Link href="/explore" className="flex items-center gap-2 text-gray-400 hover:text-white transition">
                            <ArrowLeft className="w-5 h-5" />
                            Back to Explore
                        </Link>
                    </div>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content - Left Side */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Header */}
                        <div>
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <h1 className="text-4xl font-bold mb-2">{repo.name}</h1>
                                    <p className="text-gray-400">{repo.full_name}</p>
                                </div>
                                <Badge variant="status" status={repo.abandonment_status}>
                                    {repo.abandonment_status === 'abandoned' && '💀'}
                                    {repo.abandonment_status === 'at-risk' && '⚠️'}
                                    {repo.abandonment_status === 'reviving' && '🔥'}
                                    {repo.abandonment_status === 'active' && '✓'}
                                    {' '}
                                    {repo.abandonment_status.replace('-', ' ')}
                                </Badge>
                            </div>
                            <p className="text-lg text-gray-300">{repo.description}</p>
                        </div>

                        {/* Quick Stats */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <Card glass hover={false} className="p-4">
                                <div className="flex items-center gap-2 mb-1">
                                    <Star className="w-4 h-4 text-yellow-500" />
                                    <span className="text-sm text-gray-400">Stars</span>
                                </div>
                                <p className="text-2xl font-bold">{formatNumber(repo.stars_count)}</p>
                            </Card>
                            <Card glass hover={false} className="p-4">
                                <div className="flex items-center gap-2 mb-1">
                                    <GitFork className="w-4 h-4 text-gray-400" />
                                    <span className="text-sm text-gray-400">Forks</span>
                                </div>
                                <p className="text-2xl font-bold">{formatNumber(repo.forks_count)}</p>
                            </Card>
                            <Card glass hover={false} className="p-4">
                                <div className="flex items-center gap-2 mb-1">
                                    <AlertCircle className="w-4 h-4 text-red-500" />
                                    <span className="text-sm text-gray-400">Issues</span>
                                </div>
                                <p className="text-2xl font-bold">{repo.open_issues_count}</p>
                            </Card>
                            <Card glass hover={false} className="p-4">
                                <div className="flex items-center gap-2 mb-1">
                                    <Users className="w-4 h-4 text-phoenix-primary" />
                                    <span className="text-sm text-gray-400">Interested</span>
                                </div>
                                <p className="text-2xl font-bold">{repo.interest_count}</p>
                            </Card>
                        </div>

                        {/* Maintenance Score */}
                        {repo.maintenance_score && (
                            <Card glass>
                                <CardHeader>
                                    <CardTitle>Maintenance Difficulty Score</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="mb-6">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-gray-400">Overall Score</span>
                                            <span className={cn(
                                                "text-3xl font-bold",
                                                repo.maintenance_score >= 70 ? "text-green-500" :
                                                    repo.maintenance_score >= 40 ? "text-amber-500" :
                                                        "text-red-500"
                                            )}>
                                                {repo.maintenance_score}/100
                                            </span>
                                        </div>
                                        <div className="w-full bg-white/5 rounded-full h-4">
                                            <div
                                                className={cn(
                                                    "h-4 rounded-full transition-all",
                                                    repo.maintenance_score >= 70 ? "bg-green-500" :
                                                        repo.maintenance_score >= 40 ? "bg-amber-500" :
                                                            "bg-red-500"
                                                )}
                                                style={{ width: `${repo.maintenance_score}%` }}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-3 text-sm">
                                        <p className={cn(
                                            "p-3 rounded-lg",
                                            repo.maintenance_score >= 70 ? "bg-green-500/10 text-green-400" :
                                                repo.maintenance_score >= 40 ? "bg-amber-500/10 text-amber-400" :
                                                    "bg-red-500/10 text-red-400"
                                        )}>
                                            {repo.maintenance_score >= 70 && "✓ This project is relatively easy to maintain"}
                                            {repo.maintenance_score >= 40 && repo.maintenance_score < 70 && "⚠ Moderate maintenance difficulty expected"}
                                            {repo.maintenance_score < 40 && "⚠ High maintenance difficulty - expect significant work"}
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* About */}
                        <Card glass>
                            <CardHeader>
                                <CardTitle>About</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {repo.language && (
                                    <div className="flex items-center gap-2">
                                        <Code2 className="w-5 h-5 text-gray-400" />
                                        <span className="text-gray-400">Primary Language:</span>
                                        <span className="font-semibold">{repo.language}</span>
                                    </div>
                                )}
                                {repo.license_name && (
                                    <div className="flex items-center gap-2">
                                        <Shield className="w-5 h-5 text-gray-400" />
                                        <span className="text-gray-400">License:</span>
                                        <span className="font-semibold">{repo.license_name}</span>
                                    </div>
                                )}
                                {repo.last_commit_at && (
                                    <div className="flex items-center gap-2">
                                        <Clock className="w-5 h-5 text-gray-400" />
                                        <span className="text-gray-400">Last Commit:</span>
                                        <span className="font-semibold">{getRelativeTime(repo.last_commit_at)}</span>
                                    </div>
                                )}
                                {repo.topics && repo.topics.length > 0 && (
                                    <div>
                                        <p className="text-gray-400 mb-2">Topics:</p>
                                        <div className="flex flex-wrap gap-2">
                                            {repo.topics.map(topic => (
                                                <span
                                                    key={topic}
                                                    className="px-3 py-1 bg-phoenix-primary/20 text-phoenix-primary rounded-full text-sm"
                                                >
                                                    {topic}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Links */}
                        <Card glass>
                            <CardHeader>
                                <CardTitle>Links</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <a
                                    href={`https://github.com/${repo.full_name}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 text-phoenix-primary hover:text-phoenix-primary-light transition"
                                >
                                    <Github className="w-5 h-5" />
                                    View on GitHub
                                    <ExternalLink className="w-4 h-4" />
                                </a>
                                {repo.homepage_url && (
                                    <a
                                        href={repo.homepage_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 text-phoenix-primary hover:text-phoenix-primary-light transition"
                                    >
                                        <ExternalLink className="w-5 h-5" />
                                        Homepage
                                    </a>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar - Right Side */}
                    <div className="space-y-6">
                        {/* Activity */}
                        <Card glass className="p-6">
                            <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
                            <div className="space-y-3 text-sm">
                                <div className="flex gap-2">
                                    <div className="w-2 h-2 rounded-full bg-phoenix-primary mt-2" />
                                    <div>
                                        <p className="text-gray-300">Repository added to platform</p>
                                        <p className="text-gray-500 text-xs">{getRelativeTime(repo.created_at)}</p>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>

                {/* Squads Section - Full Width */}
                <div className="mt-12">
                    <SquadList repoId={id} isAuthenticated={isAuthenticated} />
                </div>
            </div>
        </div>
    )
}
