'use client';

import { useFormAction } from '@/shared/client';

import { signUpAction, type SignUpActionState } from '../actions/sign-up';

const initialState: SignUpActionState = {};

export function useSignUp() {
    return useFormAction(signUpAction, initialState);
}
