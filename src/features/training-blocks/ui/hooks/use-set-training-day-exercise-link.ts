'use client';

import { useFormAction } from '@/shared/client';

import {
    setTrainingDayExerciseLinkAction,
    type SetTrainingDayExerciseLinkActionState
} from '../actions/set-training-day-exercise-link';

const initialState: SetTrainingDayExerciseLinkActionState = {};

export function useSetTrainingDayExerciseLink() {
    return useFormAction(setTrainingDayExerciseLinkAction, initialState, { toastErrors: true });
}
