'use client';

import { useState } from 'react';

import { getMatchingExerciseOptionIds } from '../lib/filtering';

export function useExerciseOptionSearch<Option extends { id: string; name: string }>({
    exerciseOptions
}: {
    exerciseOptions: Option[];
}) {
    const [search, setSearch] = useState('');
    const matchingIds = getMatchingExerciseOptionIds({ exerciseOptions, search });

    return { search, matchingIds, hasMatches: matchingIds.size > 0, setSearch };
}
