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
            <Card className="p-6 h-full flex flex-col bg-black/40 backdrop-blur-md border border-white/10 hover:border-phoenix-primary/50 hover:bg-black/60 hover:scale-[1.02] transition-all duration-300 group shadow-lg">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                    <div className="flex-1 min-w-0 pr-4">
                        <h3 className="text-xl font-bold text-white mb-1 truncate group-hover:text-phoenix-primary transition-colors">
                            {repo.name}
                        </h3>
                        <p className="text-sm text-gray-400 truncate">{repo.full_name}</p>
                    </div>
                    <Badge variant="status" status={repo.abandonment_status} className="shrink-0 shadow-sm">
                        {repo.abandonment_status === 'abandoned' && '💀'}
                        {repo.abandonment_status === 'at-risk' && '⚠️'}
                        {repo.abandonment_status === 'reviving' && '🔥'}
                        {repo.abandonment_status === 'active' && '✓'}
                        {' '}
                        {repo.abandonment_status.replace('-', ' ')}
                    </Badge>
                </div>

                {/* Description */}
                <p className="text-gray-300 mb-6 flex-1 line-clamp-2 leading-relaxed">
                    {repo.description || 'No description available'}
                </p>

                {/* Maintenance Score - Simplified */}
                {repo.maintenance_score && (
                    <div className="mb-6">
                        <div className="flex items-center justify-between mb-2 text-xs font-medium uppercase tracking-wider text-gray-500">
                            <span>Maintenance Score</span>
                            <span className={cn(
                                "",
                                repo.maintenance_score >= 70 ? "text-green-400" :
                                    repo.maintenance_score >= 40 ? "text-amber-400" :
                                        "text-red-400"
                            )}>
                                {repo.maintenance_score}/100
                            </span>
                        </div>
                        <div className="w-full bg-black/50 rounded-full h-2 overflow-hidden border border-white/5">
                            <div
                                className={cn(
                                    "h-full rounded-full transition-all shadow-[0_0_10px_rgba(0,0,0,0.5)]",
                                    repo.maintenance_score >= 70 ? "bg-gradient-to-r from-green-600 to-green-400" :
                                        repo.maintenance_score >= 40 ? "bg-gradient-to-r from-amber-600 to-amber-400" :
                                            "bg-gradient-to-r from-red-600 to-red-400"
                                )}
                                style={{ width: `${repo.maintenance_score}%` }}
                            />
                        </div>
                    </div>
                )}

                {/* Stats */}
                <div className="flex items-center justify-between text-sm text-gray-400 border-t border-white/5 pt-4 mt-auto">
                    <div className="flex gap-4">
                        <div className="flex items-center gap-1.5 hover:text-white transition-colors" title="Stars">
                            <Star className="w-4 h-4 text-yellow-500" />
                            <span className="font-medium">{formatNumber(repo.stars_count)}</span>
                        </div>
                        <div className="flex items-center gap-1.5 hover:text-white transition-colors" title="Forks">
                            <GitFork className="w-4 h-4" />
                            <span className="font-medium">{formatNumber(repo.forks_count)}</span>
                        </div>
                    </div>

                    {repo.language && (
                        <div className="flex items-center gap-2">
                            <div className={cn(
                                "w-2.5 h-2.5 rounded-full shadow-[0_0_8px_currentColor]",
                                repo.language === 'JavaScript' && "bg-yellow-400 text-yellow-400",
                                repo.language === 'TypeScript' && "bg-blue-500 text-blue-500",
                                repo.language === 'Python' && "bg-green-500 text-green-500",
                                repo.language === 'Go' && "bg-cyan-500 text-cyan-500",
                                !['JavaScript', 'TypeScript', 'Python', 'Go'].includes(repo.language) && "bg-gray-400 text-gray-400"
                            )} />
                            <span className="text-xs text-gray-300 font-medium">{repo.language}</span>
                        </div>
                    )}
                </div>
            </Card>
        </Link>
    )
}
