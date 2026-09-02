import Link from 'next/link';

import { getLoginPath, SignUpForm } from '@/features/auth';

export default function SignUpPage() {
    return (
        <main className='mx-auto flex min-h-svh max-w-sm flex-col justify-center gap-6 px-4'>
            <h1 className='text-xl font-semibold'>Załóż konto</h1>
            <SignUpForm />
            <p className='text-sm text-black/60 dark:text-white/60'>
                Masz już konto?{' '}
                <Link href={getLoginPath()} className='underline'>
                    Zaloguj się
                </Link>
            </p>
        </main>
    );
}
