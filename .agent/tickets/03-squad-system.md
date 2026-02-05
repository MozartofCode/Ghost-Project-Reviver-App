# Ticket #3: Squad System - Join/Leave Squads

**Priority**: P1 (High - Core Feature)  
**Status**: Ready for Implementation  
**Estimated Effort**: 6-8 hours

## 📋 Overview
Implement a squad system where users can create, join, and leave squads for specific projects. One project can have multiple squads, and squads are NOT created automatically.

## 🎯 Requirements
- Users can create squads for any project
- One project can have multiple squads (e.g., "Frontend Team", "Backend Team", "Documentation Squad")
- Users can join existing squads
- Users can leave squads at any time
- Display "Join Squad" button on project detail pages
- Show squad members list
- Track squad creation date and member join dates

## 🗄️ Database Schema

### New Tables

#### `squads` table
```sql
CREATE TABLE squads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES repositories(id) ON DELETE CASCADE,
  name TEXT NOT NULL, -- e.g., "Frontend Revival Team"
  description TEXT,
  created_by UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  member_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  UNIQUE(project_id, name) -- One project can't have duplicate squad names
);

CREATE INDEX idx_squads_project ON squads(project_id);
CREATE INDEX idx_squads_created_by ON squads(created_by);
```

#### `squad_members` table
```sql
CREATE TABLE squad_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  squad_id UUID NOT NULL REFERENCES squads(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'member', -- 'creator', 'member', 'moderator'
  joined_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(squad_id, user_id) -- One user can't join same squad twice
);

CREATE INDEX idx_squad_members_squad ON squad_members(squad_id);
CREATE INDEX idx_squad_members_user ON squad_members(user_id);
```

### Database Triggers
```sql
-- Auto-update member count when someone joins/leaves
CREATE OR REPLACE FUNCTION update_squad_member_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE squads SET member_count = member_count + 1 WHERE id = NEW.squad_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE squads SET member_count = member_count - 1 WHERE id = OLD.squad_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER squad_member_count_trigger
AFTER INSERT OR DELETE ON squad_members
FOR EACH ROW EXECUTE FUNCTION update_squad_member_count();
```

## 🔧 Technical Approach

### Phase 1: Database Setup
- [ ] **Create**: `database/migrations/003_create_squads.sql`
  - Create `squads` table
  - Create `squad_members` table
  - Add triggers for member count
  
- [ ] Run migration on Supabase

### Phase 2: Backend API Development

#### Squad Management APIs
- [ ] **Create**: `/app/api/squads/route.ts`
  - `GET`: List all squads (with optional project_id filter)
  - `POST`: Create a new squad
    ```typescript
    // Request body
    {
      project_id: string,
      name: string,
      description?: string
    }
    // Response
    {
      squad: { id, name, description, member_count, ... },
      message: "Squad created successfully"
    }
    ```

- [ ] **Create**: `/app/api/squads/[squadId]/route.ts`
  - `GET`: Get squad details with members list
  - `PATCH`: Update squad details (only creator can update)
  - `DELETE`: Delete squad (only creator can delete)

#### Squad Membership APIs
- [ ] **Create**: `/app/api/squads/[squadId]/members/route.ts`
  - `GET`: List all members in a squad
    ```typescript
    // Response
    {
      members: [
        {
          id: string,
          user_id: string,
          role: string,
          joined_at: string,
          user: { name, avatar_url, github_username }
        }
      ]
    }
    ```
  - `POST`: Join a squad (authenticated user)
    ```typescript
    // Request body (optional)
    { role?: 'member' }
    // Response
    { message: "Successfully joined squad" }
    ```

- [ ] **Create**: `/app/api/squads/[squadId]/members/[userId]/route.ts`
  - `DELETE`: Leave squad (user can leave their own membership)

#### Project Squads API
- [ ] **Create**: `/app/api/repositories/[id]/squads/route.ts`
  - `GET`: Get all squads for a specific project
    ```typescript
    // Response
    {
      squads: [
        {
          id: string,
          name: string,
          description: string,
          member_count: number,
          is_user_member: boolean, // if current user is in this squad
          created_at: string
        }
      ]
    }
    ```

### Phase 3: Frontend Components

