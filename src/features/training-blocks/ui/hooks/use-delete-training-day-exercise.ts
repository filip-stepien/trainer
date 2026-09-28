'use client';

import { useActionState } from 'react';

import {
    deleteTrainingDayExerciseAction,
    type DeleteTrainingDayExerciseActionState
} from '../actions/delete-training-day-exercise';

const initialState: DeleteTrainingDayExerciseActionState = {};

export function useDeleteTrainingDayExercise() {
    const [state, formAction, isPending] = useActionState(
        (_prevState: DeleteTrainingDayExerciseActionState, formData: FormData) =>
            deleteTrainingDayExerciseAction(formData),
        initialState
    );

    return { state, formAction, isPending };
}
