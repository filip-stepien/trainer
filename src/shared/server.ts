import 'server-only';

export { err, ok } from './domain/result';
export { env } from './infrastructure/env';
export type { DrizzleDatabase } from './infrastructure/drizzle/database';
export { isDrizzleError } from './infrastructure/drizzle/errors';
export type { PostgresError } from './infrastructure/drizzle/errors';
export { neonAuth } from './infrastructure/neon/auth';
export { createNeonDrizzleDatabase } from './infrastructure/neon/database';
export { revalidateNow } from './infrastructure/next/revalidation';
