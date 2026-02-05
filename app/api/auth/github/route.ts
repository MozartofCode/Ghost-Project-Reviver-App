import { NextRequest, NextResponse } from 'next/server'

/**
 * Initiate GitHub OAuth flow
 * GET /api/auth/github
 */
export async function GET(request: NextRequest) {
    const clientId = process.env.GITHUB_CLIENT_ID

    if (!clientId) {
        return NextResponse.json(
            { error: 'GitHub OAuth is not configured' },
            { status: 500 }
        )
    }

    // Generate a random state for CSRF protection
    const state = crypto.randomUUID()

    // Build GitHub authorization URL
    const params = new URLSearchParams({
        client_id: clientId,
        redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback/github`,
        scope: 'read:user user:email',
        state,
    })

    const githubAuthUrl = `https://github.com/login/oauth/authorize?${params.toString()}`

    // Store state in cookie for verification in callback
    const response = NextResponse.redirect(githubAuthUrl)
    response.cookies.set('oauth_state', state, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 600, // 10 minutes
        path: '/',
    })

    return response
}
