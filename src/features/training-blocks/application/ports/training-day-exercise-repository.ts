import type { Result } from '@/shared';

import type { TrainingBlockErrorCode } from '../../domain/errors';
import type {
    TrainingDayExercise,
    TrainingDayExercisePrescription,
    TrainingDayExerciseSection
} from '../../domain/training-day-exercise';

export type SaveTrainingDayExerciseData = TrainingDayExercisePrescription & {
    exerciseId: string;
    section: TrainingDayExerciseSection;
    name: string;
    instructions: string | null;
    videoUrl: string | null;
};

export type TrainingDayExerciseFilter = {
    coachId: string;
    trainingBlockId: string;
    trainingDayId?: string;
};

export type SaveTrainingDayExerciseParams = {
    data: SaveTrainingDayExerciseData;
    filter: TrainingDayExerciseFilter & { trainingDayId: string };
};

export type FindAllTrainingDayExercisesParams = {
    filter: TrainingDayExerciseFilter;
};

export type UpdateTrainingDayExerciseByIdParams = {
    trainingDayExerciseId: string;
    data: TrainingDayExercisePrescription;
    filter: TrainingDayExerciseFilter;
};

export type UpdateAllTrainingDayExercisesData = {
    trainingDayExerciseId: string;
    position: number;
};

export type UpdateAllTrainingDayExercisesParams = {
    data: UpdateAllTrainingDayExercisesData[];
    filter: TrainingDayExerciseFilter;
};

export type DeleteTrainingDayExerciseByIdParams = {
    trainingDayExerciseId: string;
    filter: TrainingDayExerciseFilter;
};

export type TrainingDayExerciseRepository = {
    save: (
        params: SaveTrainingDayExerciseParams
    ) => Promise<Result<TrainingDayExercise, TrainingBlockErrorCode>>;
    findAll: (params: FindAllTrainingDayExercisesParams) => Promise<TrainingDayExercise[]>;
    updateById: (
        params: UpdateTrainingDayExerciseByIdParams
    ) => Promise<Result<TrainingDayExercise, TrainingBlockErrorCode>>;
    updateAll: (
        params: UpdateAllTrainingDayExercisesParams
    ) => Promise<Result<TrainingDayExercise[], TrainingBlockErrorCode>>;
    deleteById: (
        params: DeleteTrainingDayExerciseByIdParams
    ) => Promise<Result<void, TrainingBlockErrorCode>>;
};
