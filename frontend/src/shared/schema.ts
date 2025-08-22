import { sql } from "drizzle-orm";
import { pgTable, text, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Reply generation schemas
export const replyGenerationSchema = z.object({
  message: z.string().min(1, "Message is required"),
  relationship: z.enum(["friend", "girlfriend", "boyfriend", "family", "colleague", "stranger"]),
  mood: z.enum(["funny", "witty", "serious", "romantic", "flirty", "sarcastic"]),
});

export type ReplyGenerationRequest = z.infer<typeof replyGenerationSchema>;

export const replyResponseSchema = z.object({
  reply: z.string(),
  responseTime: z.number(),
});

export type ReplyResponse = z.infer<typeof replyResponseSchema>;
