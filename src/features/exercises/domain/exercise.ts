export const ExerciseStatus = {
    Active: 'active',
    Archived: 'archived'
} as const;

export type ExerciseStatus = (typeof ExerciseStatus)[keyof typeof ExerciseStatus];

export type Exercise = {
    id: string;
    sourceExerciseId: string | null;
    isCustom: boolean;
    name: string;
    instructions: string | null;
    videoUrl: string | null;
    status: ExerciseStatus;
    archivedAt: string | null;
    createdAt: string;
    updatedAt: string;
};
