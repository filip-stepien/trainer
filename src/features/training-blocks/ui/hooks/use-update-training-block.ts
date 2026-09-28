'use client';

import { useActionState } from 'react';

import {
    type UpdateTrainingBlockActionState,
    updateTrainingBlockAction
} from '../actions/update-training-block';

const initialState: UpdateTrainingBlockActionState = {};

export function useUpdateTrainingBlock() {
    const [state, formAction, isPending] = useActionState(
        (_prevState: UpdateTrainingBlockActionState, formData: FormData) =>
            updateTrainingBlockAction(formData),
        initialState
    );

    return { state, formAction, isPending };
}
