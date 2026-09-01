import { createNeonAuth } from '@neondatabase/auth/next/server';

import { env } from '@/shared/infrastructure/env';

export const neonAuth = createNeonAuth({
    baseUrl: env.neonAuthBaseUrl,
    cookies: {
        secret: env.neonAuthCookieSecret
    }
});
