import 'server-only';

import { getCurrentUser } from '../../composition';
import { redirectToLogin } from '../lib/navigation';

export async function getAuthenticatedUserOrRedirect() {
    const user = await getCurrentUser();

    if (!user) {
        redirectToLogin();
    }

    return user;
}
