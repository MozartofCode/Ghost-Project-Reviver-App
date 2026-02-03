# Technical Requirements: Project Phoenix

## 1. System Objectives
- Scrape and analyze GitHub repositories for "inactivity signals."
- Provide a "Maintenance Difficulty Score" (MDS) using static analysis.
- Facilitate secure OAuth-based handovers.

## 2. Tech Stack
- **Frontend:** Next.js 15 (App Router), Tailwind CSS, Shadcn/UI.
- **Backend:** Node.js (FastAPI or NestJS) with a background worker.
- **Database:** PostgreSQL (Supabase) for relational data & persistence.
- **Cache:** Redis for GitHub API response caching.
- **Primary API:** GitHub GraphQL API v4.

## 3. Core Logic: The "Maintenance Difficulty Score" (MDS)
The system must calculate complexity based on:
1. **Dependency Age:** Ratio of current versions to latest available.
2. **Issue Density:** Number of open issues relative to the total commit count.
3. **Cyclomatic Complexity:** Average nesting depth of the code (calculated via AST parser).
4. **Documentation Score:** Presence of README, CONTRIBUTING.md, and code comment density.

## 4. Performance & Rate Limiting
- Implement a **Job Queue (BullMQ)** to handle the "Complexity Scraper" tasks without hitting GitHub's secondary rate limits.
- Use **Redis** to store scraped data for 24 hours to prevent redundant API calls.