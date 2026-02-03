import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Star, GitFork, AlertCircle, Clock, Users } from 'lucide-react'
import { formatNumber, getRelativeTime, cn } from '@/lib/utils'
import type { Repository } from '@/types'

interface RepoCardProps {
    repo: Repository
}

export function RepoCard({ repo }: RepoCardProps) {
    return (
        <Link href={`/repositories/${repo.id}`}>
            <Card glass className="p-6 h-full flex flex-col">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                        <h3 className="text-lg font-semibold text-white mb-1 hover:text-phoenix-primary transition">
                            {repo.name}
                        </h3>
                        <p className="text-sm text-gray-400">{repo.full_name}</p>
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

                {/* Description */}
                <p className="text-sm text-gray-300 mb-4 flex-1 line-clamp-2">
                    {repo.description || 'No description available'}
                </p>

                {/* Maintenance Score */}
                {repo.maintenance_score && (
                    <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs text-gray-400">Maintenance Score</span>
                            <span className={cn(
                                "text-sm font-semibold",
                                repo.maintenance_score >= 70 ? "text-green-500" :
                                    repo.maintenance_score >= 40 ? "text-amber-500" :
                                        "text-red-500"
                            )}>
                                {repo.maintenance_score}/100
                            </span>
                        </div>
                        <div className="w-full bg-white/5 rounded-full h-2">
                            <div
                                className={cn(
                                    "h-2 rounded-full transition-all",
                                    repo.maintenance_score >= 70 ? "bg-green-500" :
                                        repo.maintenance_score >= 40 ? "bg-amber-500" :
                                            "bg-red-500"
                                )}
                                style={{ width: `${repo.maintenance_score}%` }}
                            />
                        </div>
                    </div>
                )}

                {/* Stats */}
                <div className="flex flex-wrap gap-4 mb-4 text-sm text-gray-400">
                    <div className="flex items-center gap-1">
                        <Star className="w-4 h-4" />
                        <span>{formatNumber(repo.stars_count)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <GitFork className="w-4 h-4" />
                        <span>{formatNumber(repo.forks_count)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        <span>{repo.open_issues_count}</span>
                    </div>
                    {repo.interest_count > 0 && (
                        <div className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            <span>{repo.interest_count}</span>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                    <div className="flex items-center gap-2">
                        {repo.language && (
                            <div className="flex items-center gap-2">
                                <div className={cn(
                                    "w-3 h-3 rounded-full",
                                    repo.language === 'JavaScript' && "bg-yellow-400",
                                    repo.language === 'TypeScript' && "bg-blue-500",
                                    repo.language === 'Python' && "bg-green-500",
                                    repo.language === 'Go' && "bg-cyan-500",
                                    repo.language !== 'JavaScript' && repo.language !== 'TypeScript' &&
                                    repo.language !== 'Python' && repo.language !== 'Go' && "bg-gray-500"
                                )} />
                                <span className="text-sm text-gray-400">{repo.language}</span>
                            </div>
                        )}
                    </div>

                    {repo.last_commit_at && (
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                            <Clock className="w-3 h-3" />
                            <span>{getRelativeTime(repo.last_commit_at)}</span>
                        </div>
                    )}
                </div>
            </Card>
        </Link>
    )
}
