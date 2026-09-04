'use client';

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

import { useUpdateExercise } from '../hooks/use-update-exercise';
import type { ExerciseDetails } from '../queries/get-exercise-details-or-redirect';
import { ExerciseFormFields } from './exercise-form-fields';

export function EditExerciseForm({ exercise }: { exercise: ExerciseDetails }) {
    const { state, formAction, isPending } = useUpdateExercise();

    return (
        <form action={formAction}>
            <input type='hidden' name='exerciseId' value={exercise.id} />
            <Card>
                <CardHeader>
                    <CardTitle>Edycja ćwiczenia</CardTitle>
                    <CardDescription>
                        Zmiany dotyczą biblioteki. Opublikowane wersje planów zachowają własny
                        snapshot.
                    </CardDescription>
                </CardHeader>
                <CardContent className='flex flex-col gap-5'>
                    <ExerciseFormFields defaultValues={exercise} errors={state.fieldErrors} />
                    {state.error ? <FieldError>{state.error}</FieldError> : null}
                    {state.success ? (
                        <p className='text-muted-foreground text-sm' aria-live='polite'>
                            {state.success}
                        </p>
                    ) : null}
                </CardContent>
                <CardFooter className='justify-end'>
                    <Button type='submit' disabled={isPending}>
                        {isPending ? <Spinner data-icon='inline-start' /> : null}
                        {isPending ? 'Zapisywanie…' : 'Zapisz zmiany'}
                    </Button>
                </CardFooter>
            </Card>
        </form>
    );
}
