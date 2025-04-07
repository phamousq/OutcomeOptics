import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { config } from 'dotenv';

config({ path: '.env' }); // or .env.local

const sql = neon(process.env.VITE_DATABASE_URL!);
export const db = drizzle({ client: sql });
