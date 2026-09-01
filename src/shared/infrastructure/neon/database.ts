import { neon } from '@neondatabase/serverless';

import { env } from '@/shared/infrastructure/env';

export function createNeonClient() {
    return neon(env.databaseUrl);
}
