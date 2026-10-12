'use client';

import { useFormAction } from '@/shared/client';

import { signInAction, type SignInActionState } from '../actions/sign-in';

const initialState: SignInActionState = {};

export function useSignIn() {
    return useFormAction(signInAction, initialState);
}
