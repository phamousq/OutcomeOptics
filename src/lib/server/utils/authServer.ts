import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { db } from '../../../db.server'; // your drizzle instance
import { user, session, account, verification } from '../../../schema';

export const auth = betterAuth({
	database: drizzleAdapter(db, {
		provider: 'pg',
		schema: {
			user,
			session,
			account,
			verification
		}
	}),
	emailAndPassword: {
		enabled: true
	}
});
