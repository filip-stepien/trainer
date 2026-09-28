import type { TrainingDayExerciseRepository } from '../ports/training-day-exercise-repository';

export type ListTrainingDayExercisesParams = {
    coachId: string;
    trainingBlockId: string;
    trainingDayId?: string;
};

export function listTrainingDayExercisesFactory({
    trainingDayExerciseRepository
}: {
    trainingDayExerciseRepository: TrainingDayExerciseRepository;
}) {
    return ({ coachId, trainingBlockId, trainingDayId }: ListTrainingDayExercisesParams) =>
        trainingDayExerciseRepository.findAll({
            filter: { coachId, trainingBlockId, trainingDayId }
        });
}
