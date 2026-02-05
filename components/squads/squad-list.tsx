'use client'

import { useState, useEffect } from 'react'
import { SquadCard } from './squad-card'
import { Button } from '@/components/ui/button'
import { Plus, Users, Loader2 } from 'lucide-react'
import type { SquadWithMembership } from '@/types'
import { CreateSquadModal } from './create-squad-modal'
import { SquadMembersModal } from './squad-members-modal'

interface SquadListProps {
    repoId: string
    isAuthenticated: boolean
}

export function SquadList({ repoId, isAuthenticated }: SquadListProps) {
    const [squads, setSquads] = useState<SquadWithMembership[]>([])
    const [loading, setLoading] = useState(true)
    const [showCreateModal, setShowCreateModal] = useState(false)
    const [selectedSquad, setSelectedSquad] = useState<SquadWithMembership | null>(null)

    useEffect(() => {
        fetchSquads()
    }, [repoId])

    const fetchSquads = async () => {
        setLoading(true)
        try {
            const response = await fetch(`/api/repositories/${repoId}/squads`)
            const data = await response.json()

            if (data.squads) {
                setSquads(data.squads)
            }
        } catch (error) {
            console.error('Error fetching squads:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleJoinSquad = async (squadId: string) => {
        try {
            const response = await fetch(`/api/squads/${squadId}/members`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
            })

            if (!response.ok) {
                const error = await response.json()
                alert(error.error || 'Failed to join squad')
                return
            }

            // Refresh squads to update membership status
            await fetchSquads()
        } catch (error) {
            console.error('Error joining squad:', error)
            alert('Failed to join squad')
        }
    }

    const handleLeaveSquad = async (squadId: string) => {
        const confirmed = confirm('Are you sure you want to leave this squad?')
        if (!confirmed) return

        try {
            const response = await fetch(`/api/squads/${squadId}/members`, {
                method: 'DELETE',
            })

            if (!response.ok) {
                const error = await response.json()
                alert(error.error || 'Failed to leave squad')
                return
            }

            // Refresh squads to update membership status
            await fetchSquads()
        } catch (error) {
            console.error('Error leaving squad:', error)
            alert('Failed to leave squad')
        }
    }

    const handleSquadCreated = () => {
        setShowCreateModal(false)
        fetchSquads()
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-forest-600" />
            </div>
        )
    }

    return (
        <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <Users className="w-6 h-6 text-forest-600" />
                    <div>
                        <h2 className="text-2xl font-bold text-forest-900">Squads</h2>
                        <p className="text-sm text-forest-600">
                            {squads.length} {squads.length === 1 ? 'squad' : 'squads'} working on this project
                        </p>
                    </div>
                </div>

                {isAuthenticated && (
                    <Button
                        onClick={() => setShowCreateModal(true)}
                        className="gap-2 rounded-xl bg-forest-700 hover:bg-forest-800 text-white font-semibold shadow-lg shadow-forest-700/20"
                    >
                        <Plus className="w-4 h-4" />
                        Create Squad
                    </Button>
                )}
            </div>

            {/* Squads Grid */}
            {squads.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {squads.map(squad => (
                        <SquadCard
                            key={squad.id}
                            squad={squad}
                            onJoin={handleJoinSquad}
                            onLeave={handleLeaveSquad}
                            onViewMembers={setSelectedSquad}
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center py-12 bg-cream border-2 border-forest-100 rounded-3xl">
                    <Users className="w-16 h-16 text-forest-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-forest-900 mb-2">No squads yet</h3>
                    <p className="text-forest-600 mb-6">
                        Be the first to create a squad for this project!
                    </p>
                    {isAuthenticated && (
                        <Button
                            onClick={() => setShowCreateModal(true)}
                            className="gap-2 rounded-xl bg-forest-700 hover:bg-forest-800 text-white font-semibold"
                        >
                            <Plus className="w-4 h-4" />
                            Create First Squad
                        </Button>
                    )}
                </div>
            )}

            {/* Modals */}
            {showCreateModal && (
                <CreateSquadModal
                    repoId={repoId}
                    onClose={() => setShowCreateModal(false)}
                    onSuccess={handleSquadCreated}
                />
            )}

            {selectedSquad && (
                <SquadMembersModal
                    squad={selectedSquad}
                    onClose={() => setSelectedSquad(null)}
                />
            )}
        </div>
    )
}
