import { pgTable, text, serial, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const companions = pgTable("companions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  name: text("name").notNull(),
  description: text("description"),
  avatarUrl: text("avatar_url"),
  originalPhotoUrl: text("original_photo_url"),
  personality: text("personality").default("balanced"),
  voiceType: text("voice_type").default("natural"),
  createdAt: text("created_at").notNull(),
});

export const conversations = pgTable("conversations", {
  id: serial("id").primaryKey(),
  companionId: integer("companion_id").references(() => companions.id),
  messages: jsonb("messages").notNull(),
  updatedAt: text("updated_at").notNull(),
});

// Schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertCompanionSchema = createInsertSchema(companions).pick({
  userId: true,
  name: true,
  description: true,
  avatarUrl: true,
  originalPhotoUrl: true,
  personality: true,
  voiceType: true,
  createdAt: true,
});

export const insertConversationSchema = createInsertSchema(conversations).pick({
  companionId: true,
  messages: true,
  updatedAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Companion = typeof companions.$inferSelect;
export type InsertCompanion = z.infer<typeof insertCompanionSchema>;

export type Conversation = typeof conversations.$inferSelect;
export type InsertConversation = z.infer<typeof insertConversationSchema>;

export type Message = {
  id: string;
  role: "system" | "user" | "assistant";
  content: string;
  timestamp: string;
};
