import type { Result } from '@/shared';

import type { TrainingDay, TrainingDayData } from '../../domain/training-day';
import type { TrainingBlockErrorCode } from '../../domain/errors';

export type TrainingDayFilter = {
    coachId: string;
    trainingBlockId: string;
};

export type SaveTrainingDayParams = {
    data: TrainingDayData;
    filter: TrainingDayFilter;
};

export type FindAllTrainingDaysParams = {
    filter: TrainingDayFilter;
};

export type UpdateTrainingDayByIdParams = {
    trainingDayId: string;
    data: TrainingDayData;
    filter: TrainingDayFilter;
};

export type UpdateAllTrainingDaysData = {
    trainingDayId: string;
    position: number;
};

export type UpdateAllTrainingDaysParams = {
    data: UpdateAllTrainingDaysData[];
    filter: TrainingDayFilter;
};

export type DeleteTrainingDayByIdParams = {
    trainingDayId: string;
    filter: TrainingDayFilter;
};

export type TrainingDayRepository = {
    save: (params: SaveTrainingDayParams) => Promise<Result<TrainingDay, TrainingBlockErrorCode>>;
    findAll: (params: FindAllTrainingDaysParams) => Promise<TrainingDay[]>;
    updateById: (
        params: UpdateTrainingDayByIdParams
    ) => Promise<Result<TrainingDay, TrainingBlockErrorCode>>;
    updateAll: (
        params: UpdateAllTrainingDaysParams
    ) => Promise<Result<TrainingDay[], TrainingBlockErrorCode>>;
    deleteById: (
        params: DeleteTrainingDayByIdParams
    ) => Promise<Result<void, TrainingBlockErrorCode>>;
};
