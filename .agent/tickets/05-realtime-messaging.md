# Ticket #5: Real-time Squad Messaging Platform

**Priority**: P2 (Medium - Most Complex)  
**Status**: Ready for Implementation  
**Estimated Effort**: 12-16 hours

## 📋 Overview
Implement a Slack-style threaded messaging platform for squad communication. Users can see all squads they're part of, select a squad, and participate in real-time conversations with threaded replies.

## 🎯 Requirements
- Slack-style threaded messaging (main messages + thread replies)
- Real-time updates using Supabase Realtime
- Users can message only in squads they're members of
- Message features: Text, code blocks, links, @mentions (future)
- Thread features: Reply, view thread, collapse/expand
- Unread message indicators
- Emoji reactions (future enhancement)
- File/image sharing (future enhancement)

## 🗄️ Database Schema

### New Tables

#### `messages` table
```sql
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  squad_id UUID NOT NULL REFERENCES squads(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id),
  content TEXT NOT NULL,
  parent_message_id UUID REFERENCES messages(id) ON DELETE CASCADE, -- null = main message, not null = thread reply
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  is_edited BOOLEAN DEFAULT false,
  is_deleted BOOLEAN DEFAULT false,
  reaction_count INTEGER DEFAULT 0,
  reply_count INTEGER DEFAULT 0 -- only for main messages
);

CREATE INDEX idx_messages_squad ON messages(squad_id, created_at DESC);
CREATE INDEX idx_messages_user ON messages(user_id);
CREATE INDEX idx_messages_parent ON messages(parent_message_id);
CREATE INDEX idx_messages_squad_main ON messages(squad_id) WHERE parent_message_id IS NULL;
```

#### `message_reactions` table (future)
```sql
CREATE TABLE message_reactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id UUID NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id),
  emoji TEXT NOT NULL, -- e.g., '👍', '❤️', '🚀'
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(message_id, user_id, emoji)
);

CREATE INDEX idx_reactions_message ON message_reactions(message_id);
```

#### `message_read_status` table
```sql
CREATE TABLE message_read_status (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  squad_id UUID NOT NULL REFERENCES squads(id) ON DELETE CASCADE,
  last_read_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, squad_id)
);

CREATE INDEX idx_read_status_user_squad ON message_read_status(user_id, squad_id);
```

### Database Triggers
```sql
-- Auto-update reply count when thread message is added/deleted
CREATE OR REPLACE FUNCTION update_message_reply_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' AND NEW.parent_message_id IS NOT NULL THEN
    UPDATE messages SET reply_count = reply_count + 1 WHERE id = NEW.parent_message_id;
  ELSIF TG_OP = 'DELETE' AND OLD.parent_message_id IS NOT NULL THEN
    UPDATE messages SET reply_count = reply_count - 1 WHERE id = OLD.parent_message_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER message_reply_count_trigger
AFTER INSERT OR DELETE ON messages
FOR EACH ROW EXECUTE FUNCTION update_message_reply_count();
```

## 🔧 Technical Approach

### Phase 1: Database Setup
- [ ] **Create**: `database/migrations/004_create_messaging.sql`
  - Create `messages` table
  - Create `message_read_status` table
  - Add triggers for reply count
  - Enable Realtime on Supabase for `messages` table

- [ ] **Configure Supabase Realtime**:
  - Enable Realtime replication for `messages` table
  - Set up RLS policies for message access
  - Configure message retention policies (optional)

### Phase 2: Backend API Development

#### Message APIs
- [ ] **Create**: `/app/api/squads/[squadId]/messages/route.ts`
  - `GET`: Fetch main messages (no parent) for a squad
    ```typescript
    // Query params: ?limit=50&before=timestamp
    // Response
    {
      messages: [
        {
          id: string,
          content: string,
          user_id: string,
          user: { name, avatar_url, github_username },
          created_at: string,
          updated_at: string,
          is_edited: boolean,
          reply_count: number
        }
      ],
      has_more: boolean
    }
    ```
  - `POST`: Send a new main message
    ```typescript
    // Request body
    { content: string }
    // Response
    { message: {...}, message: "Message sent" }
    ```

- [ ] **Create**: `/app/api/messages/[messageId]/route.ts`
  - `GET`: Get single message details
  - `PATCH`: Edit message (only by author, within 15 min)
  - `DELETE`: Delete message (soft delete, only by author)

