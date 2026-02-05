import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createSession } from '@/lib/auth/session'

/**
 * Handle GitHub OAuth callback
 * GET /api/auth/callback/github
 */
export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams
    const code = searchParams.get('code')
    const state = searchParams.get('state')

    // Verify state to prevent CSRF
    const storedState = request.cookies.get('oauth_state')?.value

    if (!code || !state || state !== storedState) {
        return NextResponse.redirect(
            `${process.env.NEXT_PUBLIC_APP_URL}/auth/login?error=invalid_state`
        )
    }

    try {
        // Exchange code for access token
        const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
            body: JSON.stringify({
                client_id: process.env.GITHUB_CLIENT_ID!,
                client_secret: process.env.GITHUB_CLIENT_SECRET!,
                code,
            }),
        })

        const tokenData = await tokenResponse.json()

        if (tokenData.error || !tokenData.access_token) {
            console.error('GitHub OAuth error:', tokenData)
            return NextResponse.redirect(
                `${process.env.NEXT_PUBLIC_APP_URL}/auth/login?error=oauth_failed`
            )
        }

        const accessToken = tokenData.access_token

        // Fetch user data from GitHub
        const userResponse = await fetch('https://api.github.com/user', {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                Accept: 'application/json',
            },
        })

        const githubUser = await userResponse.json()

        if (!githubUser.id) {
            return NextResponse.redirect(
                `${process.env.NEXT_PUBLIC_APP_URL}/auth/login?error=user_fetch_failed`
            )
        }

        // Fetch user's email if not public
        let email = githubUser.email
        if (!email) {
            const emailResponse = await fetch('https://api.github.com/user/emails', {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    Accept: 'application/json',
                },
            })
            const emails = await emailResponse.json()
            const primaryEmail = emails.find((e: any) => e.primary)
            email = primaryEmail?.email || null
        }

        // Create or update user in database
        const supabase = await createClient()

        // Check if user exists
        const { data: existingUser } = await supabase
            .from('users')
            .select('*')
            .eq('github_id', githubUser.id)
            .single()

        let userId: string

        if (existingUser) {
            // Update existing user
            const { data: updatedUser, error } = await supabase
                .from('users')
                .update({
                    username: githubUser.login,
                    email,
                    avatar_url: githubUser.avatar_url,
                    bio: githubUser.bio,
                    location: githubUser.location,
                    website_url: githubUser.blog,
                    twitter_username: githubUser.twitter_username,
                    updated_at: new Date().toISOString(),
                })
                .eq('github_id', githubUser.id)
                .select('id')
                .single()

            if (error) {
                console.error('Error updating user:', error)
                return NextResponse.redirect(
                    `${process.env.NEXT_PUBLIC_APP_URL}/auth/login?error=db_error`
                )
            }

            userId = updatedUser.id
        } else {
            // Create new user
            const { data: newUser, error } = await supabase
                .from('users')
                .insert({
                    github_id: githubUser.id,
                    username: githubUser.login,
                    email,
                    avatar_url: githubUser.avatar_url,
                    bio: githubUser.bio,
                    location: githubUser.location,
                    website_url: githubUser.blog,
                    twitter_username: githubUser.twitter_username,
                })
                .select('id')
                .single()

            if (error) {
                console.error('Error creating user:', error)
                return NextResponse.redirect(
                    `${process.env.NEXT_PUBLIC_APP_URL}/auth/login?error=db_error`
                )
            }

            userId = newUser.id
        }

        // Create session
        await createSession({
            userId,
            githubId: githubUser.id,
            username: githubUser.login,
            email,
            avatarUrl: githubUser.avatar_url,
        })

        // Redirect to dashboard
        const response = NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/dashboard`)

        // Clear state cookie
        response.cookies.delete('oauth_state')

        return response
    } catch (error) {
        console.error('OAuth callback error:', error)
        return NextResponse.redirect(
            `${process.env.NEXT_PUBLIC_APP_URL}/auth/login?error=unexpected_error`
        )
    }
}
