'use client';

import { type FormActionOptions, useFormAction } from '@/shared/client';

import {
    updateTrainingDayAction,
    type UpdateTrainingDayActionState
} from '../actions/update-training-day';

const initialState: UpdateTrainingDayActionState = {};

export function useUpdateTrainingDay(options?: FormActionOptions<UpdateTrainingDayActionState>) {
    return useFormAction(updateTrainingDayAction, initialState, options);
}
