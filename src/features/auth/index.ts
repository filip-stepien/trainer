import { getCurrentUserFactory } from './application/use-cases/get-current-user';
import { signInFactory } from './application/use-cases/sign-in';
import { signOutFactory } from './application/use-cases/sign-out';
import { signUpFactory } from './application/use-cases/sign-up';
import { createNeonAuthProvider } from './infrastructure/neon-auth-provider';

export type { AuthUser } from './domain/user';
export { AuthErrorCode } from './domain/errors';
export { LoginForm } from './ui/components/login-form';
export { SignUpForm } from './ui/components/sign-up-form';
export { signOutAction } from './ui/actions/sign-out';

const authProvider = createNeonAuthProvider();

export const signIn = signInFactory({ auth: authProvider });
export const signUp = signUpFactory({ auth: authProvider });
export const signOut = signOutFactory({ auth: authProvider });
export const getCurrentUser = getCurrentUserFactory({ auth: authProvider });
