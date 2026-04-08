# DevDocs — Complete Site Guide

> Read this guide whenever you want to add content, understand how the site works, or troubleshoot something. Keep it open while you work.

---

## Table of Contents

1. [What is DevDocs?](#1-what-is-devdocs)
2. [Site Structure & Pages](#2-site-structure--pages)
3. [Admin Panel — How to Access & Use It](#3-admin-panel--how-to-access--use-it)
4. [How to Add a New Blog Post / Tutorial / How-To](#4-how-to-add-a-new-blog-post--tutorial--how-to)
5. [How Content is Stored (Database)](#5-how-content-is-stored-database)
6. [Monetization — AdSense & Affiliate Links](#6-monetization--adsense--affiliate-links)
7. [Newsletter & Subscribers](#7-newsletter--subscribers)
8. [SEO & Google Indexing](#8-seo--google-indexing)
9. [Changing Your Admin Password](#9-changing-your-admin-password)
10. [Tech Stack Overview](#10-tech-stack-overview)
11. [Codebase File Map](#11-codebase-file-map)
12. [Common Tasks Cheat Sheet](#12-common-tasks-cheat-sheet)

---

## 1. What is DevDocs?

DevDocs is your personal technical content site. It lets you:

- **Publish blog posts, tutorials, and how-to guides** for developers
- **Earn money** through Google AdSense (display ads) and affiliate links per post
- **Grow an audience** with a newsletter subscription system
- **Track engagement** with helpful/not-helpful votes per post

The site is fully built — you just need to log in to the admin panel and start writing.

---

## 2. Site Structure & Pages

| Page | URL | Description |
|------|-----|-------------|
| Home | `/` | Hero, stats, featured posts, recent posts, newsletter CTA |
| Blog | `/blog` | All posts with category & tag filters |
| Tutorials | `/tutorials` | Tutorials filtered by difficulty |
| Resources | `/resources` | Curated affiliate tool recommendations |
| Newsletter | `/newsletter` | Email signup page |
| Post Detail | `/posts/:slug` | Full post with sticky TOC, reading progress, feedback |
| **Admin** | `/admin` | Password-protected admin panel |

---

## 3. Admin Panel — How to Access & Use It

### Accessing the Admin Panel

1. Go to `/admin` on your site
2. Enter the password you set in the `ADMIN_PASSWORD` secret
3. Your session is remembered for the browser tab (closes when you close the tab)
4. Click **Sign Out** in the left sidebar to log out manually

> **Security note:** The `/admin` route is fully blocked on the frontend — nobody can access it without the correct password. All write operations (create/edit/delete posts) also require the token on the backend API, so even direct API calls are blocked.

### Dashboard (`/admin`)

Shows at a glance:
- Total posts, subscribers, blog posts, tutorials
- 5 most recent posts with quick edit links
- Top tags
- Latest subscribers
- Quick actions: New Post, View Subscribers

### Posts (`/admin/posts`)

- View all posts in a sortable table
- Filter by category (All / Blog / Tutorial / How-to)
- See title, slug, category, tags, publish date
- Click the **pencil icon** to edit
- Click the **trash icon** to delete (requires confirmation)
- Click **View** to preview the post on the public site

### New Post (`/admin/posts/new`)

Fill in the form fields (see section 4 below for full details).

### Edit Post (`/admin/posts/:slug/edit`)

Same form as New Post, pre-filled with existing content. Note: the slug (URL) cannot be changed after creation.

### Subscribers (`/admin/subscribers`)

- See all email subscribers with their name and signup date
- Export as CSV (click the Export button — downloads a `.csv` file)
- Delete individual subscribers with confirmation

---

## 4. How to Add a New Blog Post / Tutorial / How-To

Go to `/admin/posts/new`. Here is what each field means:

### Required Fields

| Field | Description |
|-------|-------------|
| **Title** | The post headline. The URL slug is auto-generated from this. |
| **Excerpt** | 1–2 sentence summary shown in post cards and search results. Keep it under 160 characters. |
| **Content (HTML)** | The full post body written as HTML (see below). |
| **Category** | `Blog`, `Tutorial`, or `How-to` — this determines which section of the site it appears in. |

### Optional Fields

| Field | Description |
|-------|-------------|
| **URL Slug** | Auto-generated from the title. Only lowercase letters, numbers, hyphens. Cannot be changed after creation. |
| **Tags** | Comma-separated: `react, typescript, api`. Used for filtering and related posts. |
| **Reading Time** | In minutes. Click "Auto-calc reading time" to estimate from word count. |
| **Featured post** | If checked, the post appears on the homepage hero section. |
| **Difficulty** | Beginner / Intermediate / Advanced — shown on tutorials. |
| **Cover Image URL** | Paste a URL to a cover image (e.g. from Unsplash). |
| **Series Name** | Group related posts (e.g. "Node.js Fundamentals"). |
| **Series Order** | Which part in the series (1, 2, 3…). |

### Writing Content as HTML

Content is stored as HTML. You write it in the text area. Here are the most useful tags:

```html
<h2 id="intro">Introduction</h2>
<p>Your paragraph text here.</p>

<h3 id="step-1">Step 1: Install Node.js</h3>
<p>Go to <a href="https://nodejs.org">nodejs.org</a> and download the LTS version.</p>

<pre><code>npm install express
npm install typescript --save-dev</code></pre>

<ul>
  <li>First item</li>
  <li>Second item</li>
</ul>

<blockquote>
  <p>This is a tip or note.</p>
</blockquote>

<img src="https://example.com/screenshot.png" alt="Screenshot of the terminal" />
```

**Important for Table of Contents:** Add an `id` attribute to your `<h2>` and `<h3>` tags. The sticky TOC on the post detail page is built from these IDs. Example: `<h2 id="installation">Installation</h2>`.

Use the **Preview Content** button to see a rendered preview of your HTML before saving.

### Publishing

Click **Publish Post** when done. The post immediately appears on the public site.

---

## 5. How Content is Stored (Database)

The site uses a PostgreSQL database with these main tables:

| Table | What it stores |
|-------|----------------|
| `posts` | All post content (title, excerpt, HTML content, category, tags, etc.) |
| `post_toc` | Table of contents entries per post |
| `affiliate_links` | Tool recommendations shown at the bottom of each post |
| `newsletter_subscribers` | Email addresses of subscribers |

> **You don't need to touch the database directly.** The admin panel handles everything. But if you ever want to add affiliate links to a post, that's done via the database for now (see section 6).

---

## 6. Monetization — AdSense & Affiliate Links

### Google AdSense

Your AdSense publisher ID (`ca-pub-6253053806009925`) is already added to the site's `<head>`. AdSense auto-ads will automatically place ads across the site once Google approves your site.

**What you need to do:**
1. Log into your [Google AdSense account](https://adsense.google.com)
2. Add your site's domain (the `.replit.app` URL or your custom domain)
3. Wait for Google to review and approve it (usually 1–3 days)
4. Once approved, ads appear automatically across all pages

**Note:** Ads will NOT show on `/admin` pages or in the preview iframe on Replit. They will show on your deployed live site.

### Affiliate Links Per Post

Each post can show a "Recommended Tools" section at the bottom with affiliate links. These are stored in the `affiliate_links` table in the database.

To add affiliate links to a post, run this SQL in the Replit database tool:

```sql
-- First, find the post ID
SELECT id, slug, title FROM posts WHERE slug = 'your-post-slug';

-- Then insert an affiliate link (replace 1 with the actual post ID)
INSERT INTO affiliate_links (post_id, label, url, description)
VALUES (
  1,
  'DigitalOcean',
  'https://m.do.co/c/YOUR_REFERRAL_CODE',
  'Get $200 in cloud credits free. Best VPS for developers.'
);
```

You can add multiple affiliate links per post. They appear in a card at the bottom of the post with proper `rel="sponsored"` tags for SEO compliance.

### Resources Page

The Resources page (`/resources`) shows curated tool categories with affiliate links. To update it, edit:

```
artifacts/tutorial-hub/src/pages/Resources.tsx
```

---

## 7. Newsletter & Subscribers

### How readers subscribe

- From the Newsletter page (`/newsletter`)
- From the newsletter CTA on the homepage
- From the footer signup form

### Managing subscribers

Go to `/admin/subscribers` to:
- See all subscribers with email, name, and signup date
- Export to CSV
- Delete subscribers

### Sending newsletters

DevDocs does **not** currently send emails automatically. To send a newsletter:
1. Export subscribers as CSV from the admin panel
2. Import the CSV into a service like [Mailchimp](https://mailchimp.com), [ConvertKit](https://convertkit.com), or [Beehiiv](https://beehiiv.com)
3. Send your newsletter from there

---

## 8. SEO & Google Indexing

### What's already set up

- **Meta tags** on every page: title, description, keywords, robots, canonical URL
- **Open Graph tags**: for rich previews when shared on Twitter/LinkedIn/Slack
- **Sitemap**: automatically generated at `/api/sitemap.xml` — includes all published posts
- **robots.txt**: at `/api/robots.txt` — tells Google to index everything except `/admin`

### How to get indexed on Google

1. **Deploy your site** (click Publish in Replit) to get a permanent `.replit.app` URL
2. Go to [Google Search Console](https://search.google.com/search-console)
3. Add your site URL as a property
4. Submit your sitemap URL: `https://your-domain.replit.app/api/sitemap.xml`
5. Google will crawl and index your pages within a few days to weeks

### Per-post SEO tips

- Use a descriptive **title** with your main keyword
- Write a good **excerpt** (under 160 chars) — this becomes the meta description
- Add relevant **tags** — they appear in post URLs and help with related content
- Use proper HTML heading structure (`<h2>`, `<h3>`) in your content
- Every new post you publish is automatically added to the sitemap

---

## 9. Changing Your Admin Password

1. Go to Replit → Secrets tab (left sidebar)
2. Find the `ADMIN_PASSWORD` secret
3. Update its value to your new password
4. Restart the API Server workflow (or it will pick up on next deploy)
5. Your old browser session token will still work until you sign out

---

## 10. Tech Stack Overview

| Layer | Technology | Why |
|-------|-----------|-----|
| Frontend | React + Vite | Fast, component-based UI |
| Routing | Wouter | Lightweight SPA router |
| Styling | Tailwind CSS + shadcn/ui | Utility-first, consistent components |
| Data fetching | TanStack Query + Orval | Auto-generated API hooks from OpenAPI spec |
| Backend | Node.js + Express 5 | REST API server |
| Database | PostgreSQL + Drizzle ORM | Type-safe queries |
| API spec | OpenAPI 3.1 (YAML) | Single source of truth for API shape |
| Auth | Custom token (ADMIN_PASSWORD) | Simple, no third-party dependency |
| Ads | Google AdSense | Auto-placed display ads |
| SEO | Meta tags + Sitemap XML | Google indexability |

---

## 11. Codebase File Map

```
/
├── artifacts/
│   ├── tutorial-hub/          ← Frontend (React)
│   │   ├── index.html         ← SEO meta tags + AdSense script
│   │   └── src/
│   │       ├── App.tsx        ← Routing (public + admin with auth guard)
│   │       ├── lib/
│   │       │   └── adminAuth.tsx    ← Admin login state & token management
│   │       ├── components/
│   │       │   ├── Header.tsx       ← Site navigation
│   │       │   ├── Footer.tsx       ← Footer with newsletter CTA
│   │       │   └── PostCard.tsx     ← Post card used in blog/tutorial lists
│   │       └── pages/
│   │           ├── Home.tsx         ← Homepage
│   │           ├── Blog.tsx         ← Blog listing with filters
│   │           ├── Tutorials.tsx    ← Tutorial listing
│   │           ├── Resources.tsx    ← Affiliate resources page
│   │           ├── Newsletter.tsx   ← Newsletter signup
│   │           ├── PostDetail.tsx   ← Single post with TOC + ads + feedback
│   │           └── admin/
│   │               ├── AdminLogin.tsx    ← Password login screen
│   │               ├── AdminLayout.tsx   ← Admin sidebar/header wrapper
│   │               ├── Dashboard.tsx     ← Admin overview
│   │               ├── PostList.tsx      ← Post management table
│   │               ├── PostEditor.tsx    ← Create/edit post form
│   │               └── Subscribers.tsx   ← Subscriber management
│   │
│   └── api-server/            ← Backend (Node.js/Express)
│       └── src/
│           ├── app.ts         ← Express setup
│           └── routes/
│               ├── posts.ts        ← CRUD for posts
│               ├── newsletter.ts   ← Subscribe + list subscribers
│               ├── feedback.ts     ← Helpful/not helpful votes
│               ├── admin.ts        ← Login + token verification + auth middleware
│               └── sitemap.ts      ← Sitemap XML + robots.txt
│
├── lib/
│   ├── api-spec/
│   │   └── openapi.yaml       ← API contract (edit this to add new endpoints)
│   ├── api-client-react/      ← Auto-generated React hooks (run codegen to update)
│   ├── api-zod/               ← Auto-generated Zod validators
│   └── db/
│       └── src/schema/        ← Database table definitions
│           ├── posts.ts
│           └── newsletter.ts
│
└── DEVDOCS_GUIDE.md           ← This file
```

---

## 12. Common Tasks Cheat Sheet

| Task | Where to do it |
|------|---------------|
| Write a new post | `/admin/posts/new` |
| Edit an existing post | `/admin/posts` → pencil icon |
| Delete a post | `/admin/posts` → trash icon |
| See all subscribers | `/admin/subscribers` |
| Export subscribers | `/admin/subscribers` → Export CSV |
| Add affiliate links to a post | Database (SQL insert into `affiliate_links`) |
| Update the Resources page | Edit `artifacts/tutorial-hub/src/pages/Resources.tsx` |
| Change admin password | Replit Secrets → `ADMIN_PASSWORD` |
| Submit sitemap to Google | Google Search Console → Add `https://yourdomain.replit.app/api/sitemap.xml` |
| Check AdSense status | [adsense.google.com](https://adsense.google.com) |
| Preview the live site | Click **Publish** in Replit, then open the `.replit.app` URL |

---

*Last updated: April 2026*
