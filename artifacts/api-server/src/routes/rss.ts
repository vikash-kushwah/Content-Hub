import { Router, type IRouter } from "express";
import { db, postsTable } from "@workspace/db";
import { desc } from "drizzle-orm";

const router: IRouter = Router();

router.get("/rss.xml", async (_req, res): Promise<void> => {
  const posts = await db
    .select({
      slug: postsTable.slug,
      title: postsTable.title,
      excerpt: postsTable.excerpt,
      publishedAt: postsTable.publishedAt,
      category: postsTable.category,
      tags: postsTable.tags,
    })
    .from(postsTable)
    .orderBy(desc(postsTable.publishedAt))
    .limit(20);

  const base = process.env["SITE_URL"] ?? "https://devdocs.replit.app";
  const now = new Date().toUTCString();

  const items = posts.map(p => {
    const url = `${base}/posts/${p.slug}`;
    const date = new Date(p.publishedAt).toUTCString();
    const cats = (p.tags ?? []).map(t => `<category>${t}</category>`).join("");
    return `
    <item>
      <title><![CDATA[${p.title}]]></title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description><![CDATA[${p.excerpt}]]></description>
      <pubDate>${date}</pubDate>
      ${cats}
    </item>`;
  });

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>DevDocs — Tutorials &amp; Guides for Developers</title>
    <link>${base}</link>
    <description>In-depth tutorials, how-to guides, and blog posts on web development, TypeScript, React, and more.</description>
    <language>en-us</language>
    <lastBuildDate>${now}</lastBuildDate>
    <atom:link href="${base}/api/rss.xml" rel="self" type="application/rss+xml"/>
    ${items.join("")}
  </channel>
</rss>`;

  res.setHeader("Content-Type", "application/rss+xml; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=3600");
  res.send(xml);
});

export default router;
