'use client';

import { ArchiveIcon, ArchiveRestoreIcon } from 'lucide-react';

import { Button, Spinner, cn } from '@/shared';

import {
    type ExerciseStatus,
    getOppositeExerciseStatus,
    isExerciseArchived
} from '../../domain/exercise';
import { useSetExerciseStatus } from '../hooks/use-set-exercise-status';

export function ExerciseStatusForm({
    exerciseId,
    status,
    variant = 'outline',
    className
}: {
    exerciseId: string;
    status: ExerciseStatus;
    variant?: 'outline' | 'ghost';
    className?: string;
}) {
    const { formAction, isPending } = useSetExerciseStatus();
    const archived = isExerciseArchived({ status });

    return (
        <form action={formAction} className={cn('flex', className)}>
            <input type='hidden' name='exerciseId' value={exerciseId} />
            <input type='hidden' name='status' value={getOppositeExerciseStatus({ status })} />
            <Button type='submit' variant={variant} size='sm' disabled={isPending}>
                {isPending ? (
                    <Spinner data-icon='inline-start' />
                ) : archived ? (
                    <ArchiveRestoreIcon data-icon='inline-start' />
                ) : (
                    <ArchiveIcon data-icon='inline-start' />
                )}
                {archived ? 'Przywróć' : 'Archiwizuj'}
            </Button>
        </form>
    );
}
