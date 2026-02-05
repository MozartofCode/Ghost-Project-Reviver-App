/**
 * Client-side authentication utilities
 * These functions run in the browser
 */

export interface User {
    id: string
    github_id: number
    username: string
    email?: string
    avatar_url?: string
    bio?: string
    location?: string
    created_at: string
}

/**
 * Get current authenticated user
 */
export async function getCurrentUser(): Promise<User | null> {
    try {
        const res = await fetch('/api/auth/me', {
            credentials: 'include', // Important: include cookies
        })

        if (!res.ok) {
            if (res.status === 401) {
                return null // Not authenticated
            }
            throw new Error('Failed to fetch user')
        }

        const data = await res.json()
        return data.user
    } catch (error) {
        console.error('Error fetching current user:', error)
        return null
    }
}

/**
 * Logout current user
 */
export async function logout(): Promise<void> {
    try {
        await fetch('/api/auth/logout', {
            method: 'POST',
            credentials: 'include',
        })

        // Redirect to home page
        window.location.href = '/'
    } catch (error) {
        console.error('Error logging out:', error)
        // Still redirect even if request failed
        window.location.href = '/'
    }
}

/**
 * Check if user is authenticated (client-side)
 */
export async function isAuthenticated(): Promise<boolean> {
    const user = await getCurrentUser()
    return user !== null
}

