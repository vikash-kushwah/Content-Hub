# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Previous / Next post navigation on post detail pages
- Inline newsletter CTA between article content and recommended tools
- AdSense in-article ad unit on post detail pages
- `/posts/:slug/navigation` API endpoint returning adjacent posts by date

## [1.2.0] — 2025-05-03

### Added
- Comprehensive per-page SEO with dynamic `<title>`, meta description, canonical URL, OG tags, and Twitter Card
- JSON-LD structured data: `WebSite`, `Organization`, `BreadcrumbList`, `ItemList`, `TechArticle`, `BlogPosting`
- `noindex` on 404 and missing-post error pages
- Sitemap at `/api/sitemap.xml` (auto-includes all posts)
- RSS feed at `/api/rss.xml`
- `robots.txt` at `/api/robots.txt` with AI crawler allowlists (GPTBot, Google-Extended, ClaudeBot, CCBot)
- Global Cmd/Ctrl+K search modal
- Cookie consent banner (GDPR / AdSense compliant)
- Scroll-to-top button
- Social share buttons (Twitter, LinkedIn, Copy link) on every post
- About page and Privacy Policy page (required for AdSense approval)
- Branded 404 page

### Security
- Newsletter subscriber listing and deletion now require admin authentication

## [1.1.0] — 2025-04-15

### Added
- Admin panel (`/admin`) with password protection
- Dashboard, post list, post editor, and subscriber management
- Post feedback widget ("Was this helpful?")
- Related posts section on post detail pages
- Reading progress bar on post detail pages
- Sticky table of contents on post detail pages
- Affiliate links section per post

## [1.0.0] — 2025-04-02

### Added
- Initial project setup with pnpm monorepo
- React + Vite + Tailwind CSS v4 frontend
- Express 5 REST API with Drizzle ORM and PostgreSQL
- Contract-first OpenAPI spec with generated React Query hooks and Zod schemas
- Pages: Home, Blog, Tutorials, Resources, Newsletter
- Post detail page
- Google AdSense integration (publisher: ca-pub-6253053806009925)
- Database seeding with 6 initial posts
