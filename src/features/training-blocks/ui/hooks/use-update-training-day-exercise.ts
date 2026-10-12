'use client';

import { type FormActionOptions, useFormAction } from '@/shared/client';

import {
    updateTrainingDayExerciseAction,
    type UpdateTrainingDayExerciseActionState
} from '../actions/update-training-day-exercise';

const initialState: UpdateTrainingDayExerciseActionState = {};

export function useUpdateTrainingDayExercise(
    options?: FormActionOptions<UpdateTrainingDayExerciseActionState>
) {
    return useFormAction(updateTrainingDayExerciseAction, initialState, options);
}
