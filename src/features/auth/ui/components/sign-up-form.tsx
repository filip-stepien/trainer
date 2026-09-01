'use client';

import { useSignUp } from '../hooks/use-sign-up';

export function SignUpForm() {
    const { state, formAction, isPending } = useSignUp();

    return (
        <form action={formAction} className='flex w-full max-w-sm flex-col gap-4'>
            <div className='flex gap-4'>
                <div className='flex flex-1 flex-col gap-1'>
                    <label htmlFor='firstName' className='text-sm font-medium'>
                        Imię
                    </label>
                    <input
                        id='firstName'
                        name='firstName'
                        type='text'
                        required
                        autoComplete='given-name'
                        className='rounded-md border border-black/10 px-3 py-2 text-sm dark:border-white/20'
                    />
                </div>
                <div className='flex flex-1 flex-col gap-1'>
                    <label htmlFor='lastName' className='text-sm font-medium'>
                        Nazwisko
                    </label>
                    <input
                        id='lastName'
                        name='lastName'
                        type='text'
                        required
                        autoComplete='family-name'
                        className='rounded-md border border-black/10 px-3 py-2 text-sm dark:border-white/20'
                    />
                </div>
            </div>
            <div className='flex flex-col gap-1'>
                <label htmlFor='email' className='text-sm font-medium'>
                    E-mail
                </label>
                <input
                    id='email'
                    name='email'
                    type='email'
                    required
                    autoComplete='email'
                    className='rounded-md border border-black/10 px-3 py-2 text-sm dark:border-white/20'
                />
            </div>
            <div className='flex flex-col gap-1'>
                <label htmlFor='password' className='text-sm font-medium'>
                    Hasło
                </label>
                <input
                    id='password'
                    name='password'
                    type='password'
                    required
                    minLength={6}
                    autoComplete='new-password'
                    className='rounded-md border border-black/10 px-3 py-2 text-sm dark:border-white/20'
                />
            </div>
            {state.error ? <p className='text-sm text-red-600'>{state.error}</p> : null}
            <button
                type='submit'
                disabled={isPending}
                className='bg-foreground text-background rounded-md px-3 py-2 text-sm font-medium disabled:opacity-50'
            >
                {isPending ? 'Zakładanie konta…' : 'Załóż konto'}
            </button>
        </form>
    );
}
