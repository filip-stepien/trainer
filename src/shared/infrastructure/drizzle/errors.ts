import 'server-only';

import { DrizzleQueryError } from 'drizzle-orm';

export type PostgresError = Error & {
    code: string;
    constraint?: string;
};

export function isDrizzleError(
    error: unknown
): error is DrizzleQueryError & { cause: PostgresError } {
    if (!(error instanceof DrizzleQueryError) || !(error.cause instanceof Error)) {
        return false;
    }

    if (!('code' in error.cause) || typeof error.cause.code !== 'string') {
        return false;
    }

    return (
        !('constraint' in error.cause) ||
        error.cause.constraint === undefined ||
        typeof error.cause.constraint === 'string'
    );
}
