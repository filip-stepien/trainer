'use client';

import { type ChangeEvent, useRef, useTransition } from 'react';
import { useRouter } from 'next/navigation';

import { type ExerciseListStatus, type ExerciseListView, getExerciseListHref } from '../lib/routes';

const searchDelayMs = 300;

export function useExerciseSearch({
    view,
    status
}: {
    view: ExerciseListView;
    status: ExerciseListStatus;
}) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const timeout = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

    function handleSearchChange(event: ChangeEvent<HTMLInputElement>) {
        const search = event.target.value.trim();
        clearTimeout(timeout.current);
        timeout.current = setTimeout(() => {
            startTransition(() => {
                router.replace(getExerciseListHref({ view, status, search, page: 1 }), {
                    scroll: false
                });
            });
        }, searchDelayMs);
    }

    return { isPending, handleSearchChange };
}
