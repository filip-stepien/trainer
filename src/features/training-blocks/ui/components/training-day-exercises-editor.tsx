import { DumbbellIcon } from 'lucide-react';

import {
    Card,
    CardContent,
    Empty,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle
} from '@/shared';

import { TrainingDayExerciseSection } from '../../domain/training-day-exercise';
import type {
    ExerciseOption,
    TrainingDayDetails,
    TrainingDayExerciseDetails
} from '../queries/get-training-block-details-or-redirect';
import { AddTrainingDayExerciseForm } from './add-training-day-exercise-form';
import { TrainingDayExerciseCard } from './training-day-exercise-card';

function ExerciseSection({
    title,
    exercises,
    trainingBlockId,
    trainingDayId
}: {
    title: string;
    exercises: TrainingDayExerciseDetails[];
    trainingBlockId: string;
    trainingDayId: string;
}) {
    if (!exercises.length) {
        return null;
    }

    return (
        <section className='flex flex-col gap-3'>
            <h4 className='font-medium'>{title}</h4>
            {exercises.map((exercise, index) => (
                <TrainingDayExerciseCard
                    key={exercise.id}
                    trainingBlockId={trainingBlockId}
                    trainingDayId={trainingDayId}
                    exercise={exercise}
                    number={index + 1}
                    isFirst={index === 0}
                    isLast={index === exercises.length - 1}
                />
            ))}
        </section>
    );
}

export function TrainingDayExercisesEditor({
    trainingBlockId,
    trainingDay,
    exerciseOptions
}: {
    trainingBlockId: string;
    trainingDay: TrainingDayDetails;
    exerciseOptions: ExerciseOption[];
}) {
    const warmup = trainingDay.exercises.filter(
        exercise => exercise.section === TrainingDayExerciseSection.Warmup
    );
    const main = trainingDay.exercises.filter(
        exercise => exercise.section === TrainingDayExerciseSection.Main
    );

    return (
        <div className='flex flex-col gap-4'>
            {trainingDay.exercises.length ? (
                <div className='flex flex-col gap-5'>
                    <ExerciseSection
                        title='Rozgrzewka'
                        exercises={warmup}
                        trainingBlockId={trainingBlockId}
                        trainingDayId={trainingDay.id}
                    />
                    <ExerciseSection
                        title='Część główna'
                        exercises={main}
                        trainingBlockId={trainingBlockId}
                        trainingDayId={trainingDay.id}
                    />
                </div>
            ) : (
                <Card size='sm'>
                    <CardContent>
                        <Empty>
                            <EmptyHeader>
                                <EmptyMedia variant='icon'>
                                    <DumbbellIcon />
                                </EmptyMedia>
                                <EmptyTitle>Brak ćwiczeń</EmptyTitle>
                                <EmptyDescription>
                                    Dodaj rozgrzewkę albo pierwsze ćwiczenie części głównej.
                                </EmptyDescription>
                            </EmptyHeader>
                        </Empty>
                    </CardContent>
                </Card>
            )}
            <AddTrainingDayExerciseForm
                trainingBlockId={trainingBlockId}
                trainingDayId={trainingDay.id}
                exerciseOptions={exerciseOptions}
            />
        </div>
    );
}
