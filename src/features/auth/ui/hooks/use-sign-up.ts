'use client';

import { useActionState } from 'react';

import { signUpAction, type SignUpActionState } from '../actions/sign-up';

const initialState: SignUpActionState = {};

export function useSignUp() {
    const [state, formAction, isPending] = useActionState(
        (_prevState: SignUpActionState, formData: FormData) => signUpAction(formData),
        initialState
    );

    return { state, formAction, isPending };
}
