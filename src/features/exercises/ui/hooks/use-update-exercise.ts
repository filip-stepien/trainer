'use client';

import { type FormActionOptions, useFormAction } from '@/shared/client';

import { updateExerciseAction, type UpdateExerciseActionState } from '../actions/update-exercise';

const initialState: UpdateExerciseActionState = {};

export function useUpdateExercise(options?: FormActionOptions<UpdateExerciseActionState>) {
    return useFormAction(updateExerciseAction, initialState, options);
}
