import type { ExerciseRepository, UpdateExerciseData } from '../ports/exercise-repository';

export type UpdateExerciseParams = {
    coachId: string;
    exerciseId: string;
    data: UpdateExerciseData;
};

export function updateExerciseFactory({
    exerciseRepository
}: {
    exerciseRepository: ExerciseRepository;
}) {
    return ({ coachId, exerciseId, data }: UpdateExerciseParams) =>
        exerciseRepository.updateById({
            exerciseId,
            data: {
                name: data.name.trim(),
                instructions: data.instructions?.trim() || null,
                videoUrl: data.videoUrl?.trim() || null
            },
            filter: { coachId }
        });
}
