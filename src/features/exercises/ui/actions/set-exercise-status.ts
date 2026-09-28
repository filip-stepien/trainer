'use server';

import { getAuthenticatedUserOrRedirect } from '@/features/auth/server';

import { setExerciseStatus } from '../../composition';
import { ExerciseActionMessages, ExerciseErrorMessages } from '../lib/messages';
import { revalidateExerciseListNow, revalidateExerciseNow } from '../lib/revalidation';
import { validateSetExerciseStatusForm } from '../lib/validation';

export type SetExerciseStatusActionState = {
    error?: string;
};

export async function setExerciseStatusAction(
    formData: FormData
): Promise<SetExerciseStatusActionState> {
    const user = await getAuthenticatedUserOrRedirect();

    const validation = validateSetExerciseStatusForm(formData);

    if (!validation.ok) {
        return { error: ExerciseActionMessages.InvalidData };
    }

    const { exerciseId, status } = validation.data;
    const result = await setExerciseStatus({ coachId: user.id, exerciseId, status });

    if (!result.ok) {
        return { error: ExerciseErrorMessages[result.error] };
    }

    revalidateExerciseListNow();
    revalidateExerciseNow({ exerciseId });
    return {};
}
