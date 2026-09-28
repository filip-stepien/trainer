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

import { useCreateTrainingDay } from '../hooks/use-create-training-day';
import { TrainingDayFormFields } from './training-day-form-fields';

export function CreateTrainingDayForm({ trainingBlockId }: { trainingBlockId: string }) {
    const { state, formAction, isPending } = useCreateTrainingDay();

    return (
        <form action={formAction}>
            <input type='hidden' name='trainingBlockId' value={trainingBlockId} />
            <Card>
                <CardHeader>
                    <CardTitle>Dodaj dzień treningowy</CardTitle>
                    <CardDescription>
                        Najpierw opisz dzień. Rozgrzewkę i część główną ułożysz z ćwiczeń wewnątrz
                        utworzonego dnia.
                    </CardDescription>
                </CardHeader>
                <CardContent className='flex flex-col gap-5'>
                    <TrainingDayFormFields
                        fieldIdPrefix='new-training-day'
                        errors={state.fieldErrors}
                    />
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
                        {isPending ? 'Dodawanie…' : 'Dodaj dzień'}
                    </Button>
                </CardFooter>
            </Card>
        </form>
    );
}
