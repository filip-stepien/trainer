'use client';

import { useFormAction } from '@/shared/client';

import {
    deleteTrainingDayAction,
    type DeleteTrainingDayActionState
} from '../actions/delete-training-day';

const initialState: DeleteTrainingDayActionState = {};

export function useDeleteTrainingDay() {
    return useFormAction(deleteTrainingDayAction, initialState, { toastErrors: true });
}
