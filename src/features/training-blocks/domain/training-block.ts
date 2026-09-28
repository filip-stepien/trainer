export const TrainingBlockStatus = {
    Draft: 'draft',
    Active: 'active',
    Completed: 'completed'
} as const;

export type TrainingBlockStatus = (typeof TrainingBlockStatus)[keyof typeof TrainingBlockStatus];

export type TrainingBlockData = {
    name: string;
    description: string | null;
    durationWeeks: number | null;
    startDate: string;
};

export type TrainingBlockVersion = {
    id: string;
    versionNumber: number | null;
    name: string;
    description: string | null;
    durationWeeks: number | null;
    publishedAt: string | null;
    createdAt: string;
    updatedAt: string;
};

export type TrainingBlock = {
    id: string;
    clientId: string;
    status: TrainingBlockStatus;
    startDate: string;
    activeVersionId: string | null;
    draftVersion: TrainingBlockVersion | null;
    createdAt: string;
    updatedAt: string;
};

export function normalizeTrainingBlockData(data: TrainingBlockData): TrainingBlockData {
    return {
        name: data.name.trim(),
        description: data.description?.trim() || null,
        durationWeeks: data.durationWeeks,
        startDate: data.startDate
    };
}
