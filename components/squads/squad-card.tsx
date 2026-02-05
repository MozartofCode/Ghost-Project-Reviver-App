'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Users, Calendar, Sprout, Crown } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import type { SquadWithMembership } from '@/types'
import { useState } from 'react'

interface SquadCardProps {
    squad: SquadWithMembership
    onJoin: (squadId: string) => Promise<void>
    onLeave: (squadId: string) => Promise<void>
    onViewMembers?: (squad: SquadWithMembership) => void
}

export function SquadCard({ squad, onJoin, onLeave, onViewMembers }: SquadCardProps) {
    const [loading, setLoading] = useState(false)

    const handleJoinLeave = async () => {
        setLoading(true)
        try {
            if (squad.is_user_member) {
                await onLeave(squad.id)
            } else {
                await onJoin(squad.id)
            }
        } finally {
            setLoading(false)
        }
    }

    const isCreator = squad.user_role === 'creator'

    return (
        <Card className="
      p-6 bg-cream border-2 border-forest-100
      rounded-3xl shadow-organic
      hover:shadow-organic-hover hover:bg-mint-50 hover:border-forest-200
      transition-all duration-300
      group
    ">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                        <Sprout className="w-5 h-5 text-forest-600" />
                        <h3 className="text-xl font-bold text-forest-900 group-hover:text-forest-700 transition-colors">
                            {squad.name}
                        </h3>
                        {isCreator && (
                            <div className="px-2 py-0.5 bg-amber-100 border border-amber-200 rounded-full flex items-center gap-1">
                                <Crown className="w-3 h-3 text-amber-700" />
                                <span className="text-xs font-bold text-amber-700">Creator</span>
                            </div>
                        )}
                    </div>
                    {squad.description && (
                        <p className="text-sm text-forest-600 line-clamp-2 leading-relaxed">
                            {squad.description}
                        </p>
                    )}
                </div>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-4 mb-4 text-sm text-forest-600">
                <button
                    onClick={() => onViewMembers?.(squad)}
                    className="flex items-center gap-1.5 hover:text-forest-800 transition-colors"
                    title="View members"
                >
                    <Users className="w-4 h-4" />
                    <span className="font-semibold text-forest-700">
                        {squad.member_count} {squad.member_count === 1 ? 'member' : 'members'}
                    </span>
                </button>

                <div className="flex items-center gap-1.5" title="Created">
                    <Calendar className="w-4 h-4" />
                    <span className="text-xs">
                        {formatDistanceToNow(new Date(squad.created_at), { addSuffix: true })}
                    </span>
                </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
                {squad.is_user_member ? (
                    <Button
                        onClick={handleJoinLeave}
                        disabled={loading}
                        variant="outline"
                        className="flex-1 rounded-xl border-2 border-forest-200 bg-white hover:bg-red-50 hover:border-red-200 text-forest-700 hover:text-red-700 font-semibold"
                    >
                        {loading ? 'Leaving...' : 'Leave Squad'}
                    </Button>
                ) : (
                    <Button
                        onClick={handleJoinLeave}
                        disabled={loading}
                        className="flex-1 rounded-xl bg-forest-700 hover:bg-forest-800 text-white font-semibold shadow-lg shadow-forest-700/20"
                    >
                        {loading ? 'Joining...' : 'Join Squad'}
                    </Button>
                )}

                {onViewMembers && (
                    <Button
                        onClick={() => onViewMembers(squad)}
                        variant="outline"
                        className="rounded-xl border-2 border-forest-100 hover:border-forest-200 text-forest-700"
                    >
                        View Members
                    </Button>
                )}
            </div>
        </Card>
    )
}
