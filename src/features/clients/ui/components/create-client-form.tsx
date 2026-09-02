'use client';

import Link from 'next/link';

import {
    Button,
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
    FieldError,
    Spinner
} from '@/shared';

import { useCreateClient } from '../hooks/use-create-client';
import { getClientListPath } from '../lib/routes';
import { ClientFormFields } from './client-form-fields';

export function CreateClientForm({ startedAt }: { startedAt: string }) {
    const { state, formAction, isPending } = useCreateClient();

    return (
        <form action={formAction}>
            <Card>
                <CardHeader>
                    <CardTitle>Nowy podopieczny</CardTitle>
                    <CardDescription>
                        Dodaj podstawowe dane kontaktowe. Konto logowania można powiązać później.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <ClientFormFields defaultValues={{ startedAt }} errors={state.fieldErrors} />
                    {state.error ? <FieldError className='mt-5'>{state.error}</FieldError> : null}
                </CardContent>
                <CardFooter className='justify-end gap-2'>
                    <Button
                        type='button'
                        variant='outline'
                        render={<Link href={getClientListPath()} />}
                        nativeButton={false}
                    >
                        Anuluj
                    </Button>
                    <Button type='submit' disabled={isPending}>
                        {isPending ? <Spinner data-icon='inline-start' /> : null}
                        {isPending ? 'Dodawanie…' : 'Dodaj podopiecznego'}
                    </Button>
                </CardFooter>
            </Card>
        </form>
    );
}
