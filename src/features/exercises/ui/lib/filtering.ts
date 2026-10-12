import { ExerciseListStatus } from './routes';

export const exerciseListStatusOptions: { value: ExerciseListStatus; label: string }[] = [
    { value: ExerciseListStatus.Active, label: 'Aktywne' },
    { value: ExerciseListStatus.Archived, label: 'Archiwalne' },
    { value: ExerciseListStatus.All, label: 'Wszystkie' }
];
