import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash'),
  authMethod: text('auth_method', {
    enum: ['credentials', 'oauth', 'passkeys'],
  }).notNull(),
  verificationToken: text('verification_token'),
  verificationTokenExpire: integer('verification_token_expire', {
    mode: 'timestamp',
  }),
  isVerified: integer({ mode: 'boolean' }).notNull().default(false),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .$defaultFn(() => new Date()),
});

export type UserModel = typeof users.$inferSelect;
