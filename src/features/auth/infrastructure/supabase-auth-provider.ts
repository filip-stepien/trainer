import type { AuthError, SupabaseClient, User } from '@supabase/supabase-js';

import { err, ok } from '@/shared';

import { AuthErrorCode } from '../domain/errors';
import type { AuthUser } from '../domain/user';
import type { AuthProvider, SignInInput, SignUpInput } from '../application/ports/auth-provider';

function mapToAuthUser(user: User): AuthUser {
    return {
        id: user.id,
        email: user.email ?? null
    };
}

const supabaseErrorCodes: Partial<Record<string, AuthErrorCode>> = {
    invalid_credentials: AuthErrorCode.InvalidCredentials,
    email_not_confirmed: AuthErrorCode.EmailNotConfirmed,
    user_banned: AuthErrorCode.UserBanned,
    user_already_exists: AuthErrorCode.EmailAlreadyInUse,
    weak_password: AuthErrorCode.WeakPassword,
    over_request_rate_limit: AuthErrorCode.RateLimited,
    over_email_send_rate_limit: AuthErrorCode.RateLimited
};

function mapAuthError(error: AuthError): AuthErrorCode {
    return supabaseErrorCodes[error.code ?? ''] ?? AuthErrorCode.Unknown;
}

export function createSupabaseAuthProvider(supabase: SupabaseClient): AuthProvider {
    return {
        async signUp({ email, password }: SignUpInput) {
            const { data, error } = await supabase.auth.signUp({ email, password });

            if (error) {
                return err(mapAuthError(error));
            }

            if (!data.user) {
                return err(AuthErrorCode.Unknown);
            }

            return ok(mapToAuthUser(data.user));
        },

        async signIn({ email, password }: SignInInput) {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password
            });

            if (error) {
                return err(mapAuthError(error));
            }

            return ok(mapToAuthUser(data.user));
        },

        async signOut() {
            const { error } = await supabase.auth.signOut();
            if (error) {
                return err(AuthErrorCode.Unknown);
            }
            return ok();
        },

        async getCurrentUser() {
            const {
                data: { user }
            } = await supabase.auth.getUser();

            return user ? mapToAuthUser(user) : null;
        }
    };
}
