'use client';

import { useActionState } from 'react';

import {
    updateTrainingDayExerciseAction,
    type UpdateTrainingDayExerciseActionState
} from '../actions/update-training-day-exercise';

const initialState: UpdateTrainingDayExerciseActionState = {};

export function useUpdateTrainingDayExercise() {
    const [state, formAction, isPending] = useActionState(
        (_prevState: UpdateTrainingDayExerciseActionState, formData: FormData) =>
            updateTrainingDayExerciseAction(formData),
        initialState
    );

    return { state, formAction, isPending };
}
