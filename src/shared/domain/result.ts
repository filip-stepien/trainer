export type Result<T, E> = { ok: true; value: T } | { ok: false; error: E };

export function ok<T = void>(value?: T): Result<T, never> {
    return { ok: true, value } as Result<T, never>;
}

export function err<E>(error: E): Result<never, E> {
    return { ok: false, error };
}
