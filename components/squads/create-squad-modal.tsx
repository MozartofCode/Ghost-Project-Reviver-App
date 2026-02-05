'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { X, Loader2, Sprout } from 'lucide-react'

interface CreateSquadModalProps {
    repoId: string
    onClose: () => void
    onSuccess: () => void
}

export function CreateSquadModal({ repoId, onClose, onSuccess }: CreateSquadModalProps) {
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!name.trim()) {
            setError('Squad name is required')
            return
        }

        setLoading(true)
        setError('')

        try {
            const response = await fetch('/api/squads', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    repo_id: repoId,
                    name: name.trim(),
                    description: description.trim() || null,
                }),
            })

            const data = await response.json()

            if (!response.ok) {
                setError(data.error || 'Failed to create squad')
                return
            }

            onSuccess()
        } catch (err: any) {
            setError(err.message || 'Failed to create squad')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-cream border-2 border-forest-200 rounded-3xl p-8 max-w-md w-full shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-forest-100 rounded-xl">
                            <Sprout className="w-6 h-6 text-forest-700" />
                        </div>
                        <h2 className="text-2xl font-bold text-forest-900">Create Squad</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-forest-100 rounded-xl transition-colors"
                        disabled={loading}
                    >
                        <X className="w-5 h-5 text-forest-600" />
                    </button>
                </div>

                <p className="text-forest-600 mb-6">
                    Create a new squad to collaborate with others on this project
                </p>

                <form onSubmit={handleSubmit}>
                    {/* Squad Name */}
                    <div className="mb-4">
                        <label htmlFor="squadName" className="block text-sm font-semibold text-forest-800 mb-2">
                            Squad Name *
                        </label>
                        <input
                            id="squadName"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g., Frontend Team, Documentation Squad"
                            className="w-full px-4 py-3 bg-white border-2 border-forest-100 rounded-xl text-forest-900 placeholder-forest-400 focus:outline-none focus:border-forest-600 transition"
                            disabled={loading}
                            maxLength={100}
                            required
                        />
                    </div>

                    {/* Description */}
                    <div className="mb-6">
                        <label htmlFor="squadDesc" className="block text-sm font-semibold text-forest-800 mb-2">
                            Description (optional)
                        </label>
                        <textarea
                            id="squadDesc"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="What will this squad focus on?"
                            rows={3}
                            className="w-full px-4 py-3 bg-white border-2 border-forest-100 rounded-xl text-forest-900 placeholder-forest-400 focus:outline-none focus:border-forest-600 transition resize-none"
                            disabled={loading}
                            maxLength={500}
                        />
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border-2 border-red-200 rounded-xl text-sm text-red-700">
                            {error}
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-3">
                        <Button
                            type="button"
                            onClick={onClose}
                            variant="outline"
                            disabled={loading}
                            className="flex-1 rounded-xl border-2 border-forest-100 hover:border-forest-200 text-forest-700"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={loading}
                            className="flex-1 gap-2 rounded-xl bg-forest-700 hover:bg-forest-800 text-white font-semibold shadow-lg shadow-forest-700/20"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Creating...
                                </>
                            ) : (
                                <>
                                    <Sprout className="w-4 h-4" />
                                    Create Squad
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}
