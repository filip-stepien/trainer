const storageKey = 'return-point';
const changeEvent = 'return-point-change';

export type ReturnPoint = {
    href: string;
    title: string;
    description: string;
    actionLabel: string;
    scopePath: string;
};

function isReturnPoint(value: unknown): value is ReturnPoint {
    if (typeof value !== 'object' || value === null) {
        return false;
    }

    const fields = value as Record<string, unknown>;
    return ['href', 'title', 'description', 'actionLabel', 'scopePath'].every(
        field => typeof fields[field] === 'string'
    );
}

export function parseReturnPoint(value: string | null) {
    if (!value) {
        return null;
    }

    try {
        const parsed: unknown = JSON.parse(value);
        return isReturnPoint(parsed) ? parsed : null;
    } catch {
        return null;
    }
}

export function getReturnPointVisibility({
    returnPoint,
    pathname
}: {
    returnPoint: ReturnPoint | null;
    pathname: string;
}) {
    if (!returnPoint) {
        return { isInScope: false, isAbandoned: false };
    }

    const [returnPath] = returnPoint.href.split('?');
    const isInScope = pathname.startsWith(returnPoint.scopePath);

    return { isInScope, isAbandoned: !isInScope && pathname !== returnPath };
}

export function readReturnPoint() {
    return sessionStorage.getItem(storageKey);
}

export function subscribeToReturnPoint(onChange: () => void) {
    window.addEventListener(changeEvent, onChange);
    return () => window.removeEventListener(changeEvent, onChange);
}

export function setReturnPoint(returnPoint: ReturnPoint) {
    sessionStorage.setItem(storageKey, JSON.stringify(returnPoint));
    window.dispatchEvent(new Event(changeEvent));
}

export function clearReturnPoint() {
    sessionStorage.removeItem(storageKey);
    window.dispatchEvent(new Event(changeEvent));
}
