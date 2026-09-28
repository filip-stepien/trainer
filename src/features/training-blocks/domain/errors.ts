export const TrainingBlockErrorCode = {
    NotFound: 'not_found',
    ClientNotFound: 'client_not_found',
    ExerciseNotFound: 'exercise_not_found'
} as const;

export type TrainingBlockErrorCode =
    (typeof TrainingBlockErrorCode)[keyof typeof TrainingBlockErrorCode];
