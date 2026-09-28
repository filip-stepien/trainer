'use client';

import { useActionState } from 'react';

import {
    deleteTrainingDayAction,
    type DeleteTrainingDayActionState
} from '../actions/delete-training-day';

const initialState: DeleteTrainingDayActionState = {};

export function useDeleteTrainingDay() {
    const [state, formAction, isPending] = useActionState(
        (_prevState: DeleteTrainingDayActionState, formData: FormData) =>
            deleteTrainingDayAction(formData),
        initialState
    );

    return { state, formAction, isPending };
}
