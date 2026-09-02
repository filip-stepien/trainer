import 'server-only';

import type { PgDatabase, PgQueryResultHKT } from 'drizzle-orm/pg-core';

export type DrizzleDatabase = PgDatabase<PgQueryResultHKT>;
