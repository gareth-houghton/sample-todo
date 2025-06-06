import {
  pgTable, 
  serial, 
  text, 
  boolean, 
  timestamp,
  varchar 
} from "drizzle-orm/pg-core";

export const todos = pgTable("todos", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  completed: boolean("completed").default(false).notNull(),
  createdAt: timestamp("created_at", { precision: 3 }).defaultNow().notNull(),
  lastUpdated: timestamp("last_updated", { precision: 3 }).defaultNow().notNull().$onUpdate(() => new Date()),
  userId: varchar("user_id", { length: 256 }).default("none").notNull(),
});