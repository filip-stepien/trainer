'use client';

import { type FormActionOptions, useFormAction } from '@/shared/client';

import { updateClientAction, type UpdateClientActionState } from '../actions/update-client';

const initialState: UpdateClientActionState = {};

export function useUpdateClient(options?: FormActionOptions<UpdateClientActionState>) {
    return useFormAction(updateClientAction, initialState, options);
}
