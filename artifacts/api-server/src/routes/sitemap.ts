import { Router, type IRouter } from "express";
import { db, postsTable } from "@workspace/db";
import { desc } from "drizzle-orm";

const router: IRouter = Router();

router.get("/sitemap.xml", async (_req, res): Promise<void> => {
  const posts = await db
    .select({ slug: postsTable.slug, publishedAt: postsTable.publishedAt, updatedAt: postsTable.updatedAt })
    .from(postsTable)
    .orderBy(desc(postsTable.publishedAt));

  const base = process.env["SITE_URL"] ?? "https://devdocs.replit.app";

  const staticPages = [
    { url: `${base}/`, priority: "1.0", changefreq: "weekly" },
    { url: `${base}/blog`, priority: "0.9", changefreq: "daily" },
    { url: `${base}/tutorials`, priority: "0.9", changefreq: "daily" },
    { url: `${base}/resources`, priority: "0.7", changefreq: "weekly" },
    { url: `${base}/newsletter`, priority: "0.6", changefreq: "monthly" },
    { url: `${base}/about`, priority: "0.5", changefreq: "monthly" },
    { url: `${base}/privacy`, priority: "0.3", changefreq: "yearly" },
  ];

  const postUrls = posts.map(p => ({
    url: `${base}/posts/${p.slug}`,
    lastmod: (p.updatedAt ?? p.publishedAt).toISOString().split("T")[0],
    priority: "0.8",
    changefreq: "monthly",
  }));

  const allUrls = [
    ...staticPages.map(p => `
    <url>
      <loc>${p.url}</loc>
      <changefreq>${p.changefreq}</changefreq>
      <priority>${p.priority}</priority>
    </url>`),
    ...postUrls.map(p => `
    <url>
      <loc>${p.url}</loc>
      <lastmod>${p.lastmod}</lastmod>
      <changefreq>${p.changefreq}</changefreq>
      <priority>${p.priority}</priority>
    </url>`),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls.join("")}
</urlset>`;

  res.setHeader("Content-Type", "application/xml");
  res.setHeader("Cache-Control", "public, max-age=3600");
  res.send(xml);
});

router.get("/robots.txt", (_req, res): void => {
  const base = process.env["SITE_URL"] ?? "https://devdocs.replit.app";
  res.setHeader("Content-Type", "text/plain");
  res.setHeader("Cache-Control", "public, max-age=86400");
  res.send(`User-agent: *
Allow: /
Disallow: /admin
Disallow: /api/admin

# Crawl-delay for polite bots
Crawl-delay: 1

# Allow major AI crawlers
User-agent: GPTBot
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: CCBot
Allow: /

Sitemap: ${base}/api/sitemap.xml
`);
});

export default router;
