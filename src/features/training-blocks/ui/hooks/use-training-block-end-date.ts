'use client';

import { type FormEvent, useState } from 'react';

import { getTrainingBlockEstimatedEndDate } from '../../domain/training-block';

export function useTrainingBlockEndDate({
    startDate,
    durationWeeks
}: {
    startDate: string;
    durationWeeks: number | null;
}) {
    const [estimatedEndDate, setEstimatedEndDate] = useState(() =>
        getTrainingBlockEstimatedEndDate({ startDate, durationWeeks })
    );

    function handleFormChange(event: FormEvent<HTMLFormElement>) {
        const formData = new FormData(event.currentTarget);

        setEstimatedEndDate(
            getTrainingBlockEstimatedEndDate({
                startDate: String(formData.get('startDate') ?? ''),
                durationWeeks: Number(formData.get('durationWeeks')) || null
            })
        );
    }

    return { estimatedEndDate, handleFormChange };
}
