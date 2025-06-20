import { sqliteTable, text } from "drizzle-orm/sqlite-core";

export const intentionsTable = sqliteTable("intentions", {
  date: text("date").primaryKey(), // YYYY-MM-DD
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
  intention: text("intention").notNull(),
});

export const moodLogsTable = sqliteTable("mood_logs", {
  id: text("id").primaryKey(),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
  datetime: text("datetime").notNull(),
  mood: text("mood").notNull(),
  feelings: text("feelings").notNull(),
  note: text("note").notNull(),
});

export const reflectionsTable = sqliteTable("reflections", {
  id: text("id").primaryKey(),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
  datetime: text("datetime").notNull(),
  content: text("content").notNull(),
  images: text("content").notNull(),
});

export const gratitudeLogsTable = sqliteTable("gratitude_logs", {
  id: text("id").primaryKey(),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
  datetime: text("datetime").notNull(),
  content: text("content").notNull(),
  images: text("content").notNull(),
});
