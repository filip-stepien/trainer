'use server';

import { signOut } from '../../composition';
import { redirectToLogin } from '../lib/navigation';

export async function signOutAction(): Promise<void> {
    await signOut();
    redirectToLogin();
}
