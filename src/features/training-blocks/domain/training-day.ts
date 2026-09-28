export const TrainingDayMoveDirection = {
    Up: 'up',
    Down: 'down'
} as const;

export type TrainingDayMoveDirection =
    (typeof TrainingDayMoveDirection)[keyof typeof TrainingDayMoveDirection];

export type TrainingDayData = {
    name: string;
    description: string | null;
};

export type TrainingDay = {
    id: string;
    trainingBlockVersionId: string;
    position: number;
    name: string;
    description: string | null;
    createdAt: string;
    updatedAt: string;
};

export function normalizeTrainingDayData(data: TrainingDayData): TrainingDayData {
    return {
        name: data.name.trim(),
        description: data.description?.trim() || null
    };
}
