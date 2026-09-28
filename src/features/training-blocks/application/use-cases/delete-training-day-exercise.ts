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
    return ({
        coachId,
        trainingBlockId,
        trainingDayId,
        trainingDayExerciseId
    }: DeleteTrainingDayExerciseParams) =>
        trainingDayExerciseRepository.deleteById({
            trainingDayExerciseId,
            filter: { coachId, trainingBlockId, trainingDayId }
        });
}
