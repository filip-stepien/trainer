import 'server-only';

import { parseEnv } from '@neon/env';

import neonConfig from '../../../neon';

function requireEnv(name: string): string {
    const value = process.env[name];
    if (!value) {
        throw new Error(`Missing required environment variable: ${name}`);
    }
    return value;
}

export const env = {
    get databaseUrl() {
        return parseEnv(neonConfig).postgres.databaseUrl;
    },
    get neonAuthBaseUrl() {
        return parseEnv(neonConfig).auth.baseUrl;
    },
    get neonAuthCookieSecret() {
        return requireEnv('NEON_AUTH_COOKIE_SECRET');
    }
};
