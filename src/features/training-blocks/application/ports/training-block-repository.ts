import type { Result } from '@/shared';

import type { TrainingBlock, TrainingBlockData } from '../../domain/training-block';
import type { TrainingBlockErrorCode } from '../../domain/errors';

export type TrainingBlockFilter = {
    coachId: string;
    clientId?: string;
};

export type SaveTrainingBlockParams = {
    coachId: string;
    clientId: string;
    data: TrainingBlockData;
};

export type FindAllTrainingBlocksParams = {
    filter: TrainingBlockFilter;
};

export type FindTrainingBlockByIdParams = {
    trainingBlockId: string;
    filter: TrainingBlockFilter;
};

export type UpdateTrainingBlockByIdParams = {
    trainingBlockId: string;
    data: TrainingBlockData;
    filter: TrainingBlockFilter;
};

export type TrainingBlockRepository = {
    save: (
        params: SaveTrainingBlockParams
    ) => Promise<Result<TrainingBlock, TrainingBlockErrorCode>>;
    findAll: (params: FindAllTrainingBlocksParams) => Promise<TrainingBlock[]>;
    findById: (params: FindTrainingBlockByIdParams) => Promise<TrainingBlock | null>;
    updateById: (
        params: UpdateTrainingBlockByIdParams
    ) => Promise<Result<TrainingBlock, TrainingBlockErrorCode>>;
};
