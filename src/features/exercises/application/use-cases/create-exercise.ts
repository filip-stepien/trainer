import type { CreateExerciseData, ExerciseRepository } from '../ports/exercise-repository';

export type CreateExerciseParams = {
    coachId: string;
    data: CreateExerciseData;
};

export function createExerciseFactory({
    exerciseRepository
}: {
    exerciseRepository: ExerciseRepository;
}) {
    return ({ coachId, data }: CreateExerciseParams) =>
        exerciseRepository.save({
            data: {
                coachId,
                sourceExerciseId: null,
                isCustom: true,
                name: data.name.trim(),
                instructions: data.instructions?.trim() || null,
                videoUrl: data.videoUrl?.trim() || null
            }
        });
}
