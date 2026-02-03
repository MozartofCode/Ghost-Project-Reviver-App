# 🔥 Project Phoenix - Ghost Project Reviver

> **Revive the code that matters**

Project Phoenix is a social platform for discovering abandoned open-source repositories, forming revival squads, and breathing new life into ghost projects.

## ✨ Features

- 🔍 **Smart Discovery** - Browse abandoned repositories with maintenance difficulty scores
- 👥 **Revival Squads** - Form teams to tackle projects together
- 📊 **Maintenance Scores** - Know what you're getting into with detailed difficulty metrics
- 🎯 **GitHub Integration** - Seamless authentication and repository data sync
- 🎨 **Premium UI** - Beautiful glassmorphism design with smooth animations

## 🚀 Getting Started

### Prerequisites

- Node.js 20+ (LTS recommended)
- A Supabase account
- A GitHub account

### 1. Clone the Repository

```bash
git clone https://github.com/MozartofCode/Ghost-Project-Reviver-App.git
cd Ghost-Project-Reviver-App
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Database

Follow the detailed instructions in [`database/README.md`](./database/README.md):

1. Create a Supabase project
2. Run the database schema from `database/schema.sql`
3. Configure GitHub OAuth in Supabase
4. Get your credentials

### 4. Configure Environment Variables

Create a `.env.local` file in the root directory:

```bash
cp .env.local.example .env.local
```

Fill in your actual values:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# GitHub OAuth (configured in Supabase)
GITHUB_CLIENT_ID=your-github-oauth-client-id
GITHUB_CLIENT_SECRET=your-github-oauth-client-secret

# GitHub API
GITHUB_PERSONAL_ACCESS_TOKEN=your-github-personal-access-token

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
├── app/                      # Next.js App Router
│   ├── explore/             # Browse repositories
│   ├── repositories/[id]/   # Repository detail pages
│   ├── dashboard/           # User dashboard (TBD)
│   └── auth/                # Authentication (TBD)
├── components/              # React components
│   ├── ui/                  # Reusable UI components
│   └── repository/          # Repository-specific components
├── lib/                     # Utilities and clients
│   ├── supabase/           # Supabase client setup
│   ├── github/             # GitHub API client
│   └── utils.ts            # Helper functions
├── types/                   # TypeScript type definitions
├── database/                # Database schema and docs
└── public/                  # Static assets
```

## 🛠 Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Database:** Supabase (PostgreSQL)
- **Authentication:** GitHub OAuth via Supabase Auth
- **External APIs:** GitHub REST API

## 🎨 Design System

Project Phoenix uses a custom design system with:

- **Primary Color:** Indigo (#6366f1)
- **Accent Color:** Amber (#f59e0b)
- **Background:** Deep Navy (#0a0e27)
- **Effects:** Glassmorphism, gradients, smooth animations

See [`design_system.md`](./design_system.md) for complete specifications.

## 📝 MVP Status

This is currently an **MVP (Minimum Viable Product)** with:

✅ Landing page  
✅ Repository browsing with filters  
✅ Repository detail pages  
✅ Basic UI components  
✅ Database schema  
⏳ GitHub authentication (in progress)  
⏳ Squad functionality (in progress)  
⏳ User dashboard (in progress)  

See [`MVP_PROGRESS.md`](./MVP_PROGRESS.md) for detailed progress tracking.

## 🧪 Development

### Run Tests

```bash
npm run test          # Run unit tests (when added)
npm run test:e2e      # Run E2E tests (when added)
```

### Build for Production

```bash
npm run build
npm run start
```

### Lint Code

```bash
npm run lint
```

## 📚 Documentation

- [`database/README.md`](./database/README.md) - Database setup guide
- [`design_system.md`](./design_system.md) - UI/UX specifications
- [`MVP_PROGRESS.md`](./MVP_PROGRESS.md) - Development progress
- [`business_requirements.md`](./business_requirements.md) - Business requirements
- [`technical_requirements.md`](./technical_requirements.md) - Technical specs

## 🤝 Contributing

This is currently a solo project in active development. Contributions will be welcome once the MVP is complete!

## 📄 License

MIT License - See LICENSE file for details

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Powered by [Supabase](https://supabase.com/)
- Icons by [Lucide](https://lucide.dev/)
- Typography by [Google Fonts (Inter)](https://fonts.google.com/specimen/Inter)

---

**Status:** 🚧 MVP in Development  
**Last Updated:** February 2026

Made with ❤️ for the open-source community
