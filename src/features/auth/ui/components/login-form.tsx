'use client';

import Link from 'next/link';

import {
    Button,
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    Field,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,
    Input,
    Spinner
} from '@/shared';

import { useSignIn } from '../hooks/use-sign-in';
import { getSignUpPath } from '../lib/routes';

export function LoginForm() {
    const { state, formAction, isPending } = useSignIn();

    return (
        <Card>
            <CardHeader className='text-center'>
                <CardTitle className='text-xl'>Witaj ponownie</CardTitle>
                <CardDescription>Zaloguj się, aby przejść do panelu trenera.</CardDescription>
            </CardHeader>
            <CardContent>
                <form action={formAction}>
                    <FieldGroup>
                        <Field data-invalid={Boolean(state.fieldErrors?.email)}>
                            <FieldLabel htmlFor='email'>E-mail</FieldLabel>
                            <Input
                                id='email'
                                name='email'
                                type='email'
                                required
                                autoComplete='email'
                                placeholder='trener@example.com'
                                aria-invalid={Boolean(state.fieldErrors?.email)}
                            />
                            <FieldError>{state.fieldErrors?.email?.[0]}</FieldError>
                        </Field>
                        <Field data-invalid={Boolean(state.fieldErrors?.password)}>
                            <FieldLabel htmlFor='password'>Hasło</FieldLabel>
                            <Input
                                id='password'
                                name='password'
                                type='password'
                                required
                                autoComplete='current-password'
                                aria-invalid={Boolean(state.fieldErrors?.password)}
                            />
                            <FieldError>{state.fieldErrors?.password?.[0]}</FieldError>
                        </Field>
                        {state.error ? <FieldError>{state.error}</FieldError> : null}
                        <Field>
                            <Button type='submit' disabled={isPending}>
                                {isPending ? <Spinner data-icon='inline-start' /> : null}
                                {isPending ? 'Logowanie…' : 'Zaloguj się'}
                            </Button>
                            <FieldDescription className='text-center'>
                                Nie masz konta? <Link href={getSignUpPath()}>Zarejestruj się</Link>
                            </FieldDescription>
                        </Field>
                    </FieldGroup>
                </form>
            </CardContent>
        </Card>
    );
}
