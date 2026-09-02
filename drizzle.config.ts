import { config } from 'dotenv';
import { defineConfig } from 'drizzle-kit';
import { parseEnv } from '@neon/env';

import neonConfig from './neon';

config({ path: '.env.local', quiet: true });

export default defineConfig({
    schema: './src/features/**/infrastructure/**/*-schema.ts',
    out: './drizzle',
    dialect: 'postgresql',
    dbCredentials: {
        url: parseEnv(neonConfig).postgres.databaseUrl
    }
});
