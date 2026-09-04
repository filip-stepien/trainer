export const ExerciseErrorCode = {
    NotFound: 'not_found',
    SourceNotFound: 'source_not_found'
} as const;

export type ExerciseErrorCode = (typeof ExerciseErrorCode)[keyof typeof ExerciseErrorCode];
