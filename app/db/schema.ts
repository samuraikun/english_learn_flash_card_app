// import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

// export const flashCards = sqliteTable('flash_cards', {
//   id: integer('id').primaryKey({ autoIncrement: true }),
//   word: text('word').notNull(),
//   meaning: text('meaning').notNull(),
//   phonetic: text('phonetic').notNull(),
//   definition: text('definition').notNull(),
//   example: text('example').notNull(),
//   status: text('status', { enum: ['understood', 'learning'] }).notNull().default('learning'),
//   createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(Date.now()),
// });
