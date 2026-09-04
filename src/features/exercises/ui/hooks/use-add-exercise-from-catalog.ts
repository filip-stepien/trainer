'use client';

import { useActionState } from 'react';

import {
    addExerciseFromCatalogAction,
    type AddExerciseFromCatalogActionState
} from '../actions/add-exercise-from-catalog';

const initialState: AddExerciseFromCatalogActionState = {};

export function useAddExerciseFromCatalog() {
    const [state, formAction, isPending] = useActionState(
        (_prevState: AddExerciseFromCatalogActionState, formData: FormData) =>
            addExerciseFromCatalogAction(formData),
        initialState
    );

    return { state, formAction, isPending };
}
