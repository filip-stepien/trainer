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
    FieldError,
    Spinner
} from '@/shared';

import { useUpdateExercise } from '../hooks/use-update-exercise';
import type { ExerciseDetails } from '../queries/get-exercise-details-or-redirect';
import { ExerciseFormFields } from './exercise-form-fields';

function EditExerciseForm({
    exercise,
    onSaved
}: {
    exercise: ExerciseDetails;
    onSaved: () => void;
}) {
    const { state, formAction, isPending } = useUpdateExercise({ onSuccess: onSaved });

    return (
        <form action={formAction} className='flex flex-col gap-6'>
            <input type='hidden' name='exerciseId' value={exercise.id} />
            <ExerciseFormFields defaultValues={exercise} errors={state.fieldErrors} />
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

export function EditExerciseDialog({ exercise }: { exercise: ExerciseDetails }) {
    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger render={<Button variant='outline' />}>
                <PencilIcon data-icon='inline-start' />
                Edytuj
            </DialogTrigger>
            <DialogContent className='sm:max-w-lg'>
                <DialogHeader>
                    <DialogTitle>Edycja ćwiczenia</DialogTitle>
                    <DialogDescription>
                        Zmiany dotyczą biblioteki. Opublikowane wersje planów zachowają własną
                        kopię.
                    </DialogDescription>
                </DialogHeader>
                <EditExerciseForm exercise={exercise} onSaved={() => setOpen(false)} />
            </DialogContent>
        </Dialog>
    );
}
