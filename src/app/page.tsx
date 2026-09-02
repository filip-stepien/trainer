import Link from 'next/link';

import { getLoginPath, getSignUpPath } from '@/features/auth';

export default function Home() {
    return (
        <main className='mx-auto flex min-h-svh max-w-sm flex-col items-center justify-center gap-6 px-4 text-center'>
            <h1 className='text-2xl font-semibold'>Trainer</h1>
            <p className='text-sm text-black/60 dark:text-white/60'>
                Minimalny szkielet Next.js + Neon Auth (architektura heksagonalna, podział
                feature-based).
            </p>
            <div className='flex gap-4 text-sm font-medium'>
                <Link
                    href={getLoginPath()}
                    className='bg-foreground text-background rounded-md px-4 py-2'
                >
                    Zaloguj się
                </Link>
                <Link
                    href={getSignUpPath()}
                    className='rounded-md border border-black/10 px-4 py-2 dark:border-white/20'
                >
                    Załóż konto
                </Link>
            </div>
        </main>
    );
}
