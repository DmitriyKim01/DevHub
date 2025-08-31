import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';

// Don't forget to add common export for all tables in database/schema.ts
export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  email: text('email').unique().notNull(),
  passwordHash: text('password_hash'),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .$defaultFn(() => new Date())
    .$onUpdate(() => new Date())
    .notNull()
});

export type UserModel = typeof users.$inferSelect;