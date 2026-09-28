export const TrainingDayExerciseSection = {
    Warmup: 'warmup',
    Main: 'main'
} as const;

export type TrainingDayExerciseSection =
    (typeof TrainingDayExerciseSection)[keyof typeof TrainingDayExerciseSection];

export const TrainingDayExerciseMoveDirection = {
    Up: 'up',
    Down: 'down'
} as const;

export type TrainingDayExerciseMoveDirection =
    (typeof TrainingDayExerciseMoveDirection)[keyof typeof TrainingDayExerciseMoveDirection];

export const TrainingDayExerciseTargetType = {
    Repetitions: 'repetitions',
    Duration: 'duration'
} as const;

export type TrainingDayExerciseTargetType =
    (typeof TrainingDayExerciseTargetType)[keyof typeof TrainingDayExerciseTargetType];

export type TrainingDayExercisePrescription = {
    sets: number | null;
    targetType: TrainingDayExerciseTargetType;
    reps: string | null;
    durationSeconds: number | null;
    load: string | null;
    tempo: string | null;
    rir: string | null;
    restSeconds: number | null;
    notes: string | null;
};

export type TrainingDayExercise = {
    id: string;
    trainingDayId: string;
    exerciseId: string;
    section: TrainingDayExerciseSection;
    position: number;
    name: string;
    instructions: string | null;
    videoUrl: string | null;
    sets: number | null;
    targetType: TrainingDayExerciseTargetType;
    reps: string | null;
    durationSeconds: number | null;
    load: string | null;
    tempo: string | null;
    rir: string | null;
    restSeconds: number | null;
    notes: string | null;
    createdAt: string;
    updatedAt: string;
};

export function normalizeTrainingDayExercisePrescription(
    data: TrainingDayExercisePrescription
): TrainingDayExercisePrescription {
    return {
        sets: data.sets,
        targetType: data.targetType,
        reps:
            data.targetType === TrainingDayExerciseTargetType.Repetitions
                ? data.reps?.trim() || null
                : null,
        durationSeconds:
            data.targetType === TrainingDayExerciseTargetType.Duration
                ? data.durationSeconds
                : null,
        load: data.load?.trim() || null,
        tempo: data.tempo?.trim() || null,
        rir: data.rir?.trim() || null,
        restSeconds: data.restSeconds,
        notes: data.notes?.trim() || null
    };
}
