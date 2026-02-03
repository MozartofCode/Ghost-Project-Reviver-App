'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { RepoCard } from '@/components/repository/repo-card'
import { Sparkles, Search, Filter } from 'lucide-react'
import { getMockRepositories, filterRepositories } from '@/lib/mock-data'

export default function ExplorePage() {
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedLanguage, setSelectedLanguage] = useState('all')
    const [selectedStatus, setSelectedStatus] = useState('all')

    const allRepos = getMockRepositories()
    const filteredRepos = filterRepositories({
        language: selectedLanguage,
        status: selectedStatus,
        query: searchQuery
    })

    const languages = ['all', 'JavaScript', 'TypeScript', 'Python', 'Go']
    const statuses = ['all', 'abandoned', 'at-risk', 'reviving']

    return (
        <div className="min-h-screen bg-phoenix-dark">
            {/* Navigation */}
            <nav className="border-b border-white/10 backdrop-blur-lg bg-phoenix-dark/80 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <Link href="/" className="flex items-center gap-2">
                            <Sparkles className="w-8 h-8 text-phoenix-accent" />
                            <span className="text-xl font-bold gradient-text">Project Phoenix</span>
                        </Link>
                        <div className="flex items-center gap-4">
                            <Link href="/dashboard">
                                <Button variant="ghost" size="sm">Dashboard</Button>
                            </Link>
                            <Link href="/auth/login">
                                <Button variant="primary" size="sm">Sign In</Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold mb-2">
                        Explore <span className="gradient-text">Abandoned Projects</span>
                    </h1>
                    <p className="text-gray-400">
                        Discover {allRepos.length} repositories waiting to be revived
                    </p>
                </div>

                {/* Search and Filters */}
                <div className="glass-card p-6 mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {/* Search */}
                        <div className="md:col-span-2">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search repositories..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-phoenix-primary transition"
                                />
                            </div>
                        </div>

                        {/* Language Filter */}
                        <div>
                            <select
                                value={selectedLanguage}
                                onChange={(e) => setSelectedLanguage(e.target.value)}
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-phoenix-primary transition appearance-none cursor-pointer"
                            >
                                <option value="all">All Languages</option>
                                {languages.slice(1).map(lang => (
                                    <option key={lang} value={lang} className="bg-phoenix-darker">
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
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-phoenix-primary transition appearance-none cursor-pointer"
                            >
                                <option value="all">All Statuses</option>
                                {statuses.slice(1).map(status => (
                                    <option key={status} value={status} className="bg-phoenix-darker">
                                        {status.replace('-', ' ').toUpperCase()}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Active Filters */}
                    {(searchQuery || selectedLanguage !== 'all' || selectedStatus !== 'all') && (
                        <div className="mt-4 flex items-center gap-2 flex-wrap">
                            <span className="text-sm text-gray-400">Active filters:</span>
                            {searchQuery && (
                                <span className="px-3 py-1 bg-phoenix-primary/20 text-phoenix-primary rounded-full text-sm">
                                    Search: {searchQuery}
                                </span>
                            )}
                            {selectedLanguage !== 'all' && (
                                <span className="px-3 py-1 bg-phoenix-primary/20 text-phoenix-primary rounded-full text-sm">
                                    {selectedLanguage}
                                </span>
                            )}
                            {selectedStatus !== 'all' && (
                                <span className="px-3 py-1 bg-phoenix-primary/20 text-phoenix-primary rounded-full text-sm">
                                    {selectedStatus.replace('-', ' ')}
                                </span>
                            )}
                            <button
                                onClick={() => {
                                    setSearchQuery('')
                                    setSelectedLanguage('all')
                                    setSelectedStatus('all')
                                }}
                                className="text-sm text-gray-400 hover:text-white transition"
                            >
                                Clear all
                            </button>
                        </div>
                    )}
                </div>

                {/* Results Count */}
                <div className="mb-6 text-sm text-gray-400">
                    Showing <span className="text-white font-semibold">{filteredRepos.length}</span> repositories
                </div>

                {/* Repository Grid */}
                {filteredRepos.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredRepos.map(repo => (
                            <RepoCard key={repo.id} repo={repo} />
                        ))}
                    </div>
                ) : (
                    <div className="glass-card p-12 text-center">
                        <Filter className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold mb-2">No repositories found</h3>
                        <p className="text-gray-400 mb-4">
                            Try adjusting your filters or search query
                        </p>
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
                    </div>
                )}
            </div>
        </div>
    )
}
