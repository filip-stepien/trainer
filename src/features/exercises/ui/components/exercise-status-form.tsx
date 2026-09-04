'use client';

import { ArchiveIcon, ArchiveRestoreIcon } from 'lucide-react';

import { Button, FieldError, Spinner } from '@/shared';

import { ExerciseStatus, type ExerciseStatus as ExerciseStatusValue } from '../../domain/exercise';
import { useSetExerciseStatus } from '../hooks/use-set-exercise-status';

export function ExerciseStatusForm({
    exerciseId,
    status
}: {
    exerciseId: string;
    status: ExerciseStatusValue;
}) {
    const { state, formAction, isPending } = useSetExerciseStatus();
    const archived = status === ExerciseStatus.Archived;
    const nextStatus = archived ? ExerciseStatus.Active : ExerciseStatus.Archived;
    const label = archived ? 'Przywróć' : 'Archiwizuj';

    return (
        <form action={formAction} className='flex flex-col items-end gap-1'>
            <input type='hidden' name='exerciseId' value={exerciseId} />
            <input type='hidden' name='status' value={nextStatus} />
            <Button type='submit' variant='outline' size='sm' disabled={isPending}>
                {isPending ? (
                    <Spinner data-icon='inline-start' />
                ) : archived ? (
                    <ArchiveRestoreIcon data-icon='inline-start' />
                ) : (
                    <ArchiveIcon data-icon='inline-start' />
                )}
                {isPending ? 'Zapisywanie…' : label}
            </Button>
            {state.error ? <FieldError aria-live='polite'>{state.error}</FieldError> : null}
        </form>
    );
}
