'use client';

import { useActionState } from 'react';

import { createExerciseAction, type CreateExerciseActionState } from '../actions/create-exercise';

const initialState: CreateExerciseActionState = {};

export function useCreateExercise() {
    const [state, formAction, isPending] = useActionState(
        (_prevState: CreateExerciseActionState, formData: FormData) =>
            createExerciseAction(formData),
        initialState
    );

    return { state, formAction, isPending };
}
