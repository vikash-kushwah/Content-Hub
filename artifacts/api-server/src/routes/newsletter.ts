import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, newsletterSubscribersTable } from "@workspace/db";
import { SubscribeNewsletterBody } from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/newsletter/subscribers", async (_req, res): Promise<void> => {
  const subscribers = await db
    .select()
    .from(newsletterSubscribersTable)
    .orderBy(newsletterSubscribersTable.subscribedAt);

  res.json({
    subscribers: subscribers.map(s => ({
      id: s.id,
      email: s.email,
      name: s.name,
      subscribedAt: s.subscribedAt,
    })),
    total: subscribers.length,
  });
});

router.delete("/newsletter/subscribers/:id", async (req, res): Promise<void> => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid subscriber ID" });
    return;
  }

  const [existing] = await db
    .select()
    .from(newsletterSubscribersTable)
    .where(eq(newsletterSubscribersTable.id, id));

  if (!existing) {
    res.status(404).json({ error: "Subscriber not found" });
    return;
  }

  await db.delete(newsletterSubscribersTable).where(eq(newsletterSubscribersTable.id, id));
  res.status(204).end();
});

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
