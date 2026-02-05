# Ticket #1: GitHub OAuth Authentication

**Priority**: P0 (Highest - Foundational)  
**Status**: Ready for Implementation  
**Estimated Effort**: 4-6 hours

## 📋 Overview
Implement GitHub OAuth as the primary authentication method. Users will login/register using their GitHub accounts, and their profile data (avatar, name, username) will be automatically synced.

## 🎯 Requirements
- Replace current email/password auth with GitHub OAuth
- Auto-sync GitHub profile data: avatar, name, username, email
- Store user data in Supabase `users` table
- Do NOT use Supabase Auth - implement custom GitHub OAuth flow
- Maintain user sessions with secure JWT/cookies
- Redirect authenticated users to dashboard, unauthenticated to login

## 🔧 Technical Approach

### Phase 1: Setup & Dependencies
- [ ] Install/verify required packages: `@octokit/rest`, `next-auth` or custom OAuth flow
- [ ] Register GitHub OAuth App in GitHub Developer Settings
  - Get Client ID and Client Secret
  - Set callback URL: `http://localhost:3000/api/auth/callback/github`
- [ ] Add GitHub credentials to `.env.local`:
  ```
  GITHUB_CLIENT_ID=your_client_id
  GITHUB_CLIENT_SECRET=your_client_secret
  ```

### Phase 2: Backend API Development
- [ ] **Create**: `/app/api/auth/github/route.ts` - Initiates GitHub OAuth flow
  - Redirects to GitHub authorization URL
  - Includes scopes: `read:user`, `user:email`
  
- [ ] **Create**: `/app/api/auth/callback/github/route.ts` - Handles OAuth callback
  - Exchange code for access token
  - Fetch user data from GitHub API
  - Check if user exists in Supabase `users` table
  - If new user: INSERT into users table
  - If existing user: UPDATE profile data
  - Create session token/cookie
  - Redirect to `/dashboard`

- [ ] **Create**: `/app/api/auth/logout/route.ts` - Handles logout
  - Clear session cookies
  - Redirect to home page

- [ ] **Create**: `/app/api/auth/me/route.ts` - Returns current user data
  - Verify session token
  - Return user object or 401

### Phase 3: Database Schema Updates
- [ ] **Update**: `database/schema.sql` - Modify users table if needed:
  ```sql
  ALTER TABLE users ADD COLUMN IF NOT EXISTS github_id TEXT UNIQUE;
  ALTER TABLE users ADD COLUMN IF NOT EXISTS github_username TEXT;
  ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar_url TEXT;
  ALTER TABLE users ADD COLUMN IF NOT EXISTS github_access_token TEXT; -- encrypted
  ```

### Phase 4: Frontend Components
- [ ] **Update**: `/app/auth/login/page.tsx`
  - Remove email/password form
  - Add "Sign in with GitHub" button with GitHub icon
  - Styled with organic theme (forest colors)
  - Button redirects to `/api/auth/github`

- [ ] **Create**: `/lib/auth/client.ts` - Client-side auth utilities
  ```typescript
  export async function getCurrentUser() {
    const res = await fetch('/api/auth/me')
    if (!res.ok) return null
    return res.json()
  }
  
  export async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    window.location.href = '/'
  }
  ```

- [ ] **Update**: `/app/dashboard/page.tsx`
  - Use new auth utilities to fetch current user
  - Display GitHub avatar, name, username
  - Handle unauthenticated state (redirect to login)

### Phase 5: Navigation & Auth Guards
- [ ] **Update**: `/app/page.tsx` (landing page)
  - Change "Sign In" button to trigger GitHub OAuth
  
- [ ] **Create**: `/lib/auth/middleware.ts` (optional)
  - Middleware to protect routes
  - Check auth status before rendering protected pages

- [ ] **Update**: All protected pages (dashboard, etc.)
  - Add auth checks at top of component
  - Redirect to login if not authenticated

### Phase 6: Session Management
- [ ] **Create**: `/lib/auth/session.ts`
  - Generate secure session tokens (JWT or random tokens)
  - Store in httpOnly cookies
  - Set appropriate expiration (7-30 days)
  - Verify tokens on each request

## ✅ Verification Steps
1. Navigate to `/auth/login` - should see "Sign in with GitHub" button
2. Click button - redirects to GitHub authorization page
3. Authorize the app - redirects back to app
4. Should land on `/dashboard` with user info displayed
5. Refresh page - user should still be authenticated
6. Click logout - should clear session and redirect to home
7. Try accessing `/dashboard` without auth - should redirect to login
8. Check Supabase `users` table - new user record should exist

## 📂 Files to Create/Modify
**Create:**
- `/app/api/auth/github/route.ts`
- `/app/api/auth/callback/github/route.ts`
- `/app/api/auth/logout/route.ts`
- `/app/api/auth/me/route.ts`
- `/lib/auth/client.ts`
- `/lib/auth/session.ts`

**Modify:**
- `/app/auth/login/page.tsx`
- `/app/dashboard/page.tsx`
- `/app/page.tsx`
- `.env.local.example` (add GitHub OAuth variables)
- Database schema (add GitHub-related columns)

## 🚨 Edge Cases & Security
- Handle GitHub API errors gracefully
- Encrypt/secure GitHub access tokens in database
- Implement CSRF protection for OAuth flow
- Handle token expiration and refresh
- Rate limiting on auth endpoints
- Proper error messages for users (don't expose technical details)

## 📝 Notes
- Keep existing Supabase connection for data storage
- Session tokens should be httpOnly, secure, sameSite=strict
- Consider adding "prompt=consent" to GitHub OAuth URL to allow re-authentication
