'use client';

import { useFormAction } from '@/shared/client';

import {
    addExerciseFromCatalogAction,
    type AddExerciseFromCatalogActionState
} from '../actions/add-exercise-from-catalog';

const initialState: AddExerciseFromCatalogActionState = {};

export function useAddExerciseFromCatalog() {
    return useFormAction(addExerciseFromCatalogAction, initialState, { toastErrors: true });
}
