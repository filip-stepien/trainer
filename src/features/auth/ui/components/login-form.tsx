'use client';

import { useSignIn } from '../hooks/use-sign-in';

export function LoginForm() {
    const { state, formAction, isPending } = useSignIn();

    return (
        <form action={formAction} className='flex w-full max-w-sm flex-col gap-4'>
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
                    aria-invalid={Boolean(state.fieldErrors?.email)}
                    className='rounded-md border border-black/10 px-3 py-2 text-sm dark:border-white/20'
                />
                {state.fieldErrors?.email ? (
                    <p className='text-sm text-red-600'>{state.fieldErrors.email[0]}</p>
                ) : null}
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
                    autoComplete='current-password'
                    aria-invalid={Boolean(state.fieldErrors?.password)}
                    className='rounded-md border border-black/10 px-3 py-2 text-sm dark:border-white/20'
                />
                {state.fieldErrors?.password ? (
                    <p className='text-sm text-red-600'>{state.fieldErrors.password[0]}</p>
                ) : null}
            </div>
            {state.error ? <p className='text-sm text-red-600'>{state.error}</p> : null}
            <button
                type='submit'
                disabled={isPending}
                className='bg-foreground text-background rounded-md px-3 py-2 text-sm font-medium disabled:opacity-50'
            >
                {isPending ? 'Logowanie…' : 'Zaloguj się'}
            </button>
        </form>
    );
}
