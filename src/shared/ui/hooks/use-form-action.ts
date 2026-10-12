'use client';

import { useActionState } from 'react';
import { toast } from 'sonner';

type FormActionState = {
    error?: string;
    success?: string;
    fieldErrors?: object;
};

export type FormActionOptions<State> = {
    onSuccess?: (state: State) => void;
    toastErrors?: boolean;
};

export function useFormAction<State extends FormActionState>(
    action: (formData: FormData) => Promise<State>,
    initialState: Awaited<State>,
    { onSuccess, toastErrors = false }: FormActionOptions<State> = {}
) {
    const [state, formAction, isPending] = useActionState<State, FormData>(
        async (_previousState, formData) => {
            const nextState = await action(formData);

            if (nextState.error || nextState.fieldErrors) {
                if (toastErrors && nextState.error) {
                    toast.error(nextState.error);
                }
                return nextState;
            }

            if (nextState.success) {
                toast.success(nextState.success);
            }
            onSuccess?.(nextState);
            return nextState;
        },
        initialState
    );

    return { state, formAction, isPending };
}
