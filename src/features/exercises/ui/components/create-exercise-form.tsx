'use client';

import Link from 'next/link';

import { Button, Card, CardContent, CardFooter, FieldError, Spinner } from '@/shared';

import { useCreateExercise } from '../hooks/use-create-exercise';
import { getExerciseListPath } from '../lib/routes';
import { ExerciseFormFields } from './exercise-form-fields';

export function CreateExerciseForm() {
    const { state, formAction, isPending } = useCreateExercise();

    return (
        <Card>
            <form action={formAction} className='flex flex-col gap-4'>
                <CardContent className='flex flex-col gap-6'>
                    <ExerciseFormFields errors={state.fieldErrors} />
                    {state.error ? <FieldError>{state.error}</FieldError> : null}
                </CardContent>
                <CardFooter className='justify-between gap-2'>
                    <Button
                        variant='ghost'
                        render={<Link href={getExerciseListPath()} />}
                        nativeButton={false}
                    >
                        Anuluj
                    </Button>
                    <Button type='submit' disabled={isPending}>
                        {isPending ? <Spinner data-icon='inline-start' /> : null}
                        {isPending ? 'Dodawanie…' : 'Dodaj ćwiczenie'}
                    </Button>
                </CardFooter>
            </form>
        </Card>
    );
}
