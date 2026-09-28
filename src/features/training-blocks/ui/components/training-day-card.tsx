'use client';

import type { FormEvent } from 'react';
import { ArrowDownIcon, ArrowUpIcon, Trash2Icon } from 'lucide-react';

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

import { TrainingDayMoveDirection } from '../../domain/training-day';
import { useDeleteTrainingDay } from '../hooks/use-delete-training-day';
import { useMoveTrainingDay } from '../hooks/use-move-training-day';
import { useUpdateTrainingDay } from '../hooks/use-update-training-day';
import type {
    ExerciseOption,
    TrainingDayDetails
} from '../queries/get-training-block-details-or-redirect';
import { TrainingDayFormFields } from './training-day-form-fields';
import { TrainingDayExercisesEditor } from './training-day-exercises-editor';

export function TrainingDayCard({
    trainingBlockId,
    trainingDay,
    number,
    isFirst,
    isLast,
    exerciseOptions
}: {
    trainingBlockId: string;
    trainingDay: TrainingDayDetails;
    number: number;
    isFirst: boolean;
    isLast: boolean;
    exerciseOptions: ExerciseOption[];
}) {
    const update = useUpdateTrainingDay();
    const move = useMoveTrainingDay();
    const remove = useDeleteTrainingDay();

    function handleDeleteSubmit(event: FormEvent<HTMLFormElement>) {
        if (!window.confirm(`Usunąć dzień „${trainingDay.name}”?`)) {
            event.preventDefault();
        }
    }

    return (
        <div className='flex flex-col gap-4'>
            <Card>
                <CardHeader>
                    <CardTitle>
                        Dzień {number}: {trainingDay.name}
                    </CardTitle>
                    <CardDescription>
                        Kolejność dnia będzie zachowana na ekranie wykonywania treningu.
                    </CardDescription>
                    <CardAction className='flex items-center gap-1'>
                        <form action={move.formAction} className='flex items-center gap-1'>
                            <input type='hidden' name='trainingBlockId' value={trainingBlockId} />
                            <input type='hidden' name='trainingDayId' value={trainingDay.id} />
                            <Button
                                type='submit'
                                name='direction'
                                value={TrainingDayMoveDirection.Up}
                                variant='ghost'
                                size='icon'
                                disabled={isFirst || move.isPending || remove.isPending}
                                aria-label='Przenieś dzień wyżej'
                                title='Przenieś wyżej'
                            >
                                <ArrowUpIcon />
                            </Button>
                            <Button
                                type='submit'
                                name='direction'
                                value={TrainingDayMoveDirection.Down}
                                variant='ghost'
                                size='icon'
                                disabled={isLast || move.isPending || remove.isPending}
                                aria-label='Przenieś dzień niżej'
                                title='Przenieś niżej'
                            >
                                <ArrowDownIcon />
                            </Button>
                        </form>
                        <form action={remove.formAction} onSubmit={handleDeleteSubmit}>
                            <input type='hidden' name='trainingBlockId' value={trainingBlockId} />
                            <input type='hidden' name='trainingDayId' value={trainingDay.id} />
                            <Button
                                type='submit'
                                variant='destructive'
                                size='icon'
                                disabled={remove.isPending || move.isPending}
                                aria-label='Usuń dzień'
                                title='Usuń dzień'
                            >
                                {remove.isPending ? <Spinner /> : <Trash2Icon />}
                            </Button>
                        </form>
                    </CardAction>
                </CardHeader>
                <form action={update.formAction}>
                    <input type='hidden' name='trainingBlockId' value={trainingBlockId} />
                    <input type='hidden' name='trainingDayId' value={trainingDay.id} />
                    <CardContent className='flex flex-col gap-5'>
                        <TrainingDayFormFields
                            fieldIdPrefix={`training-day-${trainingDay.id}`}
                            defaultValues={trainingDay}
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
                            {update.isPending ? 'Zapisywanie…' : 'Zapisz dzień'}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
            <TrainingDayExercisesEditor
                trainingBlockId={trainingBlockId}
                trainingDay={trainingDay}
                exerciseOptions={exerciseOptions}
            />
        </div>
    );
}
