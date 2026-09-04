'use client';

import { PlusIcon } from 'lucide-react';

import { Button, FieldError, Spinner } from '@/shared';

import { useAddExerciseFromCatalog } from '../hooks/use-add-exercise-from-catalog';

export function AddExerciseFromCatalogForm({ sourceExerciseId }: { sourceExerciseId: string }) {
    const { state, formAction, isPending } = useAddExerciseFromCatalog();

    return (
        <form action={formAction} className='flex flex-col items-end gap-1'>
            <input type='hidden' name='sourceExerciseId' value={sourceExerciseId} />
            <Button type='submit' variant='outline' size='sm' disabled={isPending}>
                {isPending ? (
                    <Spinner data-icon='inline-start' />
                ) : (
                    <PlusIcon data-icon='inline-start' />
                )}
                {isPending ? 'Zapisywanie…' : 'Dodaj'}
            </Button>
            {state.error ? <FieldError aria-live='polite'>{state.error}</FieldError> : null}
            {state.fieldErrors?.sourceExerciseId ? (
                <FieldError aria-live='polite'>{state.fieldErrors.sourceExerciseId}</FieldError>
            ) : null}
        </form>
    );
}
