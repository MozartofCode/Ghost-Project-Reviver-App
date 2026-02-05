'use client'

import { useEffect, useState } from 'react'
import { getCurrentUser, logout, User } from '@/lib/auth/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Leaf, LogOut, Loader2, SlidersHorizontal, ArrowUpDown } from 'lucide-react'
import { StatsGrid } from '@/components/dashboard/stats-grid'
import { MyProjectCard } from '@/components/dashboard/my-project-card'
import { MySquadCard } from '@/components/dashboard/my-squad-card'
import { EmptyState } from '@/components/dashboard/empty-state'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export default function DashboardPage() {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)
    const [stats, setStats] = useState<any>(null)
    const [projects, setProjects] = useState<any[]>([])
    const [squads, setSquads] = useState<any[]>([])

    // Filters
    const [statusFilter, setStatusFilter] = useState('all')
    const [sortBy, setSortBy] = useState('recent')

    const router = useRouter()

    useEffect(() => {
        checkUser()
    }, [])

    const checkUser = async () => {
        const currentUser = await getCurrentUser()

        if (!currentUser) {
            router.push('/auth/login')
            return
        }

        setUser(currentUser)
        await Promise.all([
            fetchStats(),
            fetchProjects(),
            fetchSquads()
        ])
        setLoading(false)
    }

    const fetchStats = async () => {
        try {
            const res = await fetch('/api/users/me/stats')
            const data = await res.json()
            if (data.stats) setStats(data.stats)
        } catch (err) {
            console.error('Failed to load stats', err)
        }
    }

    const fetchProjects = async () => {
        try {
            const res = await fetch('/api/users/me/projects')
            const data = await res.json()
            if (data.projects) setProjects(data.projects)
        } catch (err) {
            console.error('Failed to load projects', err)
        }
    }

    const fetchSquads = async () => {
        try {
            const res = await fetch('/api/users/me/squads')
            const data = await res.json()
            if (data.squads) setSquads(data.squads)
        } catch (err) {
            console.error('Failed to load squads', err)
        }
    }

    const handleSignOut = async () => {
        await logout()
    }

    const handleLeaveSquad = async (squadId: string) => {
        try {
            const res = await fetch(`/api/squads/${squadId}/members`, {
                method: 'DELETE'
            })

            if (res.ok) {
                // Optimistic update
                setSquads(prev => prev.filter(s => s.id !== squadId))
                // Refresh data to ensure consistency (e.g. stats, projects list)
                fetchStats()
                fetchProjects()
            }
        } catch (err) {
            console.error('Failed to leave squad', err)
            alert('Failed to leave squad')
        }
    }

    // Filter and Sort Logic
    const getFilteredAndSortedProjects = () => {
        let filtered = [...projects]

        if (statusFilter !== 'all') {
            filtered = filtered.filter(p => p.abandonment_status === statusFilter)
        }

        return filtered.sort((a, b) => {
            if (sortBy === 'recent') {
                return new Date(b.last_activity || 0).getTime() - new Date(a.last_activity || 0).getTime()
            } else if (sortBy === 'name') {
                return a.name.localeCompare(b.name)
            }
            return 0
        })
    }

    const getFilteredAndSortedSquads = () => {
        let filtered = [...squads]

        // Squads don't have their own status per se, but we can filter by parent project status
        if (statusFilter !== 'all') {
            filtered = filtered.filter(s => s.project.abandonment_status === statusFilter)
        }

        return filtered.sort((a, b) => {
            if (sortBy === 'recent') {
                return new Date(b.joined_at).getTime() - new Date(a.joined_at).getTime()
            } else if (sortBy === 'name') {
                return a.name.localeCompare(b.name)
            }
            return 0
        })
    }

    const filteredProjects = getFilteredAndSortedProjects()
    const filteredSquads = getFilteredAndSortedSquads()

    if (loading) {
        return (
            <div className="min-h-screen bg-cream flex items-center justify-center">
                <Loader2 className="w-12 h-12 animate-spin text-forest-600" />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-cream">
            {/* Navigation */}
            <nav className="border-b border-forest-100 bg-white/80 backdrop-blur-md sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <Link href="/" className="flex items-center gap-2">
                            <Leaf className="w-6 h-6 text-forest-600" />
                            <span className="text-xl font-bold text-forest-900">Project Phoenix</span>
                        </Link>
                        <div className="flex items-center gap-4">
                            <Link href="/explore">
                                <Button variant="ghost" size="sm" className="text-forest-700 hover:text-forest-900 hover:bg-forest-50">
                                    Explore
                                </Button>
                            </Link>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleSignOut}
                                className="gap-2 text-forest-700 hover:text-red-700 hover:bg-red-50"
                            >
                                <LogOut className="w-4 h-4" />
                                Sign Out
                            </Button>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Header */}
                <div className="mb-10">
                    <h1 className="text-4xl font-bold mb-2 text-forest-900">
                        Welcome back, <span className="text-forest-700">{user?.username}</span>
                    </h1>
                    <p className="text-forest-600">
                        Track your revival efforts and squad activities
                    </p>
                </div>

                {/* Stats */}
                {stats && (
                    <div className="mb-12">
                        <StatsGrid stats={stats} />
                    </div>
                )}

                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-4 mb-8 items-start sm:items-center justify-between">
                    <h2 className="text-2xl font-bold text-forest-900 flex items-center gap-2">
                        Your Revivals
                        <span className="text-sm font-normal text-forest-500 bg-forest-50 px-2 py-1 rounded-full">
                            {filteredProjects.length} Projects • {filteredSquads.length} Squads
                        </span>
                    </h2>

                    <div className="flex gap-3 w-full sm:w-auto">
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-[160px] bg-white border-forest-200">
                                <SlidersHorizontal className="w-4 h-4 mr-2 text-forest-500" />
                                <SelectValue placeholder="All Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="active">Thriving</SelectItem>
                                <SelectItem value="reviving">Sprouting</SelectItem>
                                <SelectItem value="at-risk">Wilting</SelectItem>
                                <SelectItem value="abandoned">Withered</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select value={sortBy} onValueChange={setSortBy}>
                            <SelectTrigger className="w-[160px] bg-white border-forest-200">
                                <ArrowUpDown className="w-4 h-4 mr-2 text-forest-500" />
                                <SelectValue placeholder="Sort by" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="recent">Recent Activity</SelectItem>
                                <SelectItem value="name">Name (A-Z)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

                    {/* My Projects */}
                    <div className="space-y-6">
                        <h3 className="text-xl font-bold text-forest-800 pb-2 border-b-2 border-forest-100 uppercase tracking-wider text-sm">
                            📦 My Projects
                        </h3>

                        {filteredProjects.length > 0 ? (
                            <div className="grid gap-6">
                                {filteredProjects.map(project => (
                                    <div key={project.id} className="h-48">
                                        <MyProjectCard project={project} />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <EmptyState type="projects" />
                        )}
                    </div>

                    {/* My Squads */}
                    <div className="space-y-6">
                        <h3 className="text-xl font-bold text-forest-800 pb-2 border-b-2 border-forest-100 uppercase tracking-wider text-sm">
                            👥 My Squads
                        </h3>

                        {filteredSquads.length > 0 ? (
                            <div className="grid gap-6">
                                {filteredSquads.map(squad => (
                                    <MySquadCard
                                        key={squad.id}
                                        squad={squad}
                                        onLeave={handleLeaveSquad}
                                    />
                                ))}
                            </div>
                        ) : (
                            <EmptyState type="squads" />
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
