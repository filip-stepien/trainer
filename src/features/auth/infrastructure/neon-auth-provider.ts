import { auth, err, ok } from '@/shared';

import { AuthErrorCode } from '../domain/errors';
import type { AuthUser } from '../domain/user';
import type { AuthProvider, SignInInput, SignUpInput } from '../application/ports/auth-provider';

const neonAuthErrorCodes: Partial<Record<string, AuthErrorCode>> = {
    INVALID_EMAIL_OR_PASSWORD: AuthErrorCode.InvalidCredentials,
    USER_ALREADY_EXISTS: AuthErrorCode.EmailAlreadyInUse,
    USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL: AuthErrorCode.EmailAlreadyInUse,
    PASSWORD_TOO_SHORT: AuthErrorCode.WeakPassword,
    PASSWORD_TOO_LONG: AuthErrorCode.WeakPassword
};

function mapAuthError(error: { code?: string; status?: number }): AuthErrorCode {
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
            const { data, error } = await auth.signUp.email({ email, password, name });

            if (error) {
                return err(mapAuthError(error));
            }

            if (!data?.user) {
                return err(AuthErrorCode.Unknown);
            }

            return ok(toAuthUser(data.user));
        },

        async signIn({ email, password }: SignInInput) {
            const { data, error } = await auth.signIn.email({ email, password });

            if (error) {
                return err(mapAuthError(error));
            }

            if (!data?.user) {
                return err(AuthErrorCode.Unknown);
            }

            return ok(toAuthUser(data.user));
        },

        async signOut() {
            const { error } = await auth.signOut();
            if (error) {
                return err(AuthErrorCode.Unknown);
            }
            return ok();
        },

        async getCurrentUser() {
            const { data } = await auth.getSession();
            return data?.user ? toAuthUser(data.user) : null;
        }
    };
}
