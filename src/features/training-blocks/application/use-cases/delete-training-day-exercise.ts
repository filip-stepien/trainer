import { err } from '@/shared';

import type { TrainingDayExerciseRepository } from '../ports/training-day-exercise-repository';

export type DeleteTrainingDayExerciseParams = {
    coachId: string;
    trainingBlockId: string;
    trainingDayId: string;
    trainingDayExerciseId: string;
};

export function deleteTrainingDayExerciseFactory({
    trainingDayExerciseRepository
}: {
    trainingDayExerciseRepository: TrainingDayExerciseRepository;
}) {
    return async ({
        coachId,
        trainingBlockId,
        trainingDayId,
        trainingDayExerciseId
    }: DeleteTrainingDayExerciseParams) => {
        const filter = { coachId, trainingBlockId, trainingDayId };
        const exercises = await trainingDayExerciseRepository.findAll({ filter });
        const current = exercises.find(exercise => exercise.id === trainingDayExerciseId);
        const sectionExercises = exercises.filter(
            exercise => exercise.section === current?.section
        );
        const successor = current
            ? sectionExercises[sectionExercises.indexOf(current) + 1]
            : undefined;

        if (current && successor?.isLinkedToPrevious && !current.isLinkedToPrevious) {
            const unlinked = await trainingDayExerciseRepository.updateAll({
                data: [
                    {
                        trainingDayExerciseId: successor.id,
                        position: successor.position,
                        isLinkedToPrevious: false
                    }
                ],
                filter
            });

            if (!unlinked.ok) {
                return err(unlinked.error);
            }
        }

        return trainingDayExerciseRepository.deleteById({ trainingDayExerciseId, filter });
    };
}
