'use client';

import type { FormEvent } from 'react';
import { ArrowDownIcon, ArrowUpIcon, ExternalLinkIcon, Trash2Icon } from 'lucide-react';

import {
    Button,
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
    FieldError,
    Spinner
} from '@/shared';

import { TrainingDayExerciseMoveDirection } from '../../domain/training-day-exercise';
import { useDeleteTrainingDayExercise } from '../hooks/use-delete-training-day-exercise';
import { useMoveTrainingDayExercise } from '../hooks/use-move-training-day-exercise';
import { useUpdateTrainingDayExercise } from '../hooks/use-update-training-day-exercise';
import type { TrainingDayExerciseDetails } from '../queries/get-training-block-details-or-redirect';
import { TrainingDayExercisePrescriptionFields } from './training-day-exercise-prescription-fields';

export function TrainingDayExerciseCard({
    trainingBlockId,
    trainingDayId,
    exercise,
    number,
    isFirst,
    isLast
}: {
    trainingBlockId: string;
    trainingDayId: string;
    exercise: TrainingDayExerciseDetails;
    number: number;
    isFirst: boolean;
    isLast: boolean;
}) {
    const update = useUpdateTrainingDayExercise();
    const move = useMoveTrainingDayExercise();
    const remove = useDeleteTrainingDayExercise();

    function handleDeleteSubmit(event: FormEvent<HTMLFormElement>) {
        if (!window.confirm(`Usunąć ćwiczenie „${exercise.name}” z dnia treningowego?`)) {
            event.preventDefault();
        }
    }

    return (
        <Card size='sm'>
            <CardHeader>
                <CardTitle>
                    {number}. {exercise.name}
                </CardTitle>
                <CardDescription>
                    {exercise.instructions || 'Brak instrukcji w zapisanej definicji ćwiczenia.'}
                </CardDescription>
                <CardAction className='flex items-center gap-1'>
                    <form action={move.formAction} className='flex items-center gap-1'>
                        <input type='hidden' name='trainingBlockId' value={trainingBlockId} />
                        <input type='hidden' name='trainingDayId' value={trainingDayId} />
                        <input type='hidden' name='trainingDayExerciseId' value={exercise.id} />
                        <Button
                            type='submit'
                            name='direction'
                            value={TrainingDayExerciseMoveDirection.Up}
                            variant='ghost'
                            size='icon'
                            disabled={isFirst || move.isPending || remove.isPending}
                            aria-label='Przenieś ćwiczenie wyżej'
                            title='Przenieś wyżej'
                        >
                            <ArrowUpIcon />
                        </Button>
                        <Button
                            type='submit'
                            name='direction'
                            value={TrainingDayExerciseMoveDirection.Down}
                            variant='ghost'
                            size='icon'
                            disabled={isLast || move.isPending || remove.isPending}
                            aria-label='Przenieś ćwiczenie niżej'
                            title='Przenieś niżej'
                        >
                            <ArrowDownIcon />
                        </Button>
                    </form>
                    <form action={remove.formAction} onSubmit={handleDeleteSubmit}>
                        <input type='hidden' name='trainingBlockId' value={trainingBlockId} />
                        <input type='hidden' name='trainingDayId' value={trainingDayId} />
                        <input type='hidden' name='trainingDayExerciseId' value={exercise.id} />
                        <Button
                            type='submit'
                            variant='destructive'
                            size='icon'
                            disabled={remove.isPending || move.isPending}
                            aria-label='Usuń ćwiczenie'
                            title='Usuń ćwiczenie'
                        >
                            {remove.isPending ? <Spinner /> : <Trash2Icon />}
                        </Button>
                    </form>
                </CardAction>
            </CardHeader>
            <form action={update.formAction}>
                <input type='hidden' name='trainingBlockId' value={trainingBlockId} />
                <input type='hidden' name='trainingDayId' value={trainingDayId} />
                <input type='hidden' name='trainingDayExerciseId' value={exercise.id} />
                <CardContent className='flex flex-col gap-5'>
                    {exercise.videoUrl ? (
                        <a
                            href={exercise.videoUrl}
                            target='_blank'
                            rel='noreferrer'
                            className='text-sm underline underline-offset-4'
                        >
                            Materiał instruktażowy
                            <ExternalLinkIcon className='ml-1 inline-block size-3' />
                        </a>
                    ) : null}
                    <TrainingDayExercisePrescriptionFields
                        fieldIdPrefix={`exercise-${exercise.id}`}
                        defaultValues={exercise}
                        errors={update.state.fieldErrors}
                    />
                    {update.state.error ? <FieldError>{update.state.error}</FieldError> : null}
                    {move.state.error ? <FieldError>{move.state.error}</FieldError> : null}
                    {remove.state.error ? <FieldError>{remove.state.error}</FieldError> : null}
                    {update.state.success ? (
                        <p className='text-muted-foreground text-sm' aria-live='polite'>
                            {update.state.success}
                        </p>
                    ) : null}
                </CardContent>
                <CardFooter className='justify-end'>
                    <Button type='submit' disabled={update.isPending}>
                        {update.isPending ? <Spinner data-icon='inline-start' /> : null}
                        {update.isPending ? 'Zapisywanie…' : 'Zapisz zalecenia'}
                    </Button>
                </CardFooter>
            </form>
        </Card>
    );
}
