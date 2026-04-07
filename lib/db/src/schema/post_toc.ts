import { pgTable, text, serial, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const postTocTable = pgTable("post_toc", {
  id: serial("id").primaryKey(),
  postId: integer("post_id").notNull(),
  tocId: text("toc_id").notNull(),
  text: text("text").notNull(),
  level: integer("level").notNull(),
  order: integer("order").notNull(),
});

export const insertPostTocSchema = createInsertSchema(postTocTable).omit({ id: true });
export type InsertPostToc = z.infer<typeof insertPostTocSchema>;
export type PostToc = typeof postTocTable.$inferSelect;
