import type { ReactNode } from 'react';
import Link from 'next/link';

import { getHomePath } from '@/features/auth';

import { AppLogo } from '../_components/app-logo';

export default function AuthLayout({ children }: { children: ReactNode }) {
    return (
        <div className='bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10'>
            <div className='flex w-full max-w-sm flex-col gap-6'>
                <Link href={getHomePath()} className='self-center'>
                    <AppLogo />
                </Link>
                {children}
            </div>
        </div>
    );
}
