import 'server-only';

import { redirect } from 'next/navigation';

import { getDashboardPath, getHomePath, getLoginPath } from './routes';

export function redirectToHome(): never {
    redirect(getHomePath());
}

export function redirectToDashboard(): never {
    redirect(getDashboardPath());
}

export function redirectToLogin(): never {
    redirect(getLoginPath());
}
