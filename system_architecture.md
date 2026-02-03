---

### 4. System Architecture (`system_architecture.md`)
```markdown
# System Architecture Diagram

Below is the high-level flow of the Project Phoenix platform.

```mermaid
graph TD
    User((User/Developer)) -->|GitHub OAuth| Auth[Auth Service]
    Auth -->|Stores Session| DB[(PostgreSQL)]
    
    User -->|Views Repos| WebApp[Next.js Frontend]
    WebApp -->|Requests Data| API[API Gateway/Backend]
    
    API -->|Fetch Metadata| GH_API[GitHub GraphQL API]
    API -->|Read/Write| DB
    
    subgraph Analysis Engine
        API -->|Queue Job| Worker[Background Worker]
        Worker -->|Clones/Analyzes Code| Scraper[Complexity Scraper]
        Scraper -->|Calculates MDS| DB
    end
    
    subgraph Notifications
        DB -->|Trigger| Email[Postmark/SendGrid]
        Email -->|Notify Owner| User
    end