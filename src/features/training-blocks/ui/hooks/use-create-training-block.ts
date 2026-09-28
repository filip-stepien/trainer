'use client';

import { useActionState } from 'react';

import {
    createTrainingBlockAction,
    type CreateTrainingBlockActionState
} from '../actions/create-training-block';

const initialState: CreateTrainingBlockActionState = {};

export function useCreateTrainingBlock() {
    const [state, formAction, isPending] = useActionState(
        (_prevState: CreateTrainingBlockActionState, formData: FormData) =>
            createTrainingBlockAction(formData),
        initialState
    );

    return { state, formAction, isPending };
}
