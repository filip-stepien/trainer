'use client';

import { startTransition } from 'react';

import { toFormData } from '@/shared';

import { TrainingDayMoveDirection } from '../../domain/training-day';
import { useDeleteTrainingDay } from './use-delete-training-day';
import { useMoveTrainingDay } from './use-move-training-day';

export function useTrainingDayActions({
    trainingBlockId,
    trainingDayId
}: {
    trainingBlockId: string;
    trainingDayId: string;
}) {
    const move = useMoveTrainingDay();
    const remove = useDeleteTrainingDay();
    const dayFields = { trainingBlockId, trainingDayId };

    function moveDay(direction: TrainingDayMoveDirection) {
        startTransition(() => move.formAction(toFormData({ ...dayFields, direction })));
    }

    function moveEarlier() {
        moveDay(TrainingDayMoveDirection.Up);
    }

    function moveLater() {
        moveDay(TrainingDayMoveDirection.Down);
    }

    function deleteDay() {
        startTransition(() => remove.formAction(toFormData(dayFields)));
    }

    return {
        isPending: move.isPending || remove.isPending,
        moveEarlier,
        moveLater,
        deleteDay
    };
}
