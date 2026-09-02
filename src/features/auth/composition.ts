import 'server-only';

import { getCurrentUserFactory } from './application/use-cases/get-current-user';
import { signInFactory } from './application/use-cases/sign-in';
import { signOutFactory } from './application/use-cases/sign-out';
import { signUpFactory } from './application/use-cases/sign-up';
import { createNeonAuthProvider } from './infrastructure/neon-auth-provider';

const authProvider = createNeonAuthProvider();

export const signIn = signInFactory({ auth: authProvider });
export const signUp = signUpFactory({ auth: authProvider });
export const signOut = signOutFactory({ auth: authProvider });
export const getCurrentUser = getCurrentUserFactory({ auth: authProvider });
