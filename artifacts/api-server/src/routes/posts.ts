import { Router, type IRouter } from "express";
import { eq, desc, and, sql, inArray } from "drizzle-orm";
import { db, postsTable, postTocTable, affiliateLinksTable } from "@workspace/db";
import {
  ListPostsQueryParams,
  GetPostParams,
  GetRelatedPostsParams,
  GetRecentPostsQueryParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

async function getPostWithDetails(postId: number) {
  const [toc, affiliates] = await Promise.all([
    db
      .select()
      .from(postTocTable)
      .where(eq(postTocTable.postId, postId))
      .orderBy(postTocTable.order),
    db
      .select()
      .from(affiliateLinksTable)
      .where(eq(affiliateLinksTable.postId, postId)),
  ]);
  return { toc, affiliates };
}

router.get("/posts", async (req, res): Promise<void> => {
  const parsed = ListPostsQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { category, tag, limit = 20, offset = 0 } = parsed.data;

  const conditions = [];
  if (category) conditions.push(eq(postsTable.category, category));
  if (tag) conditions.push(sql`${postsTable.tags} @> ARRAY[${tag}]::text[]`);

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  const [posts, [{ count }]] = await Promise.all([
    db
      .select()
      .from(postsTable)
      .where(whereClause)
      .orderBy(desc(postsTable.publishedAt))
      .limit(limit)
      .offset(offset),
    db
      .select({ count: sql<number>`cast(count(*) as int)` })
      .from(postsTable)
      .where(whereClause),
  ]);

  res.json({ posts, total: count });
});

router.get("/posts/featured", async (_req, res): Promise<void> => {
  const posts = await db
    .select()
    .from(postsTable)
    .where(eq(postsTable.featured, true))
    .orderBy(desc(postsTable.publishedAt))
    .limit(6);

  res.json({ posts });
});

router.get("/posts/recent", async (req, res): Promise<void> => {
  const parsed = GetRecentPostsQueryParams.safeParse(req.query);
  const limit = parsed.success ? (parsed.data.limit ?? 6) : 6;

  const posts = await db
    .select()
    .from(postsTable)
    .orderBy(desc(postsTable.publishedAt))
    .limit(limit);

  res.json({ posts });
});

router.get("/posts/stats", async (_req, res): Promise<void> => {
  const [posts, subCount] = await Promise.all([
    db.select({ category: postsTable.category, tags: postsTable.tags }).from(postsTable),
    db.execute<{ count: number }>(sql`SELECT cast(count(*) as int) as count FROM newsletter_subscribers`),
  ]);

  const totalPosts = posts.length;
  const byCategory: Record<string, number> = {};
  const tagCount: Record<string, number> = {};

  for (const post of posts) {
    byCategory[post.category] = (byCategory[post.category] ?? 0) + 1;
    for (const tag of post.tags ?? []) {
      tagCount[tag] = (tagCount[tag] ?? 0) + 1;
    }
  }

  const popularTags = Object.entries(tagCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([tag, count]) => ({ tag, count }));

  const totalSubscribers = (subCount.rows[0]?.count ?? 0);

  res.json({ totalPosts, byCategory, popularTags, totalSubscribers });
});

router.get("/posts/:slug", async (req, res): Promise<void> => {
  const rawSlug = Array.isArray(req.params.slug) ? req.params.slug[0] : req.params.slug;
  const parsed = GetPostParams.safeParse({ slug: rawSlug });
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [post] = await db
    .select()
    .from(postsTable)
    .where(eq(postsTable.slug, parsed.data.slug));

  if (!post) {
    res.status(404).json({ error: "Post not found" });
    return;
  }

  const { toc, affiliates } = await getPostWithDetails(post.id);

  res.json({
    ...post,
    tableOfContents: toc.map(t => ({ id: t.tocId, text: t.text, level: t.level })),
    affiliateLinks: affiliates.map(a => ({ label: a.label, url: a.url, description: a.description })),
  });
});

router.get("/posts/:slug/related", async (req, res): Promise<void> => {
  const rawSlug = Array.isArray(req.params.slug) ? req.params.slug[0] : req.params.slug;
  const parsed = GetRelatedPostsParams.safeParse({ slug: rawSlug });
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [currentPost] = await db
    .select()
    .from(postsTable)
    .where(eq(postsTable.slug, parsed.data.slug));

  if (!currentPost) {
    res.json({ posts: [] });
    return;
  }

  const related = await db
    .select()
    .from(postsTable)
    .where(
      and(
        eq(postsTable.category, currentPost.category),
        sql`${postsTable.id} != ${currentPost.id}`
      )
    )
    .orderBy(desc(postsTable.publishedAt))
    .limit(4);

  res.json({ posts: related });
});

export default router;