- [ ] **Create**: `/app/api/messages/[messageId]/replies/route.ts`
  - `GET`: Fetch thread replies for a message
    ```typescript
    // Response
    {
      replies: [
        {
          id: string,
          content: string,
          user_id: string,
          user: { name, avatar_url },
          created_at: string,
          is_edited: boolean
        }
      ]
    }
    ```
  - `POST`: Reply to a thread
    ```typescript
    // Request body
    { content: string }
    ```

#### Read Status APIs
- [ ] **Create**: `/app/api/squads/[squadId]/read-status/route.ts`
  - `POST`: Mark squad as read (update `last_read_at`)
  - `GET`: Get unread count for squad

### Phase 3: Real-time Setup

- [ ] **Create**: `/lib/realtime/messaging.ts`
  ```typescript
  import { createClient } from '@/lib/supabase/client'

  export function subscribeToSquadMessages(
    squadId: string,
    onMessage: (message: Message) => void,
    onUpdate: (message: Message) => void,
    onDelete: (messageId: string) => void
  ) {
    const supabase = createClient()
    
    const channel = supabase
      .channel(`squad:${squadId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `squad_id=eq.${squadId}`
        },
        (payload) => onMessage(payload.new as Message)
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'messages',
          filter: `squad_id=eq.${squadId}`
        },
        (payload) => onUpdate(payload.new as Message)
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'messages',
          filter: `squad_id=eq.${squadId}`
        },
        (payload) => onDelete(payload.old.id)
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }
  ```

### Phase 4: Frontend Components

#### Main Messaging Layout
- [ ] **Create**: `/app/messages/page.tsx`
  - 3-column layout (or 2-column on mobile):
    1. **Squad sidebar** (left): List of all user's squads
    2. **Message feed** (center): Main messages for selected squad
    3. **Thread panel** (right): Thread replies (when thread selected)
  
  **Layout:**
  ```
  ┌─────────────┬──────────────────┬─────────────┐
  │             │                  │             │
  │  Squads     │  Main Messages   │  Thread     │
  │  List       │  Feed            │  Replies    │
  │             │                  │             │
  │  Squad 1    │  [Message]       │  Re: Msg    │
  │  Squad 2 ●  │  [Message]       │  [Reply]    │
  │  Squad 3    │  [Message]       │  [Reply]    │
  │             │  [Message]       │  [Reply]    │
  │             │  [Input Box]     │  [Input]    │
  └─────────────┴──────────────────┴─────────────┘
  ```

#### Squad Sidebar Component
- [ ] **Create**: `/components/messaging/squad-sidebar.tsx`
  - List all user's squads
  - Show unread indicators (dot or count)
  - Highlight selected squad
  - Show parent project name for each squad
  - Search/filter squads
  - Organic theme styling

#### Message Feed Component
- [ ] **Create**: `/components/messaging/message-feed.tsx`
  - Display main messages in chronological order
  - Infinite scroll (load more on scroll up)
  - Auto-scroll to bottom on new message
  - Loading skeleton for initial load
  - Empty state: "No messages yet. Start the conversation!"

#### Message Component
- [ ] **Create**: `/components/messaging/message.tsx`
  ```typescript
  interface MessageProps {
    message: Message
    onThreadClick: () => void
    onReply: () => void
  }
  ```
  - User avatar (left)
  - User name, timestamp (top)
  - Message content (markdown support)
  - Reply count badge (if > 0)
  - "View thread" or "Reply" button
  - Hover actions: Edit (if author), Delete (if author)
  - Edit mode (inline editing)

#### Thread Panel Component
- [ ] **Create**: `/components/messaging/thread-panel.tsx`
  - Displays parent message at top
  - Shows all thread replies below
  - Reply input at bottom
  - Close button to hide thread
  - Auto-scroll to bottom on new reply

#### Message Input Component
- [ ] **Create**: `/components/messaging/message-input.tsx`
  - Multi-line text input (textarea)
  - Auto-expand as user types
  - Send button (or Cmd/Ctrl+Enter)
  - Character limit indicator (optional)
  - Markdown formatting toolbar (optional)
  - @mention autocomplete (future)
  - emoji picker (future)

### Phase 5: Real-time Integration

- [ ] **Integrate Realtime** in message feed:
  ```typescript
  useEffect(() => {
    if (!selectedSquadId) return

    const unsubscribe = subscribeToSquadMessages(
      selectedSquadId,
      (newMessage) => {
        // Add to messages list
        setMessages(prev => [...prev, newMessage])
        // Auto-scroll to bottom
        scrollToBottom()
      },
      (updatedMessage) => {
        // Update message in list
        setMessages(prev => prev.map(m => 
          m.id === updatedMessage.id ? updatedMessage : m
        ))
      },
      (deletedId) => {
        // Remove message from list
        setMessages(prev => prev.filter(m => m.id !== deletedId))
      }
    )

    return unsubscribe
  }, [selectedSquadId])
  ```

### Phase 6: Features & Polish

- [ ] **Markdown support**: Use library like `react-markdown` for rendering
- [ ] **Code blocks**: Syntax highlighting with `highlight.js` or `prism`
- [ ] **Link previews**: Auto-detect and unfurl links (future)
- [ ] **Typing indicators**: "User is typing..." (future)
- [ ] **Message timestamps**: Relative times ("2 min ago") with tooltip
- [ ] **Read receipts**: Mark messages as read when scrolled into view
- [ ] **Unread indicators**: Badge on squad sidebar, count in header

### Phase 7: Mobile Responsiveness

- [ ] **Mobile layout**:
  - Single column view
  - Show squad list by default
  - When squad selected, show message feed (hide squad list)
  - When thread selected, show thread panel (hide message feed)
  - Back buttons to navigate between views

## ✅ Verification Steps

1. **Navigate to `/messages`**:
   - See list of user's squads in sidebar
   - Select a squad
   - See message feed for that squad

2. **Send a message**:
   - Type in input box
   - Click send or press Cmd+Enter
   - Message appears in feed immediately
   - Message should appear for other users in real-time

3. **Thread conversation**:
   - Hover over message, click "Reply" or "View thread"
   - Thread panel opens on right
   - Parent message shown at top
   - Type reply in thread input
   - Reply appears in thread immediately
   - Reply count updates on parent message

4. **Edit message**:
   - Hover over own message
   - Click edit icon
   - Edit content, save
   - Message updates with "edited" indicator

5. **Delete message**:
   - Hover over own message
   - Click delete icon
   - Confirm deletion
   - Message removed or shows "[deleted]"

6. **Real-time sync**:
   - Open app in two browsers (different users)
   - Send message from one
   - Should appear in other instantly
   - Test thread replies sync

7. **Unread indicators**:
   - Navigate away from squad
   - Have another user send message
   - Return to messages page
   - Squad should have unread indicator
   - Indicator clears when squad is viewed

## 📂 Files to Create/Modify

**Create:**
- `database/migrations/004_create_messaging.sql`
- `/app/messages/page.tsx`
- `/app/api/squads/[squadId]/messages/route.ts`
- `/app/api/messages/[messageId]/route.ts`
- `/app/api/messages/[messageId]/replies/route.ts`
- `/app/api/squads/[squadId]/read-status/route.ts`
- `/lib/realtime/messaging.ts`
- `/components/messaging/squad-sidebar.tsx`
- `/components/messaging/message-feed.tsx`
- `/components/messaging/message.tsx`
- `/components/messaging/thread-panel.tsx`
- `/components/messaging/message-input.tsx`

**Modify:**
- `/app/dashboard/page.tsx` (add "Messages" link)
- `/app/layout.tsx` (add messages link to nav)
- `/types/index.ts` (add Message, Thread types)

## 🚨 Edge Cases

- User sends empty message → Prevent send
- Very long messages → Truncate with "Show more" button
- Message flood → Rate limiting on API
- Lost connection → Show offline indicator, queue messages
- Deleted user → Show "[deleted user]" for their messages
- Deleted squad → Archive messages or cascade delete
- Thread with 100+ replies → Paginate thread replies
- Concurrent edits → Last write wins (show conflict warning)

## 📝 Notes

- Message retention: Keep all messages unless explicitly deleted
- Consider search functionality (search messages within squad)
- Future: Pinned messages, message reactions, file uploads
- Future: Desktop notifications for new messages
- Future: Voice/video calls integration
- Accessibility: Keyboard navigation, screen reader support
- Performance: Virtual scrolling for large message lists

## 🎨 Design Consistency

- Match organic theme throughout
- Squad sidebar: Light cream background, dark forest text
- Message feed: White background for messages alternating with subtle cream
- Thread panel: Slightly darker background to distinguish from main feed
- Message bubbles: Rounded corners, organic shadows
- User avatars: Circular, with border
- Input boxes: Forest border on focus
- Buttons: Forest green primary, mint secondary

## 🔒 Security & Privacy

- RLS policies: Users can only read messages from squads they're in
- Rate limiting: Max 10 messages per minute per user
- Content moderation: Profanity filter (future)
- Report message functionality (future)
- Block user functionality (future)
