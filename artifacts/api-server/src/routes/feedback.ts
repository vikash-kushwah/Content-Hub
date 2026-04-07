import { Router, type IRouter } from "express";
import { eq, sql } from "drizzle-orm";
import { db, postsTable } from "@workspace/db";
import { SubmitFeedbackBody } from "@workspace/api-zod";

const router: IRouter = Router();

router.post("/feedback", async (req, res): Promise<void> => {
  const parsed = SubmitFeedbackBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { postSlug, helpful } = parsed.data;

  const [post] = await db
    .select()
    .from(postsTable)
    .where(eq(postsTable.slug, postSlug));

  if (!post) {
    res.status(404).json({ error: "Post not found" });
    return;
  }

  const [updated] = await db
    .update(postsTable)
    .set(
      helpful
        ? { helpfulCount: sql`${postsTable.helpfulCount} + 1` }
        : { notHelpfulCount: sql`${postsTable.notHelpfulCount} + 1` }
    )
    .where(eq(postsTable.id, post.id))
    .returning({ helpfulCount: postsTable.helpfulCount, notHelpfulCount: postsTable.notHelpfulCount });

  res.status(201).json({
    message: "Feedback recorded",
    helpfulCount: updated?.helpfulCount ?? 0,
    notHelpfulCount: updated?.notHelpfulCount ?? 0,
  });
});

export default router;
