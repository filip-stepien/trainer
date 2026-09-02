import Link from 'next/link';

import { getSignUpPath, LoginForm } from '@/features/auth';

export default function LoginPage() {
    return (
        <main className='mx-auto flex min-h-svh max-w-sm flex-col justify-center gap-6 px-4'>
            <h1 className='text-xl font-semibold'>Zaloguj się</h1>
            <LoginForm />
            <p className='text-sm text-black/60 dark:text-white/60'>
                Nie masz konta?{' '}
                <Link href={getSignUpPath()} className='underline'>
                    Zarejestruj się
                </Link>
            </p>
        </main>
    );
}
