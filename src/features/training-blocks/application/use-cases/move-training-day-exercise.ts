import { err, ok } from '@/shared';

import { TrainingBlockErrorCode } from '../../domain/errors';
import {
    groupLinkedExercises,
    type TrainingDayExercise,
    TrainingDayExerciseMoveDirection,
    TrainingDayExerciseMoveScope
} from '../../domain/training-day-exercise';
import type {
    TrainingDayExerciseRepository,
    UpdateAllTrainingDayExercisesData
} from '../ports/training-day-exercise-repository';

export type MoveTrainingDayExerciseParams = {
    coachId: string;
    trainingBlockId: string;
    trainingDayId: string;
    trainingDayExerciseId: string;
    direction: TrainingDayExerciseMoveDirection;
    scope: TrainingDayExerciseMoveScope;
};

function swapItems<Item>({ items, from, to }: { items: Item[]; from: number; to: number }) {
    if (to < 0 || to >= items.length) {
        return null;
    }

    const swapped = [...items];
    [swapped[from], swapped[to]] = [swapped[to], swapped[from]];
    return swapped;
}

function toExerciseOrder(groups: TrainingDayExercise[][]): UpdateAllTrainingDayExercisesData[] {
    return groups
        .flatMap(group =>
            group.map((exercise, indexInGroup) => ({
                trainingDayExerciseId: exercise.id,
                isLinkedToPrevious: indexInGroup > 0
            }))
        )
        .map((exercise, position) => ({ ...exercise, position }));
}

export function moveTrainingDayExerciseFactory({
    trainingDayExerciseRepository
}: {
    trainingDayExerciseRepository: TrainingDayExerciseRepository;
}) {
    return async ({
        coachId,
        trainingBlockId,
        trainingDayId,
        trainingDayExerciseId,
        direction,
        scope
    }: MoveTrainingDayExerciseParams) => {
        const filter = { coachId, trainingBlockId, trainingDayId };
        const exercises = await trainingDayExerciseRepository.findAll({ filter });
        const current = exercises.find(exercise => exercise.id === trainingDayExerciseId);

        if (!current) {
            return err(TrainingBlockErrorCode.NotFound);
        }

        const sectionExercises = exercises.filter(exercise => exercise.section === current.section);
        const groups = groupLinkedExercises(sectionExercises);
        const groupIndex = groups.findIndex(group => group.includes(current));
        const group = groups[groupIndex];
        const offset = direction === TrainingDayExerciseMoveDirection.Up ? -1 : 1;
        const movesWholeGroup = scope === TrainingDayExerciseMoveScope.Group || group.length === 1;
        const indexInGroup = group.indexOf(current);
        const reorderedGroup = swapItems({
            items: group,
            from: indexInGroup,
            to: indexInGroup + offset
        });
        const reorderedGroups = movesWholeGroup
            ? swapItems({ items: groups, from: groupIndex, to: groupIndex + offset })
            : reorderedGroup && groups.with(groupIndex, reorderedGroup);

        if (!reorderedGroups) {
            return ok(sectionExercises);
        }

        return trainingDayExerciseRepository.updateAll({
            data: toExerciseOrder(reorderedGroups),
            filter
        });
    };
}
