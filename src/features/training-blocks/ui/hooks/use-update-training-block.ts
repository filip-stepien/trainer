'use client';

import { type FormActionOptions, useFormAction } from '@/shared/client';

import {
    updateTrainingBlockAction,
    type UpdateTrainingBlockActionState
} from '../actions/update-training-block';

const initialState: UpdateTrainingBlockActionState = {};

export function useUpdateTrainingBlock(
    options?: FormActionOptions<UpdateTrainingBlockActionState>
) {
    return useFormAction(updateTrainingBlockAction, initialState, options);
}
