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

export const TrainingDayExerciseMoveScope = {
    Exercise: 'exercise',
    Group: 'group'
} as const;

export type TrainingDayExerciseMoveScope =
    (typeof TrainingDayExerciseMoveScope)[keyof typeof TrainingDayExerciseMoveScope];

export const TrainingDayExerciseTargetType = {
    Repetitions: 'repetitions',
    Duration: 'duration'
} as const;

export type TrainingDayExerciseTargetType =
    (typeof TrainingDayExerciseTargetType)[keyof typeof TrainingDayExerciseTargetType];

export type TrainingDayExerciseSet = {
    reps: string | null;
    durationSeconds: number | null;
    loadKg: number | null;
    rir: string | null;
};

export type TrainingDayExercisePrescription = {
    targetType: TrainingDayExerciseTargetType;
    sets: TrainingDayExerciseSet[];
    tempo: string | null;
    restSeconds: number | null;
    notes: string | null;
};

export type TrainingDayExercise = TrainingDayExercisePrescription & {
    id: string;
    trainingDayId: string;
    exerciseId: string;
    section: TrainingDayExerciseSection;
    position: number;
    isLinkedToPrevious: boolean;
    name: string;
    instructions: string | null;
    videoUrl: string | null;
    createdAt: string;
    updatedAt: string;
};

function normalizeTrainingDayExerciseSet({
    set,
    targetType
}: {
    set: TrainingDayExerciseSet;
    targetType: TrainingDayExerciseTargetType;
}): TrainingDayExerciseSet {
    const isDuration = targetType === TrainingDayExerciseTargetType.Duration;

    return {
        reps: isDuration ? null : set.reps?.trim() || null,
        durationSeconds: isDuration ? set.durationSeconds : null,
        loadKg: set.loadKg,
        rir: set.rir?.trim() || null
    };
}

export function normalizeTrainingDayExercisePrescription(
    data: TrainingDayExercisePrescription
): TrainingDayExercisePrescription {
    return {
        targetType: data.targetType,
        sets: data.sets.map(set =>
            normalizeTrainingDayExerciseSet({ set, targetType: data.targetType })
        ),
        tempo: data.tempo?.trim() || null,
        restSeconds: data.restSeconds,
        notes: data.notes?.trim() || null
    };
}

export function groupLinkedExercises<Exercise extends { isLinkedToPrevious: boolean }>(
    exercises: Exercise[]
) {
    const groups: Exercise[][] = [];

    for (const exercise of exercises) {
        const lastGroup = groups.at(-1);

        if (lastGroup && exercise.isLinkedToPrevious) {
            lastGroup.push(exercise);
        } else {
            groups.push([exercise]);
        }
    }

    return groups;
}
