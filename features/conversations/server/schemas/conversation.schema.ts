import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const conversations = sqliteTable('conversations', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  kind: text('kind', { enum: ['dm', 'group'] }).notNull(),
  dmKey: text('dm_key').unique(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
});

export type ConversationModel = typeof conversations.$inferSelect;
