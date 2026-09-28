'use client';

import { useActionState } from 'react';

import {
    moveTrainingDayExerciseAction,
    type MoveTrainingDayExerciseActionState
} from '../actions/move-training-day-exercise';

const initialState: MoveTrainingDayExerciseActionState = {};

export function useMoveTrainingDayExercise() {
    const [state, formAction, isPending] = useActionState(
        (_prevState: MoveTrainingDayExerciseActionState, formData: FormData) =>
            moveTrainingDayExerciseAction(formData),
        initialState
    );

    return { state, formAction, isPending };
}
