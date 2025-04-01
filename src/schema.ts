import { pgTable, serial, text, real } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

export const playingWithNeon = pgTable('playing_with_neon', {
	id: serial().primaryKey().notNull(),
	name: text().notNull(),
	value: real()
});
