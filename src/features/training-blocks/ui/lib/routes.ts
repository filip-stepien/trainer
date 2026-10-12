import type { TrainingDayExerciseSection } from '../../domain/training-day-exercise';

const trainingBlockListPath = '/dashboard/training-blocks';

export const TrainingBlockSearchParam = {
    Day: 'day',
    AddExerciseSection: 'add'
} as const;

export function getTrainingBlockPath({ trainingBlockId }: { trainingBlockId: string }) {
    return `${trainingBlockListPath}/${trainingBlockId}`;
}

export function getAddTrainingDayExerciseHref({
    trainingBlockId,
    trainingDayId,
    section
}: {
    trainingBlockId: string;
    trainingDayId: string;
    section: TrainingDayExerciseSection;
}) {
    const params = new URLSearchParams({
        [TrainingBlockSearchParam.Day]: trainingDayId,
        [TrainingBlockSearchParam.AddExerciseSection]: section
    });
    return `${getTrainingBlockPath({ trainingBlockId })}?${params}`;
}

export function isTrainingBlockSectionPath({ pathname }: { pathname: string }) {
    return pathname.startsWith(`${trainingBlockListPath}/`);
}
