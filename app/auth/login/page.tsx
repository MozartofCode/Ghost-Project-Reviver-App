'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Github, Sparkles } from 'lucide-react'
import Link from 'next/link'

export default function LoginPage() {
    const router = useRouter()
    const supabase = createClient()

    const handleGitHubLogin = async () => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'github',
            options: {
                redirectTo: `${window.location.origin}/auth/callback`,
            },
        })

        if (error) {
            console.error('Error logging in:', error.message)
            alert('Failed to login with GitHub. Please try again.')
        }
    }

    return (
        <div className="min-h-screen bg-phoenix-dark flex items-center justify-center px-4">
            <div className="max-w-md w-full">
                {/* Logo */}
                <div className="text-center mb-8">
                    <Link href="/" className="inline-flex items-center gap-2 mb-4">
                        <Sparkles className="w-12 h-12 text-phoenix-accent" />
                        <span className="text-3xl font-bold gradient-text">Project Phoenix</span>
                    </Link>
                    <h1 className="text-2xl font-bold mb-2">Welcome Back</h1>
                    <p className="text-gray-400">Sign in to start reviving projects</p>
                </div>

                {/* Login Card */}
                <Card glass className="p-8">
                    <Button
                        onClick={handleGitHubLogin}
                        size="lg"
                        className="w-full gap-3"
                    >
                        <Github className="w-5 h-5" />
                        Continue with GitHub
                    </Button>

                    <div className="mt-6 text-center text-sm text-gray-400">
                        <p>
                            By signing in, you agree to our{' '}
                            <Link href="#" className="text-phoenix-primary hover:underline">
                                Terms of Service
                            </Link>{' '}
                            and{' '}
                            <Link href="#" className="text-phoenix-primary hover:underline">
                                Privacy Policy
                            </Link>
                        </p>
                    </div>
                </Card>

                {/* Back to Home */}
                <div className="mt-6 text-center">
                    <Link href="/" className="text-sm text-gray-400 hover:text-white transition">
                        ← Back to Home
                    </Link>
                </div>
            </div>
        </div>
    )
}
