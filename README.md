# DevDocs — Technical Tutorial Hub

A production-ready full-stack blog and tutorial site built with React, Vite, Express 5, Drizzle ORM, and PostgreSQL. Features Google AdSense, affiliate links, newsletter subscriptions, a password-protected admin panel, and comprehensive per-page SEO.

## Live Demo

> Deployed at [devdocs.replit.app](https://devdocs.replit.app)

## Features

### Content
- **Blog** — categorised articles with tag filtering and pagination
- **Tutorials** — step-by-step guides with difficulty levels (beginner / intermediate / advanced)
- **Resources** — curated affiliate links organised by category
- **Post detail** — sticky table of contents, reading progress bar, social share, prev/next navigation, feedback widget, and related posts

### Monetisation
- **Google AdSense** — auto-ads script in `<head>`, in-article ad unit on every post
- **Affiliate links** — per-post, managed via admin panel, disclosed in footer

### SEO
- Dynamic `<title>`, meta description, canonical URL, Open Graph, and Twitter Card per route
- JSON-LD structured data: `WebSite`, `Organization`, `BreadcrumbList`, `ItemList`, `TechArticle`, `BlogPosting`
- Auto-generated sitemap at `/api/sitemap.xml`
- RSS feed at `/api/rss.xml`
- `robots.txt` at `/api/robots.txt` with AI crawler allowlists

### Newsletter
- Email collection with duplicate detection
- Admin panel to view and delete subscribers

### Admin Panel (`/admin`)
- Password-protected dashboard
- Post creation / editing / deletion with rich HTML content
- Subscriber management

### Developer Experience
- pnpm workspace monorepo
- Contract-first OpenAPI spec → generated React Query hooks + Zod schemas
- TypeScript everywhere
- Tailwind CSS v4 with dark mode

## Tech Stack

| Layer      | Technology                                 |
| ---------- | ------------------------------------------ |
| Frontend   | React 19, Vite, Tailwind CSS v4, Wouter    |
| API        | Express 5, Pino logger, Zod validation     |
| Database   | PostgreSQL + Drizzle ORM                   |
| API Client | Orval-generated React Query hooks          |
| Auth       | Bearer token (admin), sessionStorage       |
| Hosting    | Replit (dev + production)                  |

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm 9+ (`npm install -g pnpm`)
- PostgreSQL 15+

### Local setup

```bash
# Clone
git clone https://github.com/vikash-kushwah/Content-Hub.git
cd Content-Hub

# Install dependencies
pnpm install

# Set up environment
cp .env.example .env
# Edit .env — fill in DATABASE_URL, ADMIN_PASSWORD, SESSION_SECRET

# Run database migrations
pnpm --filter @workspace/db run migrate

# Seed initial content (optional)
pnpm --filter @workspace/db run seed

# Start API (terminal 1)
pnpm --filter @workspace/api-server run dev

# Start frontend (terminal 2)
pnpm --filter @workspace/tutorial-hub run dev
```

Frontend: `http://localhost:5173` | API: `http://localhost:8080/api`

## Project Structure

```
├── artifacts/
│   ├── api-server/           # Express 5 REST API
│   │   └── src/routes/       # Route handlers
│   └── tutorial-hub/         # React + Vite SPA
│       └── src/
│           ├── components/   # Shared UI components
│           ├── lib/          # seo.tsx, utils.ts, auth.ts
│           └── pages/        # Route-level components
├── lib/
│   ├── api-spec/             # openapi.yaml (source of truth)
│   ├── api-client-react/     # Generated React Query hooks
│   ├── api-zod/              # Generated Zod schemas
│   └── db/                   # Drizzle schema + migrations
├── scripts/                  # Shared utility scripts
├── .env.example              # Environment variable template
├── CHANGELOG.md
├── CONTRIBUTING.md
├── LICENSE
└── SECURITY.md
```

## Environment Variables

See [`.env.example`](.env.example) for the full list. Required variables:

| Variable          | Description                                    |
| ----------------- | ---------------------------------------------- |
| `DATABASE_URL`    | PostgreSQL connection string                   |
| `ADMIN_PASSWORD`  | Admin panel password                           |
| `SESSION_SECRET`  | Secret for signing session tokens              |
| `SITE_URL`        | Canonical origin (optional, for sitemap / RSS) |

## API Reference

| Method   | Path                            | Auth  | Description              |
| -------- | ------------------------------- | ----- | ------------------------ |
| GET      | `/api/posts`                    | —     | List posts (filterable)  |
| POST     | `/api/posts`                    | Admin | Create post              |
| GET      | `/api/posts/featured`           | —     | Featured posts           |
| GET      | `/api/posts/recent`             | —     | Recent posts             |
| GET      | `/api/posts/stats`              | —     | Content statistics       |
| GET      | `/api/posts/:slug`              | —     | Single post              |
| GET      | `/api/posts/:slug/related`      | —     | Related posts            |
| GET      | `/api/posts/:slug/navigation`   | —     | Prev / next post         |
| PUT      | `/api/posts/:slug/update`       | Admin | Update post              |
| DELETE   | `/api/posts/:slug/delete`       | Admin | Delete post              |
| POST     | `/api/newsletter/subscribe`     | —     | Subscribe to newsletter  |
| GET      | `/api/newsletter/subscribers`   | Admin | List subscribers         |
| DELETE   | `/api/newsletter/subscribers/:id` | Admin | Delete subscriber     |
| POST     | `/api/feedback`                 | —     | Submit post feedback     |
| GET      | `/api/sitemap.xml`              | —     | XML sitemap              |
| GET      | `/api/rss.xml`                  | —     | RSS feed                 |
| GET      | `/api/robots.txt`               | —     | Robots directive         |

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

## Security

See [SECURITY.md](SECURITY.md).

## License

MIT — see [LICENSE](LICENSE).
