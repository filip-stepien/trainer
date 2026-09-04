'use client';

import Link from 'next/link';

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

import { useCreateExercise } from '../hooks/use-create-exercise';
import { getExerciseListPath } from '../lib/routes';
import { ExerciseFormFields } from './exercise-form-fields';

export function CreateExerciseForm() {
    const { state, formAction, isPending } = useCreateExercise();

    return (
        <form action={formAction}>
            <Card>
                <CardHeader>
                    <CardTitle>Nowe ćwiczenie</CardTitle>
                    <CardDescription>
                        Dodaj definicję, którą wykorzystasz później w wielu planach treningowych.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <ExerciseFormFields errors={state.fieldErrors} />
                    {state.error ? <FieldError className='mt-5'>{state.error}</FieldError> : null}
                </CardContent>
                <CardFooter className='justify-end gap-2'>
                    <Button
                        type='button'
                        variant='outline'
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
            </Card>
        </form>
    );
}
