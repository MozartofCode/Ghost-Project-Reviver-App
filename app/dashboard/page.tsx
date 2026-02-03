'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Sparkles, LogOut, User, Loader2 } from 'lucide-react'

export default function DashboardPage() {
    const [user, setUser] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const router = useRouter()
    const supabase = createClient()

    useEffect(() => {
        checkUser()
    }, [])

    const checkUser = async () => {
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            router.push('/auth/login')
            return
        }

        setUser(user)
        setLoading(false)
    }

    const handleSignOut = async () => {
        await supabase.auth.signOut()
        router.push('/')
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
                            <Sparkles className="w-8 h-8 text-phoenix-accent" />
                            <span className="text-xl font-bold gradient-text">Project Phoenix</span>
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
                    <h1 className="text-4xl font-bold mb-2">
                        Welcome back, <span className="gradient-text">{user?.user_metadata?.user_name || 'Developer'}</span>
                    </h1>
                    <p className="text-gray-400">
                        Your project revival dashboard
                    </p>
                </div>

                {/* User Info Card */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <Card glass className="p-6">
                        <div className="flex items-center gap-4">
                            {user?.user_metadata?.avatar_url ? (
                                <img
                                    src={user.user_metadata.avatar_url}
                                    alt="Avatar"
                                    className="w-16 h-16 rounded-full border-2 border-phoenix-primary"
                                />
                            ) : (
                                <div className="w-16 h-16 rounded-full bg-phoenix-primary/20 flex items-center justify-center">
                                    <User className="w-8 h-8 text-phoenix-primary" />
                                </div>
                            )}
                            <div>
                                <h3 className="font-semibold text-lg">{user?.user_metadata?.full_name || 'User'}</h3>
                                <p className="text-sm text-gray-400">@{user?.user_metadata?.user_name || 'username'}</p>
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
