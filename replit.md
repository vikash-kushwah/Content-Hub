# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Contains a Technical Tutorial Hub website (DevDocs) — a full-stack content site for publishing blogs, tutorials, and how-to guides with monetization features.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)
- **Frontend**: React + Vite + Tailwind CSS v4

## Artifacts

### tutorial-hub (Preview Path: /)
The main Technical Tutorial Hub website "DevDocs".
- Home page with hero, featured posts, recent posts, stats, and newsletter signup
- Blog page with category/tag filtering and pagination
- Tutorials page with difficulty filtering
- Resources page (affiliate links by category)
- Newsletter page
- Post detail pages with sticky TOC, feedback widget, social share, and affiliate links
- About + Privacy Policy pages (required for AdSense approval)
- Cmd/Ctrl+K global search modal
- Cookie consent banner (GDPR / AdSense)
- Scroll-to-top button, dark mode toggle
- 404 page with `noindex`
- Admin panel at `/admin` (password protected via ADMIN_PASSWORD secret)

### SEO Infrastructure
Per-page SEO via `src/lib/seo.tsx`:
- Dynamic `<title>`, meta description, canonical URL, OG, and Twitter Card tags per route
- JSON-LD structured data: `WebSite` + `Organization` (Home), `BreadcrumbList` (all), `ItemList` (Blog/Tutorials), `TechArticle`/`BlogPosting` (Posts)
- `noindex` on 404 + missing posts
- Sitemap at `/api/sitemap.xml` includes all static pages + every post (auto-updated)
- RSS feed at `/api/rss.xml` (20 most recent posts)
- robots.txt at `/api/robots.txt` allows GPTBot, Google-Extended, ClaudeBot, CCBot
- AdSense script loaded in index.html (publisher: ca-pub-6253053806009925)

### api-server (Preview Path: /api)
Express 5 backend API serving:
- `/api/posts` — list, filter, paginate posts
- `/api/posts/featured` — featured posts for homepage
- `/api/posts/recent` — recent posts
- `/api/posts/stats` — content statistics
- `/api/posts/:slug` — single post with TOC and affiliate links
- `/api/posts/:slug/related` — related posts
- `/api/newsletter/subscribe` — email subscription
- `/api/feedback` — post helpfulness voting

## Database Schema (PostgreSQL)

Tables:
- `posts` — blog posts, tutorials, how-tos with metadata
- `post_toc` — table of contents entries per post
- `affiliate_links` — affiliate links associated with posts
- `newsletter_subscribers` — email subscribers

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

## Adding New Blog Posts

To add a new post, insert a row into the `posts` table via the API or direct DB insert. The post content is stored as HTML string in the `content` column. Add associated TOC entries in `post_toc` and affiliate links in `affiliate_links`.

## Monetization

- **Affiliate Links**: Stored per-post in `affiliate_links` table, shown at bottom of post detail
- **Resources Page**: Static curated list of recommended tools with affiliate URLs
- **Newsletter**: Subscriber collection via `/api/newsletter/subscribe`

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.
