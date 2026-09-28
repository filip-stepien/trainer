'use client';

import Link from 'next/link';
import { PlusIcon } from 'lucide-react';

import { getExerciseListPath } from '@/features/exercises';
import {
    Button,
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
    Field,
    FieldError,
    FieldGroup,
    FieldLabel,
    NativeSelect,
    NativeSelectOption,
    Spinner
} from '@/shared';

import { TrainingDayExerciseSection } from '../../domain/training-day-exercise';
import { useAddTrainingDayExercise } from '../hooks/use-add-training-day-exercise';
import type { ExerciseOption } from '../queries/get-training-block-details-or-redirect';
import { TrainingDayExercisePrescriptionFields } from './training-day-exercise-prescription-fields';

export function AddTrainingDayExerciseForm({
    trainingBlockId,
    trainingDayId,
    exerciseOptions
}: {
    trainingBlockId: string;
    trainingDayId: string;
    exerciseOptions: ExerciseOption[];
}) {
    const { state, formAction, isPending } = useAddTrainingDayExercise();

    if (!exerciseOptions.length) {
        return (
            <Card size='sm'>
                <CardHeader>
                    <CardTitle>Brak ćwiczeń w bibliotece</CardTitle>
                    <CardDescription>
                        Dodaj własne ćwiczenie lub skopiuj je z katalogu, aby użyć go w planie.
                    </CardDescription>
                </CardHeader>
                <CardFooter>
                    <Button
                        variant='outline'
                        render={<Link href={getExerciseListPath()} />}
                        nativeButton={false}
                    >
                        Otwórz bibliotekę ćwiczeń
                    </Button>
                </CardFooter>
            </Card>
        );
    }

    return (
        <form action={formAction}>
            <input type='hidden' name='trainingBlockId' value={trainingBlockId} />
            <input type='hidden' name='trainingDayId' value={trainingDayId} />
            <Card size='sm'>
                <CardHeader>
                    <CardTitle>Dodaj ćwiczenie</CardTitle>
                    <CardDescription>
                        Wybierz pozycję z aktywnej biblioteki i określ zalecenia.
                    </CardDescription>
                </CardHeader>
                <CardContent className='flex flex-col gap-5'>
                    <FieldGroup className='grid gap-4 sm:grid-cols-2'>
                        <Field data-invalid={Boolean(state.fieldErrors?.exerciseId)}>
                            <FieldLabel htmlFor={`exercise-${trainingDayId}`}>Ćwiczenie</FieldLabel>
                            <NativeSelect
                                id={`exercise-${trainingDayId}`}
                                name='exerciseId'
                                required
                                aria-invalid={Boolean(state.fieldErrors?.exerciseId)}
                            >
                                <NativeSelectOption value=''>Wybierz ćwiczenie</NativeSelectOption>
                                {exerciseOptions.map(exercise => (
                                    <NativeSelectOption key={exercise.id} value={exercise.id}>
                                        {exercise.name}
                                    </NativeSelectOption>
                                ))}
                            </NativeSelect>
                            <FieldError>{state.fieldErrors?.exerciseId?.[0]}</FieldError>
                        </Field>
                        <Field data-invalid={Boolean(state.fieldErrors?.section)}>
                            <FieldLabel htmlFor={`section-${trainingDayId}`}>Sekcja</FieldLabel>
                            <NativeSelect
                                id={`section-${trainingDayId}`}
                                name='section'
                                defaultValue={TrainingDayExerciseSection.Main}
                                aria-invalid={Boolean(state.fieldErrors?.section)}
                            >
                                <NativeSelectOption value={TrainingDayExerciseSection.Warmup}>
                                    Rozgrzewka
                                </NativeSelectOption>
                                <NativeSelectOption value={TrainingDayExerciseSection.Main}>
                                    Część główna
                                </NativeSelectOption>
                            </NativeSelect>
                            <FieldError>{state.fieldErrors?.section?.[0]}</FieldError>
                        </Field>
                    </FieldGroup>
                    <TrainingDayExercisePrescriptionFields
                        fieldIdPrefix={`new-exercise-${trainingDayId}`}
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
                        {isPending ? (
                            <Spinner data-icon='inline-start' />
                        ) : (
                            <PlusIcon data-icon='inline-start' />
                        )}
                        {isPending ? 'Dodawanie…' : 'Dodaj ćwiczenie'}
                    </Button>
                </CardFooter>
            </Card>
        </form>
    );
}
