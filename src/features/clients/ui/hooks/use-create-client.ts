'use client';

import { useFormAction } from '@/shared/client';

import { createClientAction, type CreateClientActionState } from '../actions/create-client';

const initialState: CreateClientActionState = {};

export function useCreateClient() {
    return useFormAction(createClientAction, initialState);
}
