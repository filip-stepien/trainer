'use client';

import { useFormAction } from '@/shared/client';

import {
    createTrainingBlockAction,
    type CreateTrainingBlockActionState
} from '../actions/create-training-block';

const initialState: CreateTrainingBlockActionState = {};

export function useCreateTrainingBlock() {
    return useFormAction(createTrainingBlockAction, initialState);
}
