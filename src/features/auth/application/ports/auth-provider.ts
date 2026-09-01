import type { Result } from '@/shared';

import type { AuthErrorCode } from '../../domain/errors';
import type { AuthUser } from '../../domain/user';

export type SignUpInput = {
    email: string;
    password: string;
};

export type SignInInput = {
    email: string;
    password: string;
};

export type AuthProvider = {
    signUp: (input: SignUpInput) => Promise<Result<AuthUser, AuthErrorCode>>;
    signIn: (input: SignInInput) => Promise<Result<AuthUser, AuthErrorCode>>;
    signOut: () => Promise<Result<void, AuthErrorCode>>;
    getCurrentUser: () => Promise<AuthUser | null>;
};
