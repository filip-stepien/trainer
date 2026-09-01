export type { Result } from './domain/result';
export { err, ok } from './domain/result';

export { env } from './infrastructure/env';
export { createSupabaseBrowserClient } from './infrastructure/supabase/client';
export { createSupabaseServerClient } from './infrastructure/supabase/server';
export { updateSupabaseSession } from './infrastructure/supabase/middleware';
