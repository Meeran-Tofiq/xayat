import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const tailorsTable = sqliteTable("tailors_table", {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  phone: text().unique(),
  notes: text(),
});
