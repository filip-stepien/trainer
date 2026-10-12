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

import { useSignUp } from '../hooks/use-sign-up';
import { getLoginPath } from '../lib/routes';

export function SignUpForm() {
    const { state, formAction, isPending } = useSignUp();

    return (
        <Card>
            <CardHeader className='text-center'>
                <CardTitle className='text-xl'>Załóż konto trenera</CardTitle>
                <CardDescription>Kilka danych i możesz zacząć planować treningi.</CardDescription>
            </CardHeader>
            <CardContent>
                <form action={formAction}>
                    <FieldGroup>
                        <div className='grid gap-4 sm:grid-cols-2'>
                            <Field data-invalid={Boolean(state.fieldErrors?.firstName)}>
                                <FieldLabel htmlFor='firstName'>Imię</FieldLabel>
                                <Input
                                    id='firstName'
                                    name='firstName'
                                    type='text'
                                    required
                                    autoComplete='given-name'
                                    aria-invalid={Boolean(state.fieldErrors?.firstName)}
                                />
                                <FieldError>{state.fieldErrors?.firstName?.[0]}</FieldError>
                            </Field>
                            <Field data-invalid={Boolean(state.fieldErrors?.lastName)}>
                                <FieldLabel htmlFor='lastName'>Nazwisko</FieldLabel>
                                <Input
                                    id='lastName'
                                    name='lastName'
                                    type='text'
                                    required
                                    autoComplete='family-name'
                                    aria-invalid={Boolean(state.fieldErrors?.lastName)}
                                />
                                <FieldError>{state.fieldErrors?.lastName?.[0]}</FieldError>
                            </Field>
                        </div>
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
                                minLength={6}
                                autoComplete='new-password'
                                aria-invalid={Boolean(state.fieldErrors?.password)}
                            />
                            <FieldDescription>Co najmniej 6 znaków.</FieldDescription>
                            <FieldError>{state.fieldErrors?.password?.[0]}</FieldError>
                        </Field>
                        {state.error ? <FieldError>{state.error}</FieldError> : null}
                        <Field>
                            <Button type='submit' disabled={isPending}>
                                {isPending ? <Spinner data-icon='inline-start' /> : null}
                                {isPending ? 'Zakładanie konta…' : 'Załóż konto'}
                            </Button>
                            <FieldDescription className='text-center'>
                                Masz już konto? <Link href={getLoginPath()}>Zaloguj się</Link>
                            </FieldDescription>
                        </Field>
                    </FieldGroup>
                </form>
            </CardContent>
        </Card>
    );
}
