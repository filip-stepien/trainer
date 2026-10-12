'use client';

import { type FormActionOptions, useFormAction } from '@/shared/client';

import {
    createTrainingDayAction,
    type CreateTrainingDayActionState
} from '../actions/create-training-day';

const initialState: CreateTrainingDayActionState = {};

export function useCreateTrainingDay(options?: FormActionOptions<CreateTrainingDayActionState>) {
    return useFormAction(createTrainingDayAction, initialState, options);
}
