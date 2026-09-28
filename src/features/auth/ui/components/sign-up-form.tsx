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
                        aria-invalid={Boolean(state.fieldErrors?.firstName)}
                        className='rounded-md border border-black/10 px-3 py-2 text-sm dark:border-white/20'
                    />
                    {state.fieldErrors?.firstName ? (
                        <p className='text-sm text-red-600'>{state.fieldErrors.firstName[0]}</p>
                    ) : null}
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
                        aria-invalid={Boolean(state.fieldErrors?.lastName)}
                        className='rounded-md border border-black/10 px-3 py-2 text-sm dark:border-white/20'
                    />
                    {state.fieldErrors?.lastName ? (
                        <p className='text-sm text-red-600'>{state.fieldErrors.lastName[0]}</p>
                    ) : null}
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
                    minLength={6}
                    autoComplete='new-password'
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
                {isPending ? 'Zakładanie konta…' : 'Załóż konto'}
            </button>
        </form>
    );
}
