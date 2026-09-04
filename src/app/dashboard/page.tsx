import { Suspense } from 'react';
import Link from 'next/link';

import { signOutAction } from '@/features/auth';
import { getAuthenticatedUserOrRedirect } from '@/features/auth/server';
import { getClientListPath } from '@/features/clients';
import { getExerciseListPath } from '@/features/exercises';
import { Button } from '@/shared';

export default function DashboardPage() {
    return (
        <main className='mx-auto flex min-h-svh max-w-sm flex-col justify-center gap-6 px-4'>
            <h1 className='text-xl font-semibold'>Panel trenera</h1>
            <Suspense fallback={<DashboardAccountFallback />}>
                <DashboardAccount />
            </Suspense>
        </main>
    );
}

async function DashboardAccount() {
    const user = await getAuthenticatedUserOrRedirect();

    return (
        <>
            <p className='text-sm text-black/60 dark:text-white/60'>
                Zalogowano jako <span className='font-medium'>{user.name}</span> ({user.email})
            </p>
            <Button render={<Link href={getClientListPath()} />} nativeButton={false}>
                Podopieczni
            </Button>
            <Button
                variant='outline'
                render={<Link href={getExerciseListPath()} />}
                nativeButton={false}
            >
                Biblioteka ćwiczeń
            </Button>
            <form action={signOutAction}>
                <button
                    type='submit'
                    className='rounded-md border border-black/10 px-3 py-2 text-sm font-medium dark:border-white/20'
                >
                    Wyloguj się
                </button>
            </form>
        </>
    );
}

function DashboardAccountFallback() {
    return <p className='text-sm text-black/60 dark:text-white/60'>Ładowanie…</p>;
}
