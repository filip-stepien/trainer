import type { AuthProvider, SignUpInput } from '../ports/auth-provider';

export function signUpFactory({ auth }: { auth: AuthProvider }) {
    return (input: SignUpInput) => auth.signUp(input);
}
