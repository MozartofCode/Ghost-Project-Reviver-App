'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Sprout, Users, Calendar, ArrowRight, MessageSquare, LogOut, Crown, Shield } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import type { AbandonmentStatus } from '@/types'

interface MySquadCardProps {
    squad: {
        id: string
        name: string
        description: string | null
        member_count: number
        role: string
        joined_at: string
        project: {
            id: string
            name: string
            full_name: string
            description: string | null
            abandonment_status: AbandonmentStatus
            url: string
        }
    }
    onLeave: (squadId: string) => Promise<void>
}

export function MySquadCard({ squad, onLeave }: MySquadCardProps) {
    const [loading, setLoading] = useState(false)

    const handleLeave = async () => {
        if (!confirm(`Are you sure you want to leave ${squad.name}?`)) return

        setLoading(true)
        try {
            await onLeave(squad.id)
        } catch (error) {
            console.error('Failed to leave squad', error)
        } finally {
            setLoading(false)
        }
    }

    const getRoleBadge = (role: string) => {
        switch (role) {
            case 'creator':
                return (
                    <div className="flex items-center gap-1 px-2 py-0.5 bg-amber-100 border border-amber-200 text-amber-700 rounded-full text-xs font-bold">
                        <Crown className="w-3 h-3" />
                        <span>Creator</span>
                    </div>
                )
            case 'moderator':
                return (
                    <div className="flex items-center gap-1 px-2 py-0.5 bg-blue-100 border-blue-200 text-blue-700 rounded-full text-xs font-bold">
                        <Shield className="w-3 h-3" />
                        <span>Moderator</span>
                    </div>
                )
            default:
                return (
                    <div className="px-2 py-0.5 bg-forest-100 border border-forest-200 text-forest-700 rounded-full text-xs font-bold">
                        Member
                    </div>
                )
        }
    }

    return (
        <Card className="
      flex flex-col h-full
      p-6 bg-cream border-2 border-forest-100
      rounded-3xl shadow-organic
      hover:shadow-organic-hover hover:border-forest-200
      transition-all duration-300
    ">
            {/* Project Context (Top Bar) */}
            <div className="mb-4 pb-3 border-b border-forest-100">
                <div className="flex items-center gap-2 text-xs font-bold text-forest-500 uppercase tracking-wider mb-1">
                    <Sprout className="w-3 h-3" />
                    Project
                </div>
                <Link
                    href={squad.project.url}
                    className="text-forest-900 font-semibold hover:text-forest-700 transition-colors line-clamp-1"
                >
                    {squad.project.full_name}
                </Link>
            </div>

            {/* Squad Info */}
            <div className="flex-1 mb-6">
                <div className="flex items-start justify-between mb-2">
                    <h3 className="text-xl font-bold text-forest-900 line-clamp-1">
                        {squad.name}
                    </h3>
                    {getRoleBadge(squad.role)}
                </div>

                {squad.description && (
                    <p className="text-sm text-forest-600 line-clamp-2 mb-4 leading-relaxed">
                        {squad.description}
                    </p>
                )}

                <div className="flex flex-wrap gap-3 text-sm text-forest-600">
                    <div className="flex items-center gap-1.5" title="Members">
                        <Users className="w-4 h-4" />
                        <span className="font-semibold">{squad.member_count}</span>
                    </div>

                    <div className="flex items-center gap-1.5" title={`Joined ${formatDistanceToNow(new Date(squad.joined_at))} ago`}>
                        <Calendar className="w-4 h-4" />
                        <span>{formatDistanceToNow(new Date(squad.joined_at), { addSuffix: true })}</span>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-2 gap-2">
                <Button
                    variant="outline"
                    className="w-full rounded-xl border-2 border-forest-100 hover:border-forest-200 text-forest-700 hover:bg-forest-50"
                    asChild
                >
                    {/* Future: Link to messaging system */}
                    <span className="cursor-not-allowed opacity-50" title="Messaging coming soon">
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Chat
                    </span>
                </Button>

                <Button
                    className="w-full rounded-xl bg-forest-700 hover:bg-forest-800 text-white font-semibold"
                    asChild
                >
                    <Link href={squad.project.url}>
                        View Project
                        <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                </Button>

                <Button
                    variant="ghost"
                    className="col-span-2 text-red-600 hover:text-red-700 hover:bg-red-50 h-8 text-xs"
                    onClick={handleLeave}
                    disabled={loading}
                >
                    {loading ? 'Leaving...' : 'Leave Squad'}
                </Button>
            </div>
        </Card>
    )
}
