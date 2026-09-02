import 'server-only';

import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

import { env } from '../env';

export function createNeonDrizzleDatabase() {
    const neonClient = neon(env.databaseUrl);
    return drizzle({ client: neonClient });
}
