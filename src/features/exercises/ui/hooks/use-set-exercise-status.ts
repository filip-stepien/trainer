'use client';

import { useActionState } from 'react';

import {
    setExerciseStatusAction,
    type SetExerciseStatusActionState
} from '../actions/set-exercise-status';

const initialState: SetExerciseStatusActionState = {};

export function useSetExerciseStatus() {
    const [state, formAction, isPending] = useActionState(
        (_prevState: SetExerciseStatusActionState, formData: FormData) =>
            setExerciseStatusAction(formData),
        initialState
    );

    return { state, formAction, isPending };
}
