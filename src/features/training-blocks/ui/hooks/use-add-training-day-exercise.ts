'use client';

import { type FormActionOptions, useFormAction } from '@/shared/client';

import {
    addTrainingDayExerciseAction,
    type AddTrainingDayExerciseActionState
} from '../actions/add-training-day-exercise';

const initialState: AddTrainingDayExerciseActionState = {};

export function useAddTrainingDayExercise(
    options?: FormActionOptions<AddTrainingDayExerciseActionState>
) {
    return useFormAction(addTrainingDayExerciseAction, initialState, options);
}
