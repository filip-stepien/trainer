import 'server-only';

import { revalidateNow } from '@/shared/server';

import { getExerciseListPath, getExercisePath } from './routes';

export function revalidateExerciseListNow() {
    revalidateNow({ path: getExerciseListPath() });
}

export function revalidateExerciseNow({ exerciseId }: { exerciseId: string }) {
    revalidateNow({ path: getExercisePath({ exerciseId }) });
}
