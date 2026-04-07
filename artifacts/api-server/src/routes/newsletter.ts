import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, newsletterSubscribersTable } from "@workspace/db";
import { SubscribeNewsletterBody } from "@workspace/api-zod";

const router: IRouter = Router();

router.post("/newsletter/subscribe", async (req, res): Promise<void> => {
  const parsed = SubscribeNewsletterBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { email, name } = parsed.data;

  const existing = await db
    .select()
    .from(newsletterSubscribersTable)
    .where(eq(newsletterSubscribersTable.email, email));

  if (existing.length > 0) {
    res.status(201).json({ message: "Already subscribed", alreadySubscribed: true });
    return;
  }

  await db.insert(newsletterSubscribersTable).values({ email, name: name ?? null });

  res.status(201).json({ message: "Subscribed successfully", alreadySubscribed: false });
});

export default router;
