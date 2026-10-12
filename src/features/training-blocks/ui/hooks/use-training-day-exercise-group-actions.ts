'use client';

import { startTransition } from 'react';

import { toFormData } from '@/shared';

import {
    TrainingDayExerciseMoveDirection,
    TrainingDayExerciseMoveScope
} from '../../domain/training-day-exercise';
import { useMoveTrainingDayExercise } from './use-move-training-day-exercise';

export function useTrainingDayExerciseGroupActions({
    trainingBlockId,
    trainingDayId,
    trainingDayExerciseId
}: {
    trainingBlockId: string;
    trainingDayId: string;
    trainingDayExerciseId: string;
}) {
    const move = useMoveTrainingDayExercise();

    function moveGroup(direction: TrainingDayExerciseMoveDirection) {
        startTransition(() =>
            move.formAction(
                toFormData({
                    trainingBlockId,
                    trainingDayId,
                    trainingDayExerciseId,
                    direction,
                    scope: TrainingDayExerciseMoveScope.Group
                })
            )
        );
    }

    function moveEarlier() {
        moveGroup(TrainingDayExerciseMoveDirection.Up);
    }

    function moveLater() {
        moveGroup(TrainingDayExerciseMoveDirection.Down);
    }

    return { isPending: move.isPending, moveEarlier, moveLater };
}
