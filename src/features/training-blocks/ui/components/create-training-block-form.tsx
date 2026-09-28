'use client';

import Link from 'next/link';

import { getClientTrainingPath } from '@/features/clients';
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

import { useCreateTrainingBlock } from '../hooks/use-create-training-block';
import { TrainingBlockFormFields } from './training-block-form-fields';

export function CreateTrainingBlockForm({
    clientId,
    clientName,
    startDate
}: {
    clientId: string;
    clientName: string;
    startDate: string;
}) {
    const { state, formAction, isPending } = useCreateTrainingBlock();

    return (
        <form action={formAction}>
            <input type='hidden' name='clientId' value={clientId} />
            <Card>
                <CardHeader>
                    <CardTitle>Nowy blok treningowy</CardTitle>
                    <CardDescription>
                        Utwórz roboczy plan dla: {clientName}. Dni i ćwiczenia dodasz w kolejnym
                        kroku.
                    </CardDescription>
                </CardHeader>
                <CardContent className='flex flex-col gap-5'>
                    <TrainingBlockFormFields
                        defaultValues={{ startDate }}
                        errors={state.fieldErrors}
                    />
                    {state.error ? <FieldError>{state.error}</FieldError> : null}
                </CardContent>
                <CardFooter className='justify-end gap-2'>
                    <Button
                        type='button'
                        variant='outline'
                        render={<Link href={getClientTrainingPath({ clientId })} />}
                        nativeButton={false}
                    >
                        Anuluj
                    </Button>
                    <Button type='submit' disabled={isPending}>
                        {isPending ? <Spinner data-icon='inline-start' /> : null}
                        {isPending ? 'Tworzenie…' : 'Utwórz blok'}
                    </Button>
                </CardFooter>
            </Card>
        </form>
    );
}
