import Link from 'next/link';
import { CalendarDaysIcon, DumbbellIcon, UsersIcon, type LucideIcon } from 'lucide-react';

import { getLoginPath, getSignUpPath } from '@/features/auth';
import { buttonVariants } from '@/shared';

import { AppLogo } from './_components/app-logo';

const highlights: { icon: LucideIcon; title: string; description: string }[] = [
    {
        icon: UsersIcon,
        title: 'Podopieczni w jednym miejscu',
        description: 'Kontakt i status współpracy zawsze pod ręką.'
    },
    {
        icon: DumbbellIcon,
        title: 'Własna biblioteka ćwiczeń',
        description: 'Instrukcje i materiały wideo gotowe do użycia w planach.'
    },
    {
        icon: CalendarDaysIcon,
        title: 'Bloki treningowe krok po kroku',
        description: 'Dni, rozgrzewka i część główna ułożone bez chaosu.'
    }
];

export default function Home() {
    return (
        <main className='bg-muted flex min-h-svh flex-col items-center justify-center gap-10 p-6 md:p-10'>
            <div className='flex max-w-xl flex-col items-center gap-6 text-center'>
                <AppLogo />
                <h1 className='text-3xl font-semibold tracking-tight text-balance md:text-4xl'>
                    Planuj treningi podopiecznych szybko i czytelnie
                </h1>
                <div className='flex flex-wrap justify-center gap-3'>
                    <Link href={getLoginPath()} className={buttonVariants({ size: 'lg' })}>
                        Zaloguj się
                    </Link>
                    <Link
                        href={getSignUpPath()}
                        className={buttonVariants({ variant: 'outline', size: 'lg' })}
                    >
                        Załóż konto
                    </Link>
                </div>
            </div>
            <ul className='grid w-full max-w-4xl gap-4 md:grid-cols-3'>
                {highlights.map(highlight => (
                    <li
                        key={highlight.title}
                        className='bg-card ring-foreground/10 flex flex-col gap-2 rounded-xl p-4 ring-1'
                    >
                        <highlight.icon className='size-5' />
                        <span className='text-sm font-medium'>{highlight.title}</span>
                        <span className='text-muted-foreground text-sm'>
                            {highlight.description}
                        </span>
                    </li>
                ))}
            </ul>
        </main>
    );
}
