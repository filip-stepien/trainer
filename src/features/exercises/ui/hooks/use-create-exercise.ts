'use client';

import { useFormAction } from '@/shared/client';

import { createExerciseAction, type CreateExerciseActionState } from '../actions/create-exercise';

const initialState: CreateExerciseActionState = {};

export function useCreateExercise() {
    return useFormAction(createExerciseAction, initialState);
}
