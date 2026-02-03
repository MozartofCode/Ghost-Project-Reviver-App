# Database Setup Instructions

## Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign in or create an account
3. Click "New Project"
4. Fill in project details:
   - **Name:** Ghost Project Reviver (or your preferred name)
   - **Database Password:** Choose a strong password (save this!)
   - **Region:** Choose closest to you
   - **Pricing Plan:** Start with Free tier for MVP

5. Wait for project to be created (takes ~2 minutes)

## Step 2: Get Your Credentials

Once the project is created:

1. Go to **Project Settings** > **API**
2. Copy the following values:
   - **Project URL** (`NEXT_PUBLIC_SUPABASE_URL`)
   - **anon/public key** (`NEXT_PUBLIC_SUPABASE_ANON_KEY`)
   - **service_role key** (`SUPABASE_SERVICE_ROLE_KEY`) - ⚠️ Keep this secret!

3. Create a `.env.local` file in the root directory:
   ```bash
   cp .env.local.example .env.local
   ```

4. Update `.env.local` with your actual values

## Step 3: Run Database Schema

1. Go to **SQL Editor** in your Supabase dashboard
2. Click **New Query**
3. Copy the entire content of `database/schema.sql`
4. Paste it into the SQL Editor
5. Click **Run** (or press Ctrl/Cmd + Enter)

You should see success messages for each table created.

## Step 4: Configure GitHub OAuth (for authentication)

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click **New OAuth App**
3. Fill in:
   - **Application name:** Ghost Project Reviver
   - **Homepage URL:** `http://localhost:3000`
   - **Authorization callback URL:** `https://YOUR_SUPABASE_PROJECT.supabase.co/auth/v1/callback`
     (Replace YOUR_SUPABASE_PROJECT with your actual project URL)
4. Click **Register application**
5. Copy the **Client ID**
6. Generate a **Client Secret** and copy it

7. In Supabase Dashboard:
   - Go to **Authentication** > **Providers**
   - Find **GitHub** and toggle it ON
   - Paste your **Client ID** and **Client Secret**
   - Click **Save**

## Step 5: Create GitHub Personal Access Token (for API)

This is for fetching repository data from GitHub API.

1. Go to [GitHub Settings > Tokens (classic)](https://github.com/settings/tokens)
2. Click **Generate new token (classic)**
3. Select scopes:
   - ✅ `public_repo` - Access public repositories
   - ✅ `read:user` - Read user profile data
4. Click **Generate token**
5. Copy the token immediately (you won't see it again!)
6. Add it to your `.env.local`:
   ```
   GITHUB_PERSONAL_ACCESS_TOKEN=ghp_your_token_here
   ```

## Step 6: Verify Setup

Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). You should see the landing page!

## Database Tables Created

✅ **users** - User profiles from GitHub OAuth  
✅ **repositories** - GitHub repositories added to the platform  
✅ **squads** - Revival teams for each repository  
✅ **squad_members** - Members of each squad with roles  
✅ **activity_feed** - Platform activity stream  
✅ **repo_metrics** - Repository analysis metrics (dummy data for MVP)

## seed Data (Optional)

For testing purposes, you can manually add some repositories through the UI once the app is running, or run seed scripts (to be created).

## Troubleshooting

### "relation already exists" error
If you run the schema twice, you might see this error. It's safe to ignore or drop the existing tables first.

### Authentication not working
1. Double-check your callback URL in GitHub OAuth app
2. Verify Supabase GitHub provider is enabled
3. Check that Client ID and Secret are correct

### GitHub API rate limits
Without authentication, GitHub limits you to 60 requests/hour. With a Personal Access Token, you get 5,000 requests/hour.

## Next Steps

Once your database is set up:
1. ✅ Environment variables configured
2. ✅ Database schema created
3. ✅ Authentication configured
4. ▶️ Start building the app!
