'use client';

import { useState } from 'react';
import { PencilIcon } from 'lucide-react';

import {
    Button,
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    Field,
    FieldError,
    FieldTitle,
    Spinner,
    ToggleGroup,
    ToggleGroupItem
} from '@/shared';

import { useClientStatus } from '../hooks/use-client-status';
import { useUpdateClient } from '../hooks/use-update-client';
import { clientStatusOptions } from '../lib/status';
import type { ClientDetails } from '../queries/get-client-details-or-redirect';
import { ClientContactFields, ClientPersonalFields } from './client-form-fields';

function EditClientForm({ client, onSaved }: { client: ClientDetails; onSaved: () => void }) {
    const { state, formAction, isPending } = useUpdateClient({ onSuccess: onSaved });
    const { status, handleStatusChange } = useClientStatus({ initialStatus: client.status });

    return (
        <form action={formAction} className='flex flex-col gap-6'>
            <input type='hidden' name='clientId' value={client.id} />
            <input type='hidden' name='status' value={status} />
            <section className='flex flex-col gap-4'>
                <h3 className='text-sm font-medium'>Dane podopiecznego</h3>
                <ClientPersonalFields defaultValues={client} errors={state.fieldErrors} />
            </section>
            <section className='flex flex-col gap-4'>
                <h3 className='text-sm font-medium'>Kontakt</h3>
                <ClientContactFields defaultValues={client} errors={state.fieldErrors} />
            </section>
            <Field data-invalid={Boolean(state.fieldErrors?.status)}>
                <FieldTitle id='client-status'>Status współpracy</FieldTitle>
                <ToggleGroup
                    aria-labelledby='client-status'
                    value={[status]}
                    onValueChange={handleStatusChange}
                    variant='outline'
                    spacing={2}
                >
                    {clientStatusOptions.map(option => (
                        <ToggleGroupItem key={option.value} value={option.value}>
                            {option.label}
                        </ToggleGroupItem>
                    ))}
                </ToggleGroup>
                <FieldError>{state.fieldErrors?.status?.[0]}</FieldError>
            </Field>
            {state.error ? <FieldError>{state.error}</FieldError> : null}
            <DialogFooter>
                <DialogClose render={<Button variant='outline' />}>Anuluj</DialogClose>
                <Button type='submit' disabled={isPending}>
                    {isPending ? <Spinner data-icon='inline-start' /> : null}
                    {isPending ? 'Zapisywanie…' : 'Zapisz zmiany'}
                </Button>
            </DialogFooter>
        </form>
    );
}

export function EditClientDialog({ client }: { client: ClientDetails }) {
    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger render={<Button variant='outline' />}>
                <PencilIcon data-icon='inline-start' />
                Edytuj dane
            </DialogTrigger>
            <DialogContent className='sm:max-w-lg'>
                <DialogHeader>
                    <DialogTitle>Edycja podopiecznego</DialogTitle>
                    <DialogDescription>
                        Zmień dane kontaktowe lub aktualny status współpracy.
                    </DialogDescription>
                </DialogHeader>
                <EditClientForm client={client} onSaved={() => setOpen(false)} />
            </DialogContent>
        </Dialog>
    );
}
