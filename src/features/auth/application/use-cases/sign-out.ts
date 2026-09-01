import type { AuthProvider } from '../ports/auth-provider';

export function signOutFactory({ auth }: { auth: AuthProvider }) {
    return () => auth.signOut();
}
