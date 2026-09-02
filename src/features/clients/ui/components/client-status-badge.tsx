import { Badge } from '@/shared';

import { ClientStatus, type ClientStatus as ClientStatusValue } from '../../domain/client';

const statusLabels: Record<ClientStatusValue, string> = {
    [ClientStatus.Active]: 'Aktywna',
    [ClientStatus.Paused]: 'Wstrzymana',
    [ClientStatus.Ended]: 'Zakończona'
};

export function ClientStatusBadge({ status }: { status: ClientStatusValue }) {
    const variant = status === ClientStatus.Active ? 'default' : 'secondary';
    return <Badge variant={variant}>{statusLabels[status]}</Badge>;
}
