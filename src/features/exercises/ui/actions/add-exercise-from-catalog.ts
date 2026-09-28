'use server';

import { getCurrentUser } from '@/features/auth/server';

import { addExerciseFromCatalog } from '../../composition';
import { revalidateExerciseListNow } from '../lib/revalidation';
import {
    type AddExerciseFromCatalogFieldErrors,
    validateAddExerciseFromCatalogForm
} from '../lib/validation';

const AddExerciseFromCatalogActionMessages = {
    SessionExpired: 'Sesja wygasła. Zaloguj się ponownie.',
    SourceNotFound: 'Nie znaleziono ćwiczenia w katalogu.'
} as const;

export type AddExerciseFromCatalogActionState = {
    error?: string;
    fieldErrors?: AddExerciseFromCatalogFieldErrors;
};

export async function addExerciseFromCatalogAction(
    formData: FormData
): Promise<AddExerciseFromCatalogActionState> {
    const user = await getCurrentUser();

    if (!user) {
        return { error: AddExerciseFromCatalogActionMessages.SessionExpired };
    }

    const validation = validateAddExerciseFromCatalogForm(formData);

    if (!validation.ok) {
        return { fieldErrors: validation.fieldErrors };
    }

    const result = await addExerciseFromCatalog({
        coachId: user.id,
        sourceExerciseId: validation.data.sourceExerciseId
    });

    if (!result.ok) {
        return { error: AddExerciseFromCatalogActionMessages.SourceNotFound };
    }

    revalidateExerciseListNow();
    return {};
}
