'use client';

import { useState } from 'react';
import { Settings2Icon } from 'lucide-react';

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

import { useTrainingBlockEndDate } from '../hooks/use-training-block-end-date';
import { useUpdateTrainingBlock } from '../hooks/use-update-training-block';
import type { TrainingBlockDetails } from '../queries/get-training-block-details-or-redirect';
import { TrainingBlockBasicsFields, TrainingBlockPlanFields } from './training-block-form-fields';

function EditTrainingBlockForm({
    trainingBlock,
    onSaved
}: {
    trainingBlock: TrainingBlockDetails;
    onSaved: () => void;
}) {
    const { state, formAction, isPending } = useUpdateTrainingBlock({ onSuccess: onSaved });
    const { estimatedEndDate, handleFormChange } = useTrainingBlockEndDate({
        startDate: trainingBlock.startDate,
        durationWeeks: trainingBlock.durationWeeks
    });

    return (
        <form action={formAction} onChange={handleFormChange} className='flex flex-col gap-6'>
            <input type='hidden' name='trainingBlockId' value={trainingBlock.id} />
            <TrainingBlockBasicsFields defaultValues={trainingBlock} errors={state.fieldErrors} />
            <TrainingBlockPlanFields
                defaultValues={trainingBlock}
                errors={state.fieldErrors}
                estimatedEndDate={estimatedEndDate}
            />
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

export function EditTrainingBlockDialog({
    trainingBlock
}: {
    trainingBlock: TrainingBlockDetails;
}) {
    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger render={<Button variant='outline' />}>
                <Settings2Icon data-icon='inline-start' />
                Ustawienia bloku
            </DialogTrigger>
            <DialogContent className='sm:max-w-lg'>
                <DialogHeader>
                    <DialogTitle>Ustawienia bloku</DialogTitle>
                </DialogHeader>
                <EditTrainingBlockForm
                    trainingBlock={trainingBlock}
                    onSaved={() => setOpen(false)}
                />
            </DialogContent>
        </Dialog>
    );
}
