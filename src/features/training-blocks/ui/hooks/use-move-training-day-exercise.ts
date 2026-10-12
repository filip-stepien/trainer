'use client';

import { useFormAction } from '@/shared/client';

import {
    moveTrainingDayExerciseAction,
    type MoveTrainingDayExerciseActionState
} from '../actions/move-training-day-exercise';

const initialState: MoveTrainingDayExerciseActionState = {};

export function useMoveTrainingDayExercise() {
    return useFormAction(moveTrainingDayExerciseAction, initialState, { toastErrors: true });
}
