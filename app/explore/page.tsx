'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { RepoCard } from '@/components/repository/repo-card'
import { Sparkles, Search, Filter, Plus, Loader2 } from 'lucide-react'
import { Navbar } from '@/components/layout/navbar'
import type { Repository } from '@/types'

export default function ExplorePage() {
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedLanguage, setSelectedLanguage] = useState('all')
    const [selectedStatus, setSelectedStatus] = useState('all')
    const [repositories, setRepositories] = useState<Repository[]>([])
    const [loading, setLoading] = useState(true)
    const [showImportModal, setShowImportModal] = useState(false)

    useEffect(() => {
        fetchRepositories()
    }, [selectedLanguage, selectedStatus, searchQuery])

    const fetchRepositories = async () => {
        setLoading(true)
        try {
            const params = new URLSearchParams()
            if (selectedLanguage !== 'all') params.append('language', selectedLanguage)
            if (selectedStatus !== 'all') params.append('status', selectedStatus)
            if (searchQuery) params.append('query', searchQuery)

            const response = await fetch(`/api/repositories?${params}`)
            const data = await response.json()

            if (data.repositories) {
                setRepositories(data.repositories)
            }
        } catch (error) {
            console.error('Error fetching repositories:', error)
        } finally {
            setLoading(false)
        }
    }

    const languages = ['all', 'JavaScript', 'TypeScript', 'Python', 'Go', 'Rust', 'Java']
    const statuses = ['all', 'abandoned', 'at-risk', 'reviving']

    return (
        <div className="min-h-screen bg-cream">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold mb-2 text-forest-900">
                        Explore <span className="text-forest-600">Abandoned Projects</span>
                    </h1>
                    <p className="text-forest-600">
                        Discover repositories waiting to be revived
                    </p>
                </div>

                {/* Search and Filters */}
                <div className="bg-white border-2 border-forest-100 rounded-3xl shadow-organic p-6 mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {/* Search */}
                        <div className="md:col-span-2">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-forest-400" />
                                <input
                                    type="text"
                                    placeholder="Search repositories..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 bg-cream border-2 border-forest-100 rounded-xl text-forest-900 placeholder-forest-400 focus:outline-none focus:border-forest-600 transition"
                                />
                            </div>
                        </div>

                        {/* Language Filter */}
                        <div>
                            <select
                                value={selectedLanguage}
                                onChange={(e) => setSelectedLanguage(e.target.value)}
                                className="w-full px-4 py-3 bg-cream border-2 border-forest-100 rounded-xl text-forest-900 focus:outline-none focus:border-forest-600 transition appearance-none cursor-pointer"
                            >
                                <option value="all">All Languages</option>
                                {languages.slice(1).map(lang => (
                                    <option key={lang} value={lang} className="bg-white">
                                        {lang}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Status Filter */}
                        <div>
                            <select
                                value={selectedStatus}
                                onChange={(e) => setSelectedStatus(e.target.value)}
                                className="w-full px-4 py-3 bg-cream border-2 border-forest-100 rounded-xl text-forest-900 focus:outline-none focus:border-forest-600 transition appearance-none cursor-pointer"
                            >
                                <option value="all">All Statuses</option>
                                {statuses.slice(1).map(status => (
                                    <option key={status} value={status} className="bg-white">
                                        {status.replace('-', ' ').toUpperCase()}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Active Filters */}
                    {(searchQuery || selectedLanguage !== 'all' || selectedStatus !== 'all') && (
                        <div className="mt-4 flex items-center gap-2 flex-wrap">
                            <span className="text-sm text-forest-600">Active filters:</span>
                            {searchQuery && (
                                <span className="px-3 py-1 bg-forest-100 text-forest-700 rounded-full text-sm">
                                    Search: {searchQuery}
                                </span>
                            )}
                            {selectedLanguage !== 'all' && (
                                <span className="px-3 py-1 bg-forest-100 text-forest-700 rounded-full text-sm">
                                    {selectedLanguage}
                                </span>
                            )}
                            {selectedStatus !== 'all' && (
                                <span className="px-3 py-1 bg-forest-100 text-forest-700 rounded-full text-sm">
                                    {selectedStatus.replace('-', ' ')}
                                </span>
                            )}
                            <button
                                onClick={() => {
                                    setSearchQuery('')
                                    setSelectedLanguage('all')
                                    setSelectedStatus('all')
                                }}
                                className="text-sm text-forest-500 hover:text-forest-800 transition underline"
                            >
                                Clear all
                            </button>
                        </div>
                    )}
                </div>

                {/* Results Count */}
                <div className="mb-6 text-sm text-forest-600">
                    {loading ? (
                        <div className="flex items-center gap-2">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Loading repositories...
                        </div>
                    ) : (
                        <>Showing <span className="text-forest-900 font-bold">{repositories.length}</span> repositories</>
                    )}
                </div>

                {/* Repository Grid */}
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="w-12 h-12 animate-spin text-forest-700" />
                    </div>
                ) : repositories.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {repositories.map(repo => (
                            <RepoCard key={repo.id} repo={repo} />
                        ))}
                    </div>
                ) : (
                    <div className="bg-white border-2 border-forest-100 rounded-3xl shadow-organic p-12 text-center">
                        <Filter className="w-16 h-16 text-forest-300 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold mb-2 text-forest-800">No repositories found</h3>
                        <p className="text-forest-500 mb-4">
                            {searchQuery || selectedLanguage !== 'all' || selectedStatus !== 'all'
                                ? 'Try adjusting your filters or search query'
                                : 'No repositories have been added yet. Import one to get started!'}
                        </p>
                        <div className="flex gap-4 justify-center">
                            {(searchQuery || selectedLanguage !== 'all' || selectedStatus !== 'all') && (
                                <Button
                                    variant="secondary"
                                    onClick={() => {
                                        setSearchQuery('')
                                        setSelectedLanguage('all')
                                        setSelectedStatus('all')
                                    }}
                                >
                                    Clear Filters
                                </Button>
                            )}
                            <Button onClick={() => setShowImportModal(true)} className="gap-2 bg-forest-700 hover:bg-forest-800 text-white">
                                <Plus className="w-4 h-4" />
                                Import Repository
                            </Button>
                        </div>
                    </div>
                )}
            </div>

            {/* Import Modal */}
            {showImportModal && (
                <ImportRepoModal
                    onClose={() => setShowImportModal(false)}
                    onSuccess={() => {
                        setShowImportModal(false)
                        fetchRepositories()
                    }}
                />
            )}
        </div>
    )
}

