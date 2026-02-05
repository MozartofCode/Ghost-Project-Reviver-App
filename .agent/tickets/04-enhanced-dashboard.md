# Ticket #4: Enhanced Dashboard - My Projects & Squads

**Priority**: P1 (High)  
**Status**: Ready for Implementation  
**Estimated Effort**: 4-5 hours

## 📋 Overview
Enhance the user dashboard to show all projects and squads the user is part of. This creates a central hub for users to manage their involvement across the platform.

## 🎯 Requirements
- Display all projects user is contributing to (via squad membership)
- Display all squads user is a member of
- Show project health/status indicators
- Quick actions: View project, Message squad, Leave squad
- Filter/sort capabilities (by status, activity, join date)
- Empty states for new users

## 🎨 Dashboard Sections

### Section 1: My Projects
- Shows all unique projects where user is in at least one squad
- Card per project with:
  - Project name, description
  - Abandonment status (Sprouting, At-Risk, Withered)
  - Number of squads user is in for this project
  - Last activity date
  - Quick link to project detail page

### Section 2: My Squads
- Shows all squads user is a member of
- Card per squad with:
  - Squad name, description
  - Parent project name/link
  - Member count
  - User's join date
  - Quick actions: View Squad, Message Squad, Leave Squad

### Section 3: User Stats
- Total projects involved in
- Total squads joined
- Total contributions (future: track actual contributions)
- Account created date

## 🔧 Technical Approach

### Phase 1: Backend API Development

- [ ] **Create**: `/app/api/users/me/projects/route.ts`
  - `GET`: Fetch all projects user is involved in
  ```typescript
  // Response
  {
    projects: [
      {
        id: string,
        name: string,
        description: string,
        abandonment_status: string,
        squad_count: number, // # of squads user is in for this project
        last_activity: string,
        url: string
      }
    ]
  }
  ```
  - Logic: Join `squad_members` → `squads` → `repositories`
  - Filter by current user's ID

- [ ] **Create**: `/app/api/users/me/squads/route.ts`
  - `GET`: Fetch all squads user is a member of
  ```typescript
  // Response
  {
    squads: [
      {
        id: string,
        name: string,
        description: string,
        member_count: number,
        role: string, // user's role in squad
        joined_at: string,
        project: {
          id: string,
          name: string,
          description: string,
          abandonment_status: string
        }
      }
    ]
  }
  ```

- [ ] **Update**: `/app/api/users/me/stats/route.ts` (or create)
  - `GET`: Fetch user statistics
  ```typescript
  // Response
  {
    stats: {
      total_projects: number,
      total_squads: number,
      total_contributions: number,
      account_created: string
    }
  }
  ```

### Phase 2: Frontend Components

#### Project Card (Dashboard variant)
- [ ] **Create**: `/components/dashboard/my-project-card.tsx`
  ```typescript
  interface MyProjectCardProps {
    project: {
      id: string
      name: string
      description: string
      abandonment_status: string
      squad_count: number
      last_activity: string
    }
  }
  ```
  - Organic theme styling
  - Status badge (Sprouting/At-Risk/Withered)
  - "X squads" indicator
  - "View Project" button
  - Last activity timestamp

#### Squad Card (Dashboard variant)
- [ ] **Create**: `/components/dashboard/my-squad-card.tsx`
  ```typescript
  interface MySquadCardProps {
    squad: {
      id: string
      name: string
      description: string
      member_count: number
      role: string
      joined_at: string
      project: { id, name, abandonment_status }
    }
    onLeave: () => void
  }
  ```
  - Shows parent project info
  - Member count badge
  - User's role badge (Creator/Member/Moderator)
  - Joined date
  - Action buttons: "View Project", "Message Squad", "Leave Squad"

#### Stats Cards
- [ ] **Create**: `/components/dashboard/stats-grid.tsx`
  - Grid of stat cards
  - Each card: Icon, number, label
  - Organic theme styling
  - Animated counter (optional)

### Phase 3: Page Updates

