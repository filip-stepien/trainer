'use client';

import { useTransition } from 'react';

import { signOutAction } from '../actions/sign-out';

export function useSignOut() {
    const [isPending, startTransition] = useTransition();

    function signOut() {
        startTransition(() => signOutAction());
    }

    return { signOut, isPending };
}
