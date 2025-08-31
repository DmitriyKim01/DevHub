import { sqliteTable, integer } from 'drizzle-orm/sqlite-core';

// Don't forget to add common export for all tables in database/schema.ts
export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true })
});

export type UserModel = typeof users.$inferSelect;