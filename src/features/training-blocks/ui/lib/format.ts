import { GaugeIcon, type LucideIcon, TimerIcon } from 'lucide-react';

import { formatCount, formatDateForDisplay } from '@/shared';

import { getTrainingBlockEstimatedEndDate } from '../../domain/training-block';
import {
    TrainingDayExerciseSection,
    type TrainingDayExerciseSet,
    TrainingDayExerciseTargetType
} from '../../domain/training-day-exercise';
import type { TrainingDayExerciseDetails } from '../queries/get-training-block-details-or-redirect';

export const trainingDayExerciseSectionLabels: Record<TrainingDayExerciseSection, string> = {
    [TrainingDayExerciseSection.Warmup]: 'Rozgrzewka',
    [TrainingDayExerciseSection.Main]: 'Część główna'
};

const setTargetLabels: Record<TrainingDayExerciseTargetType, string> = {
    [TrainingDayExerciseTargetType.Repetitions]: 'Powtórzenia',
    [TrainingDayExerciseTargetType.Duration]: 'Czas pracy'
};

const emptySetTableRow: SetTableRow = { number: null, target: null, load: null, rir: null };

export type PrescriptionItem = {
    icon: LucideIcon;
    label: string;
    value: string | null;
};

export type SetTableRow = {
    number: string | null;
    target: string | null;
    load: string | null;
    rir: string | null;
};

export type SetTable = {
    targetLabel: string;
    rows: SetTableRow[];
};

function formatSeconds({ seconds }: { seconds: number }) {
    if (seconds < 60) {
        return `${seconds} s`;
    }

    const minutes = Math.floor(seconds / 60);
    const rest = seconds % 60;
    return rest ? `${minutes} min ${rest} s` : `${minutes} min`;
}

function formatRest({ restSeconds }: { restSeconds: number | null }) {
    if (restSeconds === null) {
        return null;
    }

    return restSeconds ? formatSeconds({ seconds: restSeconds }) : 'Brak';
}

function formatDurationWeeks({ durationWeeks }: { durationWeeks: number | null }) {
    if (!durationWeeks) {
        return null;
    }

    return formatCount({ count: durationWeeks, one: 'tydzień', few: 'tygodnie', many: 'tygodni' });
}

export function formatTrainingBlockDuration({
    startDate,
    durationWeeks
}: {
    startDate: string;
    durationWeeks: number | null;
}) {
    const duration = formatDurationWeeks({ durationWeeks });
    const estimatedEndDate = getTrainingBlockEstimatedEndDate({ startDate, durationWeeks });

    if (!duration) {
        return 'Czas trwania nieokreślony';
    }

    return estimatedEndDate
        ? `${duration} (do ${formatDateForDisplay({ date: estimatedEndDate })})`
        : duration;
}

export function formatExerciseCount({ count }: { count: number }) {
    if (!count) {
        return 'Brak ćwiczeń';
    }

    return formatCount({ count, one: 'ćwiczenie', few: 'ćwiczenia', many: 'ćwiczeń' });
}

function formatSetTarget({
    set,
    targetType
}: {
    set: TrainingDayExerciseSet;
    targetType: TrainingDayExerciseTargetType;
}) {
    if (targetType === TrainingDayExerciseTargetType.Duration) {
        return set.durationSeconds ? formatSeconds({ seconds: set.durationSeconds }) : null;
    }

    return set.reps;
}

function formatLoadKg({ loadKg }: { loadKg: number | null }) {
    return loadKg === null ? null : `${loadKg.toLocaleString('pl-PL')} kg`;
}

function toSetTableRow({
    set,
    index,
    targetType
}: {
    set: TrainingDayExerciseSet;
    index: number;
    targetType: TrainingDayExerciseTargetType;
}): SetTableRow {
    return {
        number: String(index + 1),
        target: formatSetTarget({ set, targetType }),
        load: formatLoadKg({ loadKg: set.loadKg }),
        rir: set.rir
    };
}

export function getSetTable({
    exercise
}: {
    exercise: Pick<TrainingDayExerciseDetails, 'sets' | 'targetType'>;
}): SetTable {
    const rows = exercise.sets.map((set, index) =>
        toSetTableRow({ set, index, targetType: exercise.targetType })
    );

    return {
        targetLabel: setTargetLabels[exercise.targetType],
        rows: rows.length ? rows : [emptySetTableRow]
    };
}

export function getPrescriptionItems({
    exercise,
    restLabel
}: {
    exercise: TrainingDayExerciseDetails;
    restLabel: string;
}): PrescriptionItem[] {
    return [
        { icon: GaugeIcon, label: 'Tempo', value: exercise.tempo },
        {
            icon: TimerIcon,
            label: restLabel,
            value: formatRest({ restSeconds: exercise.restSeconds })
        }
    ];
}
