'use client';

import { useActionState } from 'react';

import {
    moveTrainingDayAction,
    type MoveTrainingDayActionState
} from '../actions/move-training-day';

const initialState: MoveTrainingDayActionState = {};

export function useMoveTrainingDay() {
    const [state, formAction, isPending] = useActionState(
        (_prevState: MoveTrainingDayActionState, formData: FormData) =>
            moveTrainingDayAction(formData),
        initialState
    );

    return { state, formAction, isPending };
}
