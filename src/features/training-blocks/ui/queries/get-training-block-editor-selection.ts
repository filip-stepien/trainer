import 'server-only';

import type { TrainingDayExerciseSection } from '../../domain/training-day-exercise';
import {
    type TrainingBlockSearchParams,
    validateTrainingBlockSearchParams
} from '../lib/validation';

export type TrainingBlockEditorSelection = {
    trainingDayId?: string;
    addExerciseSection?: TrainingDayExerciseSection;
};

export function getTrainingBlockEditorSelection({
    searchParams
}: {
    searchParams: TrainingBlockSearchParams;
}): TrainingBlockEditorSelection {
    const { day, add } = validateTrainingBlockSearchParams(searchParams);

    return { trainingDayId: day, addExerciseSection: add };
}
