'use client';

import { useActionState } from 'react';

import {
    type UpdateTrainingDayActionState,
    updateTrainingDayAction
} from '../actions/update-training-day';

const initialState: UpdateTrainingDayActionState = {};

export function useUpdateTrainingDay() {
    const [state, formAction, isPending] = useActionState(
        (_prevState: UpdateTrainingDayActionState, formData: FormData) =>
            updateTrainingDayAction(formData),
        initialState
    );

    return { state, formAction, isPending };
}
