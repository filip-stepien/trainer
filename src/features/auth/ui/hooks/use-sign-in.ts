'use client';

import { useActionState } from 'react';

import { signInAction, type SignInActionState } from '../actions/sign-in';

const initialState: SignInActionState = {};

export function useSignIn() {
    const [state, formAction, isPending] = useActionState(
        (_prevState: SignInActionState, formData: FormData) => signInAction(formData),
        initialState
    );

    return { state, formAction, isPending };
}
