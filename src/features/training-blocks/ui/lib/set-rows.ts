import type { TrainingDayExerciseSet } from '../../domain/training-day-exercise';

export const maxSetCount = 100;

export type SetRow = {
    key: string;
    reps: string;
    durationSeconds: string;
    loadKg: string;
    rir: string;
};

export type SetRowField = Exclude<keyof SetRow, 'key'>;

function createEmptySetRow({ key }: { key: string }): SetRow {
    return { key, reps: '', durationSeconds: '', loadKg: '', rir: '' };
}

function toSetRow({ set, key }: { set: TrainingDayExerciseSet; key: string }): SetRow {
    return {
        key,
        reps: set.reps ?? '',
        durationSeconds: set.durationSeconds?.toString() ?? '',
        loadKg: set.loadKg?.toString() ?? '',
        rir: set.rir ?? ''
    };
}

export function getInitialSetRows({ defaultSets }: { defaultSets?: TrainingDayExerciseSet[] }) {
    if (!defaultSets) {
        return [createEmptySetRow({ key: 'initial-0' })];
    }

    return defaultSets.map((set, index) => toSetRow({ set, key: `initial-${index}` }));
}

export function createNextSetRow({ rows, key }: { rows: SetRow[]; key: string }): SetRow {
    const lastRow = rows.at(-1);

    return lastRow ? { ...lastRow, key } : createEmptySetRow({ key });
}