#### Squad List Component
- [ ] **Create**: `/components/squads/squad-list.tsx`
  - Displays all squads for a project
  - Shows member count, description
  - "Join" button for squads user is not in
  - "Leave" button for squads user is in
  - "Create Squad" button at top

#### Squad Card Component
- [ ] **Create**: `/components/squads/squad-card.tsx`
  ```typescript
  interface SquadCardProps {
    squad: Squad
    isUserMember: boolean
    onJoin: () => void
    onLeave: () => void
  }
  ```
  - Organic theme styling (cream background, forest colors)
  - Member avatars display (first 5 members)
  - Join/Leave button with loading states
  - Member count badge

#### Create Squad Modal
- [ ] **Create**: `/components/squads/create-squad-modal.tsx`
  - Modal dialog with form
  - Fields: Squad Name (required), Description (optional)
  - Validates squad name
  - Calls API to create squad
  - Auto-joins creator to the squad

#### Squad Members Modal
- [ ] **Create**: `/components/squads/squad-members-modal.tsx`
  - Shows full list of squad members
  - Displays avatar, name, username, role
  - Shows join date for each member
  - Click member to view their profile (future feature)

### Phase 4: Page Integration

- [ ] **Update**: `/app/repositories/[id]/page.tsx` (project detail page)
  - Add "Squads" section below project details
  - Display `<SquadList>` component
  - Show count: "X squads working on this project"
  - Load squads on page mount

- [ ] **Update**: `/app/dashboard/page.tsx`
  - Add "My Squads" section
  - List all squads user is member of
  - Link to project from each squad
  - Show member count and activity

### Phase 5: TypeScript Types
- [ ] **Update**: `/types/index.ts`
  ```typescript
  export interface Squad {
    id: string
    project_id: string
    name: string
    description: string | null
    created_by: string
    created_at: string
    updated_at: string
    member_count: number
    is_active: boolean
  }

  export interface SquadMember {
    id: string
    squad_id: string
    user_id: string
    role: 'creator' | 'member' | 'moderator'
    joined_at: string
    user?: {
      name: string
      avatar_url: string
      github_username: string
    }
  }

  export interface SquadWithMembership extends Squad {
    is_user_member: boolean
    members?: SquadMember[]
  }
  ```

## ✅ Verification Steps
1. **Navigate to a project detail page**:
   - See "Squads" section
   - Click "Create Squad" button
   - Fill in name and description, submit
   - New squad should appear in list

2. **Join a Squad**:
   - See "Join" button on a squad you're not in
   - Click "Join"
   - Button should change to "Leave"
   - Member count should increment

3. **Leave a Squad**:
   - Click "Leave" on a squad you're in
   - Confirm leave action
   - Squad should show "Join" button again
   - Member count should decrement

4. **Dashboard View**:
   - Navigate to `/dashboard`
   - See "My Squads" section
   - All joined squads should be listed
   - Click squad to navigate to project

5. **Database Check**:
   - Check `squads` table has new records
   - Check `squad_members` table has membership records
   - Verify `member_count` is accurate

## 📂 Files to Create/Modify

**Create:**
- `database/migrations/003_create_squads.sql`
- `/app/api/squads/route.ts`
- `/app/api/squads/[squadId]/route.ts`
- `/app/api/squads/[squadId]/members/route.ts`
- `/app/api/squads/[squadId]/members/[userId]/route.ts`
- `/app/api/repositories/[id]/squads/route.ts`
- `/components/squads/squad-list.tsx`
- `/components/squads/squad-card.tsx`
- `/components/squads/create-squad-modal.tsx`
- `/components/squads/squad-members-modal.tsx`

**Modify:**
- `/app/repositories/[id]/page.tsx`
- `/app/dashboard/page.tsx`
- `/types/index.ts`

## 🚨 Edge Cases
- User tries to join squad they're already in (handle gracefully)
- User tries to create squad with duplicate name for same project (show error)
- Squad creator tries to leave their own squad (allow, or transfer ownership?)
- Deleting a project should cascade delete squads
- Deleting a user should remove their squad memberships
- Show loading states during join/leave operations

## 📝 Notes
- Squad creator automatically becomes first member with role='creator'
- Consider adding squad capacity limits in future (max members)
- Future: Squad activity feed, squad-specific discussions
- Future: Transfer squad ownership feature
