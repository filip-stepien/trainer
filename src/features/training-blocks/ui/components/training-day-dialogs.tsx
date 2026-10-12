'use client';

import {
    Button,
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    FieldError,
    Spinner
} from '@/shared';

import { useCreateTrainingDay } from '../hooks/use-create-training-day';
import { useUpdateTrainingDay } from '../hooks/use-update-training-day';
import type { TrainingDayDetails } from '../queries/get-training-block-details-or-redirect';
import { TrainingDayFormFields } from './training-day-form-fields';

function TrainingDayDialogFooter({
    isPending,
    submitLabel,
    pendingLabel
}: {
    isPending: boolean;
    submitLabel: string;
    pendingLabel: string;
}) {
    return (
        <DialogFooter>
            <DialogClose render={<Button variant='outline' />}>Anuluj</DialogClose>
            <Button type='submit' disabled={isPending}>
                {isPending ? <Spinner data-icon='inline-start' /> : null}
                {isPending ? pendingLabel : submitLabel}
            </Button>
        </DialogFooter>
    );
}

function CreateTrainingDayForm({
    trainingBlockId,
    onCreated
}: {
    trainingBlockId: string;
    onCreated: () => void;
}) {
    const { state, formAction, isPending } = useCreateTrainingDay({ onSuccess: onCreated });

    return (
        <form action={formAction} className='grid gap-4'>
            <input type='hidden' name='trainingBlockId' value={trainingBlockId} />
            <TrainingDayFormFields
                fieldIdPrefix='new-training-day'
                errors={state.fieldErrors}
                autoFocus
            />
            {state.error ? <FieldError>{state.error}</FieldError> : null}
            <TrainingDayDialogFooter
                isPending={isPending}
                submitLabel='Dodaj dzień'
                pendingLabel='Dodawanie…'
            />
        </form>
    );
}

function EditTrainingDayForm({
    trainingBlockId,
    trainingDay,
    onSaved
}: {
    trainingBlockId: string;
    trainingDay: TrainingDayDetails;
    onSaved: () => void;
}) {
    const { state, formAction, isPending } = useUpdateTrainingDay({ onSuccess: onSaved });

    return (
        <form action={formAction} className='grid gap-4'>
            <input type='hidden' name='trainingBlockId' value={trainingBlockId} />
            <input type='hidden' name='trainingDayId' value={trainingDay.id} />
            <TrainingDayFormFields
                fieldIdPrefix={`training-day-${trainingDay.id}`}
                defaultValues={trainingDay}
                errors={state.fieldErrors}
                autoFocus
            />
            {state.error ? <FieldError>{state.error}</FieldError> : null}
            <TrainingDayDialogFooter
                isPending={isPending}
                submitLabel='Zapisz dzień'
                pendingLabel='Zapisywanie…'
            />
        </form>
    );
}

export function CreateTrainingDayDialog({
    open,
    onOpenChange,
    trainingBlockId
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    trainingBlockId: string;
}) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className='sm:max-w-md'>
                <DialogHeader>
                    <DialogTitle>Nowy dzień treningowy</DialogTitle>
                    <DialogDescription>
                        Nazwij dzień i opcjonalnie opisz jego cel. Ćwiczenia dodasz zaraz potem.
                    </DialogDescription>
                </DialogHeader>
                <CreateTrainingDayForm
                    trainingBlockId={trainingBlockId}
                    onCreated={() => onOpenChange(false)}
                />
            </DialogContent>
        </Dialog>
    );
}

export function EditTrainingDayDialog({
    open,
    onOpenChange,
    trainingBlockId,
    trainingDay
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    trainingBlockId: string;
    trainingDay: TrainingDayDetails;
}) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className='sm:max-w-md'>
                <DialogHeader>
                    <DialogTitle>Edycja dnia</DialogTitle>
                    <DialogDescription>Zmień nazwę lub opis dnia treningowego.</DialogDescription>
                </DialogHeader>
                <EditTrainingDayForm
                    trainingBlockId={trainingBlockId}
                    trainingDay={trainingDay}
                    onSaved={() => onOpenChange(false)}
                />
            </DialogContent>
        </Dialog>
    );
}
