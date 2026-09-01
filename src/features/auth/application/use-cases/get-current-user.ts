import type { AuthProvider } from '../ports/auth-provider';

export function getCurrentUserFactory({ auth }: { auth: AuthProvider }) {
    return () => auth.getCurrentUser();
}
