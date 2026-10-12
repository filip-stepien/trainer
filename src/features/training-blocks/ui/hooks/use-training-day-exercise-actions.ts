'use client';

import { startTransition } from 'react';

import { toFormData } from '@/shared';

import { TrainingDayExerciseMoveDirection } from '../../domain/training-day-exercise';
import { useDeleteTrainingDayExercise } from './use-delete-training-day-exercise';
import { useMoveTrainingDayExercise } from './use-move-training-day-exercise';
import { useSetTrainingDayExerciseLink } from './use-set-training-day-exercise-link';

export function useTrainingDayExerciseActions({
    trainingBlockId,
    trainingDayId,
    trainingDayExerciseId,
    isLinkedToPrevious
}: {
    trainingBlockId: string;
    trainingDayId: string;
    trainingDayExerciseId: string;
    isLinkedToPrevious: boolean;
}) {
    const move = useMoveTrainingDayExercise();
    const remove = useDeleteTrainingDayExercise();
    const link = useSetTrainingDayExerciseLink();
    const exerciseFields = { trainingBlockId, trainingDayId, trainingDayExerciseId };

    function moveExercise(direction: TrainingDayExerciseMoveDirection) {
        startTransition(() => move.formAction(toFormData({ ...exerciseFields, direction })));
    }

    function moveEarlier() {
        moveExercise(TrainingDayExerciseMoveDirection.Up);
    }

    function moveLater() {
        moveExercise(TrainingDayExerciseMoveDirection.Down);
    }

    function deleteExercise() {
        startTransition(() => remove.formAction(toFormData(exerciseFields)));
    }

    function toggleLink() {
        startTransition(() =>
            link.formAction(
                toFormData({ ...exerciseFields, isLinkedToPrevious: String(!isLinkedToPrevious) })
            )
        );
    }

    return {
        isPending: move.isPending || remove.isPending || link.isPending,
        moveEarlier,
        moveLater,
        deleteExercise,
        toggleLink
    };
}
