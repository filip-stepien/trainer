'use client';

import { useActionState } from 'react';

import { updateClientAction, type UpdateClientActionState } from '../actions/update-client';

const initialState: UpdateClientActionState = {};

export function useUpdateClient() {
    const [state, formAction, isPending] = useActionState(
        (_prevState: UpdateClientActionState, formData: FormData) => updateClientAction(formData),
        initialState
    );

    return { state, formAction, isPending };
}
