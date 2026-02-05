'use client'

import { useEffect, useState } from 'react'
import { getCurrentUser, logout, User } from '@/lib/auth/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Leaf, LogOut, User as UserIcon, Loader2 } from 'lucide-react'

export default function DashboardPage() {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)
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
        setLoading(false)
    }

    const handleSignOut = async () => {
        await logout()
        // logout() already redirects to home
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-phoenix-dark flex items-center justify-center">
                <Loader2 className="w-12 h-12 animate-spin text-phoenix-primary" />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-phoenix-dark">
            {/* Navigation */}
            <nav className="border-b border-white/10 backdrop-blur-lg bg-phoenix-dark/80">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <Link href="/" className="flex items-center gap-2">
                            <Leaf className="w-8 h-8 text-forest-600" />
                            <span className="text-xl font-bold text-forest-900">Project Phoenix</span>
                        </Link>
                        <div className="flex items-center gap-4">
                            <Link href="/explore">
                                <Button variant="ghost" size="sm">Explore</Button>
                            </Link>
                            <Button variant="ghost" size="sm" onClick={handleSignOut} className="gap-2">
                                <LogOut className="w-4 h-4" />
                                Sign Out
                            </Button>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold mb-2 text-forest-900">
                        Welcome back, <span className="text-forest-700">{user?.username || 'Developer'}</span>
                    </h1>
                    <p className="text-gray-400">
                        Your project revival dashboard
                    </p>
                </div>

                {/* User Info Card */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <Card glass className="p-6">
                        <div className="flex items-center gap-4">
                            {user?.avatar_url ? (
                                <img
                                    src={user.avatar_url}
                                    alt="Avatar"
                                    className="w-16 h-16 rounded-full border-2 border-forest-600"
                                />
                            ) : (
                                <div className="w-16 h-16 rounded-full bg-forest-100 flex items-center justify-center">
                                    <UserIcon className="w-8 h-8 text-forest-600" />
                                </div>
                            )}
                            <div>
                                <h3 className="font-semibold text-lg text-forest-900">{user?.username || 'User'}</h3>
                                <p className="text-sm text-forest-600">@{user?.username || 'username'}</p>
                            </div>
                        </div>
                    </Card>

                    <Card glass className="p-6">
                        <CardHeader className="p-0 mb-2">
                            <CardTitle className="text-lg">My Squads</CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <p className="text-3xl font-bold">0</p>
                            <p className="text-sm text-gray-400">Active revivals</p>
                        </CardContent>
                    </Card>

                    <Card glass className="p-6">
                        <CardHeader className="p-0 mb-2">
                            <CardTitle className="text-lg">Contributions</CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <p className="text-3xl font-bold">0</p>
                            <p className="text-sm text-gray-400">Projects helped</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Quick Actions */}
                <Card glass className="p-8 text-center">
                    <h2 className="text-2xl font-bold mb-4">Ready to Revive a Project?</h2>
                    <p className="text-gray-400 mb-6">
                        Browse abandoned repositories and join a revival squad
                    </p>
                    <Link href="/explore">
                        <Button size="lg">Explore Repositories</Button>
                    </Link>
                </Card>
            </div>
        </div>
    )
}
