import type { Result } from '@/shared';

import type { Exercise, ExerciseStatus } from '../../domain/exercise';
import type { ExerciseErrorCode } from '../../domain/errors';

export type CreateExerciseData = {
    name: string;
    instructions: string | null;
    videoUrl: string | null;
};

export type UpdateExerciseData = CreateExerciseData;

export type SaveExerciseData =
    | (CreateExerciseData & {
          coachId: string;
          sourceExerciseId: null;
          isCustom: true;
      })
    | {
          coachId: string;
          sourceExerciseId: string;
          isCustom: false;
      };

export type SaveExerciseParams = { data: SaveExerciseData };

export type ExerciseFilter = {
    coachId?: string | null;
    sourceExerciseIds?: string[];
    status?: ExerciseStatus;
    nameContains?: string;
};

export type ExercisePagination = {
    limit: number;
    offset: number;
};

export type FindExercisePageParams = {
    filter: ExerciseFilter;
    pagination: ExercisePagination;
};

export type FindAllExercisesParams = {
    filter: ExerciseFilter;
};

export type FindExerciseByIdParams = {
    exerciseId: string;
    filter: { coachId: string | null };
};

export type UpdateExerciseByIdParams = {
    exerciseId: string;
    data: UpdateExerciseData;
    filter: { coachId: string };
};

export type UpdateExerciseStatusByIdParams = {
    exerciseId: string;
    status: ExerciseStatus;
    filter: { coachId: string };
};

export type ExerciseRepository = {
    save: (params: SaveExerciseParams) => Promise<Result<Exercise, ExerciseErrorCode>>;
    findAll: (params: FindAllExercisesParams) => Promise<Exercise[]>;
    findPage: (params: FindExercisePageParams) => Promise<Exercise[]>;
    findById: (params: FindExerciseByIdParams) => Promise<Exercise | null>;
    updateById: (params: UpdateExerciseByIdParams) => Promise<Result<Exercise, ExerciseErrorCode>>;
    updateStatusById: (
        params: UpdateExerciseStatusByIdParams
    ) => Promise<Result<Exercise, ExerciseErrorCode>>;
};
