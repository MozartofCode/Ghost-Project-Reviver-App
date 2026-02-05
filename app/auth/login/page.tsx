'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Github, Leaf, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function LoginPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const errorParam = searchParams?.get('error')
        if (errorParam) {
            switch (errorParam) {
                case 'invalid_state':
                    setError('Security verification failed. Please try again.')
                    break
                case 'oauth_failed':
                    setError('GitHub authentication failed. Please try again.')
                    break
                case 'user_fetch_failed':
                    setError('Could not fetch your GitHub profile. Please try again.')
                    break
                case 'db_error':
                    setError('Database error. Please try again later.')
                    break
                default:
                    setError('An unexpected error occurred. Please try again.')
            }
        }
    }, [searchParams])

    const handleGitHubLogin = () => {
        // Redirect to our custom GitHub OAuth endpoint
        window.location.href = '/api/auth/github'
    }

    return (
        <div className="min-h-screen bg-cream flex items-center justify-center px-4 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-mint-light/30 rounded-full blur-3xl -translate-y-1/3 translate-x-1/3 -z-10"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-forest-100/40 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4 -z-10"></div>

            <div className="max-w-md w-full relative z-10">
                {/* Logo */}
                <div className="text-center mb-8">
                    <Link href="/" className="inline-flex items-center gap-2 mb-6">
                        <div className="bg-forest-100 p-3 rounded-full">
                            <Leaf className="w-10 h-10 text-forest-600 fill-forest-600" />
                        </div>
                        <span className="text-3xl font-bold text-forest-900">Project Phoenix</span>
                    </Link>
                    <h1 className="text-3xl font-bold mb-2 text-forest-900">Welcome Back</h1>
                    <p className="text-forest-600">Sign in with GitHub to start reviving projects</p>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-2xl flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-red-700">{error}</p>
                    </div>
                )}

                {/* Login Card */}
                <Card className="bg-white border-2 border-forest-100 rounded-3xl shadow-organic p-8">
                    <Button
                        onClick={handleGitHubLogin}
                        size="lg"
                        className="w-full gap-3 h-14 rounded-2xl bg-forest-700 hover:bg-forest-800 text-white text-lg shadow-lg shadow-forest-700/20 hover:shadow-xl hover:scale-105 transition-all"
                    >
                        <Github className="w-6 h-6" />
                        Continue with GitHub
                    </Button>

                    <div className="mt-6 text-center text-sm text-forest-500">
                        <p>
                            By signing in, you agree to our{' '}
                            <Link href="#" className="text-forest-700 hover:underline font-semibold">
                                Terms of Service
                            </Link>{' '}
                            and{' '}
                            <Link href="#" className="text-forest-700 hover:underline font-semibold">
                                Privacy Policy
                            </Link>
                        </p>
                    </div>
                </Card>

                {/* Back to Home */}
                <div className="mt-6 text-center">
                    <Link href="/" className="text-sm text-forest-600 hover:text-forest-800 transition font-medium">
                        ← Back to Home
                    </Link>
                </div>
            </div>
        </div>
    )
}
