'use client'

import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Sprout, Users, Star, Code2, Clock, AlertTriangle, Skull, CheckCircle2 } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import type { AbandonmentStatus } from '@/types'

interface MyProjectCardProps {
    project: {
        id: string
        name: string
        full_name: string
        description: string | null
        abandonment_status: AbandonmentStatus
        maintenance_score: number | null
        last_activity: string | null
        stars_count: number
        language: string | null
        squad_count: number
        url: string
    }
}

export function MyProjectCard({ project }: MyProjectCardProps) {
    const getStatusConfig = (status: AbandonmentStatus) => {
        switch (status) {
            case 'abandoned':
                return { icon: Skull, label: 'Withered', color: 'text-red-700', bg: 'bg-red-50', border: 'border-red-200' }
            case 'at-risk':
                return { icon: AlertTriangle, label: 'Wilting', color: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200' }
            case 'reviving':
                return { icon: Sprout, label: 'Sprouting', color: 'text-green-700', bg: 'bg-green-50', border: 'border-green-200' }
            case 'active':
                return { icon: CheckCircle2, label: 'Thriving', color: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200' }
            default:
                return { icon: Sprout, label: 'Unknown', color: 'text-forest-700', bg: 'bg-forest-50', border: 'border-forest-200' }
        }
    }

    const statusConfig = getStatusConfig(project.abandonment_status)
    const StatusIcon = statusConfig.icon

    return (
        <Link href={project.url}>
            <Card className="
        h-full p-6 bg-cream border-2 border-forest-100
        rounded-3xl shadow-organic
        hover:shadow-organic-hover hover:bg-mint-50 hover:border-forest-200 hover:scale-[1.02]
        transition-all duration-300
        group cursor-pointer
      ">
                {/* Header */}
                <div className="mb-4">
                    <div className="flex items-start justify-between mb-2">
                        <h3 className="text-xl font-bold text-forest-900 group-hover:text-forest-700 transition-colors line-clamp-1">
                            {project.name}
                        </h3>
                        <div className={`px-2 py-1 rounded-full border flex items-center gap-1 ${statusConfig.bg} ${statusConfig.border}`}>
                            <StatusIcon className={`w-3 h-3 ${statusConfig.color}`} />
                            <span className={`text-xs font-bold ${statusConfig.color}`}>
                                {statusConfig.label}
                            </span>
                        </div>
                    </div>
                    {project.description && (
                        <p className="text-sm text-forest-600 line-clamp-2 leading-relaxed">
                            {project.description}
                        </p>
                    )}
                </div>

                {/* Stats */}
                <div className="flex flex-wrap gap-3 mb-4 text-sm text-forest-600">
                    <div className="flex items-center gap-1.5">
                        <Users className="w-4 h-4" />
                        <span className="font-semibold text-forest-700">
                            {project.squad_count} {project.squad_count === 1 ? 'squad' : 'squads'}
                        </span>
                    </div>

                    {project.stars_count > 0 && (
                        <div className="flex items-center gap-1.5">
                            <Star className="w-4 h-4 text-amber-600" />
                            <span>{project.stars_count}</span>
                        </div>
                    )}

                    {project.language && (
                        <div className="flex items-center gap-1.5">
                            <Code2 className="w-4 h-4" />
                            <span>{project.language}</span>
                        </div>
                    )}
                </div>

                {/* Last Activity */}
                {project.last_activity && (
                    <div className="flex items-center gap-1.5 text-xs text-forest-500 mb-4">
                        <Clock className="w-3 h-3" />
                        Last commit {formatDistanceToNow(new Date(project.last_activity), { addSuffix: true })}
                    </div>
                )}

                {/* View Button */}
                <Button
                    className="w-full rounded-xl bg-forest-700 hover:bg-forest-800 text-white font-semibold"
                    asChild
                >
                    <div>View Project</div>
                </Button>
            </Card>
        </Link>
    )
}
