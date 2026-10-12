'use client';

import { PlusIcon } from 'lucide-react';

import { Button, Spinner, cn } from '@/shared';

import { useAddExerciseFromCatalog } from '../hooks/use-add-exercise-from-catalog';

export function AddExerciseFromCatalogForm({
    sourceExerciseId,
    className
}: {
    sourceExerciseId: string;
    className?: string;
}) {
    const { formAction, isPending } = useAddExerciseFromCatalog();

    return (
        <form action={formAction} className={cn('flex', className)}>
            <input type='hidden' name='sourceExerciseId' value={sourceExerciseId} />
            <Button type='submit' size='sm' disabled={isPending}>
                {isPending ? (
                    <Spinner data-icon='inline-start' />
                ) : (
                    <PlusIcon data-icon='inline-start' />
                )}
                {isPending ? 'Dodawanie…' : 'Dodaj do biblioteki'}
            </Button>
        </form>
    );
}
