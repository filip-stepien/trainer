import 'server-only';

import { redirect } from 'next/navigation';

import { getExerciseListPath, getExercisePath } from './routes';

export function redirectToExerciseList(): never {
    redirect(getExerciseListPath());
}

export function redirectToExercise({ exerciseId }: { exerciseId: string }): never {
    redirect(getExercisePath({ exerciseId }));
}
