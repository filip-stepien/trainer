import { createSupabaseServerClient } from '@/shared';

import type { SignInInput, SignUpInput } from './application/ports/auth-provider';
import { getCurrentUserFactory } from './application/use-cases/get-current-user';
import { signInFactory } from './application/use-cases/sign-in';
import { signOutFactory } from './application/use-cases/sign-out';
import { signUpFactory } from './application/use-cases/sign-up';
import { createSupabaseAuthProvider } from './infrastructure/supabase-auth-provider';

export type { AuthUser } from './domain/user';
export { AuthErrorCode } from './domain/errors';
export { LoginForm } from './ui/components/login-form';
export { SignUpForm } from './ui/components/sign-up-form';
export { signOutAction } from './ui/actions/sign-out';

async function getAuthProvider() {
    return createSupabaseAuthProvider(await createSupabaseServerClient());
}

export async function signIn(input: SignInInput) {
    return signInFactory({ auth: await getAuthProvider() })(input);
}

export async function signUp(input: SignUpInput) {
    return signUpFactory({ auth: await getAuthProvider() })(input);
}

export async function signOut() {
    return signOutFactory({ auth: await getAuthProvider() })();
}

export async function getCurrentUser() {
    return getCurrentUserFactory({ auth: await getAuthProvider() })();
}
