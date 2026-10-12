'use client';

import { useFormAction } from '@/shared/client';

import {
    setExerciseStatusAction,
    type SetExerciseStatusActionState
} from '../actions/set-exercise-status';

const initialState: SetExerciseStatusActionState = {};

export function useSetExerciseStatus() {
    return useFormAction(setExerciseStatusAction, initialState, { toastErrors: true });
}
