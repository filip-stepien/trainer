'use server';

import { getAuthenticatedUserOrRedirect } from '@/features/auth/server';

import { addExerciseFromCatalog } from '../../composition';
import { ExerciseErrorMessages } from '../lib/messages';
import { revalidateExerciseListNow } from '../lib/revalidation';
import {
    type AddExerciseFromCatalogFieldErrors,
    validateAddExerciseFromCatalogForm
} from '../lib/validation';

export type AddExerciseFromCatalogActionState = {
    error?: string;
    fieldErrors?: AddExerciseFromCatalogFieldErrors;
};

export async function addExerciseFromCatalogAction(
    formData: FormData
): Promise<AddExerciseFromCatalogActionState> {
    const user = await getAuthenticatedUserOrRedirect();

    const validation = validateAddExerciseFromCatalogForm(formData);

    if (!validation.ok) {
        return { fieldErrors: validation.fieldErrors };
    }

    const result = await addExerciseFromCatalog({
        coachId: user.id,
        sourceExerciseId: validation.data.sourceExerciseId
    });

    if (!result.ok) {
        return { error: ExerciseErrorMessages[result.error] };
    }

    revalidateExerciseListNow();
    return {};
}
