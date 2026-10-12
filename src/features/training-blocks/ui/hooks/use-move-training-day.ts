'use client';

import { useFormAction } from '@/shared/client';

import {
    moveTrainingDayAction,
    type MoveTrainingDayActionState
} from '../actions/move-training-day';

const initialState: MoveTrainingDayActionState = {};

export function useMoveTrainingDay() {
    return useFormAction(moveTrainingDayAction, initialState, { toastErrors: true });
}