- [ ] **Update**: `/app/dashboard/page.tsx`
  - Replace placeholder content with real data
  - Load user projects, squads, and stats on mount
  - Add loading states (skeleton screens)
  - Add error handling
  
  **Layout structure:**
  ```
  ┌─────────────────────────────────────┐
  │ Welcome back, [User]                │
  │ Your project revival dashboard      │
  └─────────────────────────────────────┘
  
  ┌──────────┬──────────┬──────────┐
  │ X        │ X        │ X        │
  │ Projects │ Squads   │ Contribs │
  └──────────┴──────────┴──────────┘
  
  ┌─────────────────────────────────────┐
  │ 📦 My Projects                      │
  │ [Project Card] [Project Card] ...   │
  └─────────────────────────────────────┘
  
  ┌─────────────────────────────────────┐
  │ 👥 My Squads                        │
  │ [Squad Card] [Squad Card] ...       │
  └─────────────────────────────────────┘
  
  ┌─────────────────────────────────────┐
  │ Empty state or CTA                  │
  └─────────────────────────────────────┘
  ```

### Phase 4: Filters & Sorting

- [ ] **Add**: Filter/sort controls to dashboard
  - **Filter by project status**: All, Sprouting, At-Risk, Withered
  - **Sort by**: Recent activity, Join date, Alphabetical
  - Apply to both projects and squads sections
  - Maintain filter state in URL query params

### Phase 5: Empty States

- [ ] **Create**: Empty state components for new users
  - **No projects**: "You haven't joined any projects yet. Start exploring!"
  - **No squads**: "Join a squad to start collaborating on projects."
  - CTA buttons: "Explore Projects", "Browse Squads"
  - Welcoming illustration or icon

### Phase 6: Responsive Design

- [ ] Ensure dashboard is fully responsive
  - Desktop: Multi-column grids
  - Tablet: 2-column grids
  - Mobile: Single column, stacked cards
  - Touch-friendly buttons and actions

## ✅ Verification Steps

1. **As a new user (no squads)**:
   - Navigate to `/dashboard`
   - See empty states with helpful CTAs
   - Stats show 0 projects, 0 squads

2. **After joining squads**:
   - See projects listed in "My Projects"
   - See squads listed in "My Squads"  
   - Stats updated with correct counts

3. **Project cards**:
   - Display correct project info
   - Status badges show correct state
   - Squad count is accurate
   - "View Project" link works

4. **Squad cards**:
   - Display squad and parent project info
   - Member count is accurate
   - User's role is displayed
   - "Leave Squad" button works
   - "View Project" link navigates correctly

5. **Filters**:
   - Filter by status (only shows matching projects)
   - Sort options reorder items correctly
   - Filters persist on page refresh (URL params)

6. **Responsive**:
   - Test on mobile, tablet, desktop
   - All cards readable and actionable
   - No horizontal scrolling

## 📂 Files to Create/Modify

**Create:**
- `/app/api/users/me/projects/route.ts`
- `/app/api/users/me/squads/route.ts`
- `/app/api/users/me/stats/route.ts`
- `/components/dashboard/my-project-card.tsx`
- `/components/dashboard/my-squad-card.tsx`
- `/components/dashboard/stats-grid.tsx`
- `/components/dashboard/empty-state.tsx`

**Modify:**
- `/app/dashboard/page.tsx` (major update)
- `/types/index.ts` (add dashboard-specific types)

## 🚨 Edge Cases

- User leaves a squad → Update dashboard immediately (optimistic update)
- User's last squad for a project → Project should disappear from "My Projects"
- Project gets deleted → Remove from dashboard gracefully
- Large number of squads (pagination or "Load More")
- Loading states should show skeleton cards, not spinners
- Error states should show retry button

## 📝 Notes

- Use optimistic updates for better UX (update UI before API confirms)
- Consider adding "Recent Activity" feed in future iteration
- Add quick links to messaging (when messaging is implemented)
- Cache dashboard data for 30 seconds to reduce API calls
- Add pull-to-refresh on mobile

## 🎨 Design Consistency

- Match organic theme from landing page
- Use forest colors for text (dark on light backgrounds)
- Rounded corners (2xl)
- Organic shadows
- Smooth transitions on hover
- Consistent spacing and typography
