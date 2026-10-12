'use client';

import { useState } from 'react';

import type { TrainingDayExerciseSet } from '../../domain/training-day-exercise';
import {
    createNextSetRow,
    getInitialSetRows,
    maxSetCount,
    type SetRowField
} from '../lib/set-rows';

export function useTrainingDayExerciseSetRows({
    defaultSets
}: {
    defaultSets?: TrainingDayExerciseSet[];
}) {
    const [rows, setRows] = useState(() => getInitialSetRows({ defaultSets }));

    function addRow() {
        setRows([...rows, createNextSetRow({ rows, key: crypto.randomUUID() })]);
    }

    function removeRow(key: string) {
        setRows(rows.filter(row => row.key !== key));
    }

    function updateRow({ key, field, value }: { key: string; field: SetRowField; value: string }) {
        setRows(rows.map(row => (row.key === key ? { ...row, [field]: value } : row)));
    }

    return { rows, canAddRow: rows.length < maxSetCount, addRow, removeRow, updateRow };
}
