'use client';

import { useActionState } from 'react';

import { type UpdateExerciseActionState, updateExerciseAction } from '../actions/update-exercise';

const initialState: UpdateExerciseActionState = {};

export function useUpdateExercise() {
    const [state, formAction, isPending] = useActionState(
        (_prevState: UpdateExerciseActionState, formData: FormData) =>
            updateExerciseAction(formData),
        initialState
    );

    return { state, formAction, isPending };
}
