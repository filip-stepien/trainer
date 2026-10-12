'use client';

import Form from 'next/form';

import { SearchField } from '@/shared';

import { useExerciseSearch } from '../hooks/use-exercise-search';
import { type ExerciseListStatus, type ExerciseListView, getExerciseListPath } from '../lib/routes';

export function ExerciseSearch({
    view,
    status,
    search
}: {
    view: ExerciseListView;
    status: ExerciseListStatus;
    search: string;
}) {
    const { isPending, handleSearchChange } = useExerciseSearch({ view, status });

    return (
        <Form action={getExerciseListPath()} role='search' className='md:max-w-sm md:flex-1'>
            <input type='hidden' name='view' value={view} />
            <input type='hidden' name='status' value={status} />
            <SearchField
                name='search'
                defaultValue={search}
                onChange={handleSearchChange}
                isPending={isPending}
                maxLength={150}
                placeholder='Szukaj ćwiczenia, np. przysiad'
                aria-label='Szukaj ćwiczenia'
            />
        </Form>
    );
}
