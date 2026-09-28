export type ExerciseSnapshot = {
    id: string;
    name: string;
    instructions: string | null;
    videoUrl: string | null;
};

export type ExerciseLibrary = {
    findActiveById: (data: {
        coachId: string;
        exerciseId: string;
    }) => Promise<ExerciseSnapshot | null>;
    findAllActive: (data: { coachId: string }) => Promise<ExerciseSnapshot[]>;
};