function ImportRepoModal({
    onClose,
    onSuccess,
}: {
    onClose: () => void
    onSuccess: () => void
}) {
    const [repoName, setRepoName] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleImport = async () => {
        if (!repoName.trim()) {
            setError('Please enter a repository name')
            return
        }

        setLoading(true)
        setError('')

        try {
            const response = await fetch('/api/repositories/import', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ repoFullName: repoName.trim() }),
            })

            const data = await response.json()

            if (!response.ok) {
                setError(data.error || 'Failed to import repository')
                return
            }

            onSuccess()
        } catch (err: any) {
            setError(err.message || 'Failed to import repository')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border-2 border-forest-100">
                <h2 className="text-2xl font-bold mb-4 text-forest-900">Import Repository</h2>
                <p className="text-forest-600 mb-6">
                    Enter the full name of a GitHub repository (e.g., facebook/react)
                </p>

                <input
                    type="text"
                    placeholder="owner/repository"
                    value={repoName}
                    onChange={(e) => setRepoName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleImport()}
                    className="w-full px-4 py-3 bg-cream border-2 border-forest-100 rounded-xl text-forest-900 placeholder-forest-400 focus:outline-none focus:border-forest-600 transition mb-4"
                    disabled={loading}
                />

                {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                        {error}
                    </div>
                )}

                <div className="flex gap-3">
                    <Button
                        variant="secondary"
                        onClick={onClose}
                        disabled={loading}
                        className="flex-1"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleImport}
                        disabled={loading}
                        className="flex-1 gap-2 bg-forest-700 hover:bg-forest-800 text-white"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Importing...
                            </>
                        ) : (
                            <>
                                <Plus className="w-4 h-4" />
                                Import
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </div>
    )
}
