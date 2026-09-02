import 'server-only';

import { revalidateNow } from '@/shared/server';

import { getClientListPath, getClientPath } from './routes';

export function revalidateClientListNow() {
    revalidateNow({ path: getClientListPath() });
}

export function revalidateClientNow({ clientId }: { clientId: string }) {
    revalidateNow({ path: getClientPath({ clientId }) });
}
