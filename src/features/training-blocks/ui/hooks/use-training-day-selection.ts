'use client';

import { useEffect, useState } from 'react';

import type { TrainingDayExerciseSection } from '../../domain/training-day-exercise';
import { TrainingBlockSearchParam } from '../lib/routes';

function getInitialDayId({
    trainingDayIds,
    initialDayId
}: {
    trainingDayIds: string[];
    initialDayId?: string;
}) {
    return initialDayId && trainingDayIds.includes(initialDayId)
        ? initialDayId
        : (trainingDayIds[0] ?? null);
}

function removeAddExerciseSearchParam() {
    const url = new URL(window.location.href);

    if (url.searchParams.has(TrainingBlockSearchParam.AddExerciseSection)) {
        url.searchParams.delete(TrainingBlockSearchParam.AddExerciseSection);
        window.history.replaceState(null, '', url);
    }
}

export function useTrainingDaySelection<Day extends { id: string }>({
    trainingDays,
    initialDayId,
    initialAddSection
}: {
    trainingDays: Day[];
    initialDayId?: string;
    initialAddSection?: TrainingDayExerciseSection;
}) {
    const trainingDayIds = trainingDays.map(trainingDay => trainingDay.id);
    const [selectedDayId, setSelectedDayId] = useState(() =>
        getInitialDayId({ trainingDayIds, initialDayId })
    );
    const [knownDayIds, setKnownDayIds] = useState(trainingDayIds);
    const [pendingAddSection, setPendingAddSection] = useState(initialAddSection);

    useEffect(removeAddExerciseSearchParam, []);

    function selectDay(trainingDayId: string) {
        setPendingAddSection(undefined);
        setSelectedDayId(trainingDayId);
    }

    if (trainingDayIds.join() !== knownDayIds.join()) {
        const addedDayId = trainingDayIds.find(id => !knownDayIds.includes(id));
        setKnownDayIds(trainingDayIds);

        if (addedDayId) {
            selectDay(addedDayId);
        }
    }

    const selectedIndex = Math.max(trainingDayIds.indexOf(selectedDayId ?? ''), 0);
    const selectedDay: Day | undefined = trainingDays[selectedIndex];

    return { selectedDay, selectedIndex, pendingAddSection, selectDay };
}
