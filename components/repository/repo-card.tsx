import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Star, GitFork, Leaf, Sprout, Skull, AlertTriangle, CheckCircle2 } from 'lucide-react'
import { formatNumber, getRelativeTime, cn } from '@/lib/utils'
import type { Repository } from '@/types'

interface RepoCardProps {
    repo: Repository
}

export function RepoCard({ repo }: RepoCardProps) {
    // Get status icon and color
    const getStatusConfig = (status: string) => {
        switch (status) {
            case 'abandoned':
                return {
                    icon: Skull,
                    badgeClass: 'bg-red-100 text-red-700 border-red-200',
                    label: 'Withered'
                }
            case 'at-risk':
                return {
                    icon: AlertTriangle,
                    badgeClass: 'bg-amber-100 text-amber-700 border-amber-200',
                    label: 'Wilting'
                }
            case 'reviving':
                return {
                    icon: Sprout,
                    badgeClass: 'bg-mint-200 text-forest-800 border-mint-300',
                    label: 'Sprouting'
                }
            case 'active':
                return {
                    icon: CheckCircle2,
                    badgeClass: 'bg-forest-100 text-forest-700 border-forest-200',
                    label: 'Thriving'
                }
            default:
                return {
                    icon: Leaf,
                    badgeClass: 'bg-forest-50 text-forest-600 border-forest-100',
                    label: status
                }
        }
    }

    const statusConfig = getStatusConfig(repo.abandonment_status)
    const StatusIcon = statusConfig.icon

    return (
        <Link href={`/repositories/${repo.id}`}>
            <Card className="
                p-6 h-full flex flex-col
                bg-cream border-2 border-forest-100
                rounded-3xl shadow-organic
                hover:shadow-organic-hover hover:bg-mint-50 hover:border-forest-200
                hover:scale-[1.02]
                transition-all duration-300
                group
            ">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                    <div className="flex-1 min-w-0 pr-4">
                        <h3 className="text-xl font-bold text-forest-900 mb-1 truncate group-hover:text-forest-700 transition-colors">
                            {repo.name}
                        </h3>
                        <p className="text-sm text-forest-500 truncate">{repo.full_name}</p>
                    </div>
                    <div className={cn(
                        "shrink-0 px-3 py-1.5 rounded-full text-xs font-bold border-2 flex items-center gap-1.5",
                        statusConfig.badgeClass
                    )}>
                        <StatusIcon className="w-3.5 h-3.5" />
                        {statusConfig.label}
                    </div>
                </div>

                {/* Description */}
                <p className="text-forest-600 mb-6 flex-1 line-clamp-2 leading-relaxed">
                    {repo.description || 'No description available'}
                </p>

                {/* Maintenance Score - Organic Style */}
                {repo.maintenance_score && (
                    <div className="mb-6">
                        <div className="flex items-center justify-between mb-2 text-xs font-bold uppercase tracking-wider text-forest-500">
                            <span>Health Score</span>
                            <span className={cn(
                                "text-sm",
                                repo.maintenance_score >= 70 ? "text-forest-700" :
                                    repo.maintenance_score >= 40 ? "text-amber-700" :
                                        "text-red-700"
                            )}>
                                {repo.maintenance_score}/100
                            </span>
                        </div>
                        <div className="w-full bg-forest-100 rounded-full h-2.5 overflow-hidden">
                            <div
                                className={cn(
                                    "h-full rounded-full transition-all",
                                    repo.maintenance_score >= 70 ? "bg-forest-600" :
                                        repo.maintenance_score >= 40 ? "bg-amber-500" :
                                            "bg-red-500"
                                )}
                                style={{ width: `${repo.maintenance_score}%` }}
                            />
                        </div>
                    </div>
                )}

                {/* Stats */}
                <div className="flex items-center justify-between text-sm text-forest-600 border-t-2 border-forest-100 pt-4 mt-auto">
                    <div className="flex gap-4">
                        <div className="flex items-center gap-1.5 hover:text-forest-800 transition-colors" title="Stars">
                            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                            <span className="font-semibold text-forest-700">{formatNumber(repo.stars_count)}</span>
                        </div>
                        <div className="flex items-center gap-1.5 hover:text-forest-800 transition-colors" title="Forks">
                            <GitFork className="w-4 h-4 text-forest-600" />
                            <span className="font-semibold text-forest-700">{formatNumber(repo.forks_count)}</span>
                        </div>
                    </div>

                    {repo.language && (
                        <div className="flex items-center gap-2">
                            <div className={cn(
                                "w-2.5 h-2.5 rounded-full",
                                repo.language === 'JavaScript' && "bg-yellow-500",
                                repo.language === 'TypeScript' && "bg-blue-600",
                                repo.language === 'Python' && "bg-green-600",
                                repo.language === 'Go' && "bg-cyan-600",
                                !['JavaScript', 'TypeScript', 'Python', 'Go'].includes(repo.language) && "bg-forest-500"
                            )} />
                            <span className="text-xs text-forest-700 font-semibold">{repo.language}</span>
                        </div>
                    )}
                </div>
            </Card>
        </Link>
    )
}
