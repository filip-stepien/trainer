import { ExerciseErrorCode } from '../../domain/errors';

export const ExerciseErrorMessages: Record<ExerciseErrorCode, string> = {
    [ExerciseErrorCode.NotFound]: 'Nie znaleziono ćwiczenia.',
    [ExerciseErrorCode.SourceNotFound]: 'Nie znaleziono ćwiczenia w katalogu.'
};

export const ExerciseActionMessages = {
    CreateFailed: 'Nie udało się dodać ćwiczenia.',
    InvalidData: 'Nieprawidłowe dane ćwiczenia.',
    Saved: 'Ćwiczenie zostało zapisane.'
} as const;
