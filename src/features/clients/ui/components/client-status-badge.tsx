import { Badge, cn } from '@/shared';

import { ClientStatus, type ClientStatus as ClientStatusValue } from '../../domain/client';
import { clientStatusLabels } from '../lib/status';

const clientStatusClassNames: Record<ClientStatusValue, string> = {
    [ClientStatus.Active]:
        'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300',
    [ClientStatus.Paused]: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300',
    [ClientStatus.Ended]: 'bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300'
};

export function ClientStatusBadge({ status }: { status: ClientStatusValue }) {
    return (
        <Badge variant='secondary' className={cn(clientStatusClassNames[status])}>
            {clientStatusLabels[status]}
        </Badge>
    );
}
