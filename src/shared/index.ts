export type { Result } from './domain/result';
export { err, ok } from './domain/result';

export { env } from './infrastructure/env';
export { neonAuth as auth } from './infrastructure/neon/auth';
export { createNeonClient as createDatabaseClient } from './infrastructure/neon/database';
