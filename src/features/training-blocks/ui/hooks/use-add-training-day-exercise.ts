'use client';

import { useActionState } from 'react';

import {
    addTrainingDayExerciseAction,
    type AddTrainingDayExerciseActionState
} from '../actions/add-training-day-exercise';

const initialState: AddTrainingDayExerciseActionState = {};

export function useAddTrainingDayExercise() {
    const [state, formAction, isPending] = useActionState(
        (_prevState: AddTrainingDayExerciseActionState, formData: FormData) =>
            addTrainingDayExerciseAction(formData),
        initialState
    );

    return { state, formAction, isPending };
}
