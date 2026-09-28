'use client';

import { useActionState } from 'react';

import {
    createTrainingDayAction,
    type CreateTrainingDayActionState
} from '../actions/create-training-day';

const initialState: CreateTrainingDayActionState = {};

export function useCreateTrainingDay() {
    const [state, formAction, isPending] = useActionState(
        (_prevState: CreateTrainingDayActionState, formData: FormData) =>
            createTrainingDayAction(formData),
        initialState
    );

    return { state, formAction, isPending };
}
