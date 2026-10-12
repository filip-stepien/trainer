import { normalizeSearchText } from '@/shared';

export function getMatchingExerciseOptionIds<Option extends { id: string; name: string }>({
    exerciseOptions,
    search
}: {
    exerciseOptions: Option[];
    search: string;
}) {
    const query = normalizeSearchText(search);

    return new Set(
        exerciseOptions
            .filter(option => normalizeSearchText(option.name).includes(query))
            .map(option => option.id)
    );
}
