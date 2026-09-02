import { Spinner } from '@/shared';

export function DashboardPageLoading() {
    return (
        <div
            className='text-muted-foreground flex min-h-48 items-center justify-center gap-2 text-sm'
            role='status'
        >
            <Spinner aria-hidden='true' />
            <span>Ładowanie…</span>
        </div>
    );
}
