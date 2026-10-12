'use client';

import { useFormAction } from '@/shared/client';

import {
    deleteTrainingDayExerciseAction,
    type DeleteTrainingDayExerciseActionState
} from '../actions/delete-training-day-exercise';

const initialState: DeleteTrainingDayExerciseActionState = {};

export function useDeleteTrainingDayExercise() {
    return useFormAction(deleteTrainingDayExerciseAction, initialState, { toastErrors: true });
}
