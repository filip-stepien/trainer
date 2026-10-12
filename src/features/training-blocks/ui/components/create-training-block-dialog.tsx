'use client';

import { useState } from 'react';
import { PlusIcon } from 'lucide-react';

import {
    Button,
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    FieldError,
    Spinner
} from '@/shared';

import { useCreateTrainingBlock } from '../hooks/use-create-training-block';
import { useTrainingBlockEndDate } from '../hooks/use-training-block-end-date';
import { TrainingBlockBasicsFields, TrainingBlockPlanFields } from './training-block-form-fields';

function CreateTrainingBlockForm({ clientId, startDate }: { clientId: string; startDate: string }) {
    const { state, formAction, isPending } = useCreateTrainingBlock();
    const { estimatedEndDate, handleFormChange } = useTrainingBlockEndDate({
        startDate,
        durationWeeks: null
    });

    return (
        <form action={formAction} onChange={handleFormChange} className='flex flex-col gap-6'>
            <input type='hidden' name='clientId' value={clientId} />
            <TrainingBlockBasicsFields defaultValues={{ startDate }} errors={state.fieldErrors} />
            <TrainingBlockPlanFields
                errors={state.fieldErrors}
                estimatedEndDate={estimatedEndDate}
            />
            {state.error ? <FieldError>{state.error}</FieldError> : null}
            <DialogFooter>
                <DialogClose render={<Button variant='outline' />}>Anuluj</DialogClose>
                <Button type='submit' disabled={isPending}>
                    {isPending ? <Spinner data-icon='inline-start' /> : null}
                    {isPending ? 'Tworzenie…' : 'Utwórz blok'}
                </Button>
            </DialogFooter>
        </form>
    );
}

export function CreateTrainingBlockDialog({
    clientId,
    startDate
}: {
    clientId: string;
    startDate: string;
}) {
    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger render={<Button />}>
                <PlusIcon data-icon='inline-start' />
                Nowy blok
            </DialogTrigger>
            <DialogContent className='sm:max-w-lg'>
                <DialogHeader>
                    <DialogTitle>Nowy blok treningowy</DialogTitle>
                </DialogHeader>
                <CreateTrainingBlockForm clientId={clientId} startDate={startDate} />
            </DialogContent>
        </Dialog>
    );
}
