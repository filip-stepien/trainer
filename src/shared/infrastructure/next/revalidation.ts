import 'server-only';

import { revalidatePath } from 'next/cache';

export function revalidateNow({ path }: { path: string }) {
    revalidatePath(path);
}
