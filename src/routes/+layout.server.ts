import { db } from '../db.server';
import { playingWithNeon } from '../schema';
import { sql } from 'drizzle-orm';

export async function load() {
	const values = await db
		.select({
			id: playingWithNeon.id,
			name: playingWithNeon.name,
			value: playingWithNeon.value
		})
		.from(playingWithNeon);

	return {
		values
	};
}
