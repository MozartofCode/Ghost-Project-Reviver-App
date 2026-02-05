'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { X, Loader2, Users, Crown, Shield, User } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import type { SquadWithMembership, SquadMember } from '@/types'

interface SquadMembersModalProps {
    squad: SquadWithMembership
    onClose: () => void
}

export function SquadMembersModal({ squad, onClose }: SquadMembersModalProps) {
    const [members, setMembers] = useState<SquadMember[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchMembers()
    }, [squad.id])

    const fetchMembers = async () => {
        setLoading(true)
        try {
            const response = await fetch(`/api/squads/${squad.id}/members`)
            const data = await response.json()

            if (data.members) {
                setMembers(data.members)
            }
        } catch (error) {
            console.error('Error fetching members:', error)
        } finally {
            setLoading(false)
        }
    }

    const getRoleIcon = (role: string) => {
        switch (role) {
            case 'creator':
                return <Crown className="w-4 h-4 text-amber-600" />
            case 'moderator':
                return <Shield className="w-4 h-4 text-blue-600" />
            default:
                return <User className="w-4 h-4 text-forest-600" />
        }
    }

    const getRoleLabel = (role: string) => {
        switch (role) {
            case 'creator':
                return 'Creator'
            case 'moderator':
                return 'Moderator'
            default:
                return 'Member'
        }
    }

    const getRoleBadgeClass = (role: string) => {
        switch (role) {
            case 'creator':
                return 'bg-amber-100 border-amber-200 text-amber-700'
            case 'moderator':
                return 'bg-blue-100 border-blue-200 text-blue-700'
            default:
                return 'bg-forest-100 border-forest-200 text-forest-700'
        }
    }

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-cream border-2 border-forest-200 rounded-3xl p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between mb-6 sticky top-0 bg-cream pb-4">
                    <div>
                        <h2 className="text-2xl font-bold text-forest-900 mb-1">{squad.name}</h2>
                        <p className="text-sm text-forest-600 flex items-center gap-2">
                            <Users className="w-4 h-4" />
                            {squad.member_count} {squad.member_count === 1 ? 'member' : 'members'}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-forest-100 rounded-xl transition-colors"
                    >
                        <X className="w-5 h-5 text-forest-600" />
                    </button>
                </div>

                {/* Members List */}
                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="w-8 h-8 animate-spin text-forest-600" />
                    </div>
                ) : members.length > 0 ? (
                    <div className="space-y-3">
                        {members.map(member => (
                            <div
                                key={member.id}
                                className="flex items-center gap-4 p-4 bg-white border-2 border-forest-100 rounded-2xl hover:border-forest-200 transition-colors"
                            >
                                {/* Avatar */}
                                {member.user?.avatar_url ? (
                                    <img
                                        src={member.user.avatar_url}
                                        alt={member.user.username}
                                        className="w-12 h-12 rounded-full border-2 border-forest-600"
                                    />
                                ) : (
                                    <div className="w-12 h-12 rounded-full bg-forest-100 flex items-center justify-center border-2 border-forest-600">
                                        <User className="w-6 h-6 text-forest-600" />
                                    </div>
                                )}

                                {/* User Info */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="font-semibold text-forest-900 truncate">
                                            {member.user?.username || 'Unknown User'}
                                        </h3>
                                        <div className={`px-2 py-0.5 rounded-full border flex items-center gap-1 ${getRoleBadgeClass(member.role)}`}>
                                            {getRoleIcon(member.role)}
                                            <span className="text-xs font-bold">
                                                {getRoleLabel(member.role)}
                                            </span>
                                        </div>
                                    </div>
                                    <p className="text-xs text-forest-500">
                                        Joined {formatDistanceToNow(new Date(member.joined_at), { addSuffix: true })}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <Users className="w-16 h-16 text-forest-300 mx-auto mb-4" />
                        <p className="text-forest-600">No members yet</p>
                    </div>
                )}

                {/* Close Button */}
                <div className="mt-6 pt-4 border-t-2 border-forest-100">
                    <Button
                        onClick={onClose}
                        variant="outline"
                        className="w-full rounded-xl border-2 border-forest-100 hover:border-forest-200 text-forest-700"
                    >
                        Close
                    </Button>
                </div>
            </div>
        </div>
    )
}
