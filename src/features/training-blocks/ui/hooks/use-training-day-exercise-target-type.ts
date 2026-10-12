'use client';

import { useState } from 'react';

import { TrainingDayExerciseTargetType } from '../../domain/training-day-exercise';

function isTargetType(value: unknown): value is TrainingDayExerciseTargetType {
    return (
        value === TrainingDayExerciseTargetType.Repetitions ||
        value === TrainingDayExerciseTargetType.Duration
    );
}

export function useTrainingDayExerciseTargetType({
    initialTargetType = TrainingDayExerciseTargetType.Repetitions
}: {
    initialTargetType?: TrainingDayExerciseTargetType;
}) {
    const [targetType, setTargetType] = useState(initialTargetType);

    function handleTargetTypeChange(values: unknown[]) {
        const nextTargetType = values[0];

        if (isTargetType(nextTargetType)) {
            setTargetType(nextTargetType);
        }
    }

    return { targetType, handleTargetTypeChange };
}
