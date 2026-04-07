import { pgTable, text, serial, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const affiliateLinksTable = pgTable("affiliate_links", {
  id: serial("id").primaryKey(),
  postId: integer("post_id").notNull(),
  label: text("label").notNull(),
  url: text("url").notNull(),
  description: text("description"),
});

export const insertAffiliateLinkSchema = createInsertSchema(affiliateLinksTable).omit({ id: true });
export type InsertAffiliateLink = z.infer<typeof insertAffiliateLinkSchema>;
export type AffiliateLink = typeof affiliateLinksTable.$inferSelect;
