import { relations, sql } from "drizzle-orm";
import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const tailorsTable = sqliteTable("tailors_table", {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  phone: text().unique(),
  notes: text(),
});

export const tasksTable = sqliteTable("tasks_table", {
  id: int().primaryKey({ autoIncrement: true }),
  meters: int().notNull(),
  design: text().notNull(),
  payed: int({ mode: "boolean" }).notNull(),
  orderReceived: text().default(sql`(CURRENT_DATE)`),
  orderDueDate: text().default(sql`(CURRENT_DATE)`),
  tailorId: int().notNull(),
});

export const tailorsRelations = relations(tailorsTable, ({ many }) => ({
  tasks: many(tasksTable),
}));

export const tasksRelations = relations(tasksTable, ({ one }) => ({
  tailor: one(tailorsTable, {
    fields: [tasksTable.tailorId],
    references: [tailorsTable.id],
  }),
}));
