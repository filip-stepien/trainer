'use client';

import { useActionState } from 'react';

import { createClientAction, type CreateClientActionState } from '../actions/create-client';

const initialState: CreateClientActionState = {};

export function useCreateClient() {
    const [state, formAction, isPending] = useActionState(
        (_prevState: CreateClientActionState, formData: FormData) => createClientAction(formData),
        initialState
    );

    return { state, formAction, isPending };
}
