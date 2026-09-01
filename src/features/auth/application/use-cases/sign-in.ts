import type { AuthProvider, SignInInput } from '../ports/auth-provider';

export function signInFactory({ auth }: { auth: AuthProvider }) {
    return (input: SignInInput) => auth.signIn(input);
}
