'use client';

import { useCallback, useEffect, useMemo, useSyncExternalStore } from 'react';
import { usePathname, useRouter } from 'next/navigation';

import {
    clearReturnPoint,
    getReturnPointVisibility,
    parseReturnPoint,
    readReturnPoint,
    subscribeToReturnPoint
} from '../lib/return-point';

function readServerReturnPoint() {
    return null;
}

export function useReturnPoint() {
    const pathname = usePathname();
    const router = useRouter();
    const storedValue = useSyncExternalStore(
        subscribeToReturnPoint,
        readReturnPoint,
        readServerReturnPoint
    );
    const returnPoint = useMemo(() => parseReturnPoint(storedValue), [storedValue]);
    const { isInScope, isAbandoned } = getReturnPointVisibility({ returnPoint, pathname });
    const href = returnPoint?.href;

    useEffect(() => {
        if (isAbandoned) {
            clearReturnPoint();
        }
    }, [isAbandoned]);

    const returnToPoint = useCallback(() => {
        if (href) {
            clearReturnPoint();
            router.push(href);
        }
    }, [href, router]);

    return { visibleReturnPoint: isInScope ? returnPoint : null, returnToPoint };
}
