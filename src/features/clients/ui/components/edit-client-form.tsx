'use client';

import {
    Button,
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
    Field,
    FieldError,
    FieldTitle,
    Spinner,
    ToggleGroup,
    ToggleGroupItem
} from '@/shared';

import { ClientStatus } from '../../domain/client';
import { useClientStatus } from '../hooks/use-client-status';
import { useUpdateClient } from '../hooks/use-update-client';
import type { ClientDetails } from '../queries/get-client-details-or-redirect';
import { ClientFormFields } from './client-form-fields';

export function EditClientForm({ client }: { client: ClientDetails }) {
    const { state, formAction, isPending } = useUpdateClient();
    const { status, handleStatusChange } = useClientStatus({ initialStatus: client.status });

    return (
        <form action={formAction}>
            <input type='hidden' name='clientId' value={client.id} />
            <input type='hidden' name='status' value={status} />
            <Card>
                <CardHeader>
                    <CardTitle>Edycja danych</CardTitle>
                    <CardDescription>
                        Zmień dane kontaktowe lub aktualny status współpracy.
                    </CardDescription>
                </CardHeader>
                <CardContent className='flex flex-col gap-5'>
                    <ClientFormFields defaultValues={client} errors={state.fieldErrors} />
                    <Field data-invalid={Boolean(state.fieldErrors?.status)}>
                        <FieldTitle id='client-status'>Status współpracy</FieldTitle>
                        <ToggleGroup
                            aria-labelledby='client-status'
                            value={[status]}
                            onValueChange={handleStatusChange}
                            variant='outline'
                            spacing={2}
                        >
                            <ToggleGroupItem value={ClientStatus.Active}>Aktywna</ToggleGroupItem>
                            <ToggleGroupItem value={ClientStatus.Paused}>
                                Wstrzymana
                            </ToggleGroupItem>
                            <ToggleGroupItem value={ClientStatus.Ended}>Zakończona</ToggleGroupItem>
                        </ToggleGroup>
                        <FieldError>{state.fieldErrors?.status?.[0]}</FieldError>
                    </Field>
                    {state.error ? <FieldError>{state.error}</FieldError> : null}
                    {state.success ? (
                        <p className='text-muted-foreground text-sm' aria-live='polite'>
                            {state.success}
                        </p>
                    ) : null}
                </CardContent>
                <CardFooter className='justify-end'>
                    <Button type='submit' disabled={isPending}>
                        {isPending ? <Spinner data-icon='inline-start' /> : null}
                        {isPending ? 'Zapisywanie…' : 'Zapisz zmiany'}
                    </Button>
                </CardFooter>
            </Card>
        </form>
    );
}
