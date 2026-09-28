import { connection } from 'next/server';

import { neonAuth, err, ok } from '@/shared/server';

import { AuthErrorCode } from '../domain/errors';
import type { AuthUser } from '../domain/user';
import type { AuthProvider, SignInInput, SignUpInput } from '../application/ports/auth-provider';

const neonAuthErrorCodes: Partial<Record<string, AuthErrorCode>> = {
    invalid_credentials: AuthErrorCode.InvalidCredentials,
    user_not_found: AuthErrorCode.InvalidCredentials,
    identity_not_found: AuthErrorCode.InvalidCredentials,
    user_already_exists: AuthErrorCode.EmailAlreadyInUse,
    email_exists: AuthErrorCode.EmailAlreadyInUse,
    weak_password: AuthErrorCode.WeakPassword,
    over_request_rate_limit: AuthErrorCode.RateLimited,
    over_email_send_rate_limit: AuthErrorCode.RateLimited
};

function toAuthError(error: { code?: string; status?: number }): AuthErrorCode {
    if (error.status === 429) {
        return AuthErrorCode.RateLimited;
    }
    return neonAuthErrorCodes[error.code ?? ''] ?? AuthErrorCode.Unknown;
}

function toAuthUser(user: { id: string; email: string; name: string }): AuthUser {
    return {
        id: user.id,
        email: user.email,
        name: user.name
    };
}

export function createNeonAuthProvider(): AuthProvider {
    return {
        async signUp({ email, password, name }: SignUpInput) {
            const { data, error } = await neonAuth.signUp.email({ email, password, name });

            if (error) {
                return err(toAuthError(error));
            }

            if (!data?.user) {
                return err(AuthErrorCode.Unknown);
            }

            return ok(toAuthUser(data.user));
        },

        async signIn({ email, password }: SignInInput) {
            const { data, error } = await neonAuth.signIn.email({ email, password });

            if (error) {
                return err(toAuthError(error));
            }

            if (!data?.user) {
                return err(AuthErrorCode.Unknown);
            }

            return ok(toAuthUser(data.user));
        },

        async signOut() {
            const { error } = await neonAuth.signOut();
            if (error) {
                return err(AuthErrorCode.Unknown);
            }
            return ok();
        },

        async getCurrentUser() {
            await connection();
            const { data } = await neonAuth.getSession();
            return data?.user ? toAuthUser(data.user) : null;
        }
    };
}
