import { ClientStatus } from '../../domain/client';

export const clientStatusLabels: Record<ClientStatus, string> = {
    [ClientStatus.Active]: 'Aktywna',
    [ClientStatus.Paused]: 'Wstrzymana',
    [ClientStatus.Ended]: 'Zakończona'
};

export const clientStatusOptions: { value: ClientStatus; label: string }[] = [
    { value: ClientStatus.Active, label: clientStatusLabels[ClientStatus.Active] },
    { value: ClientStatus.Paused, label: clientStatusLabels[ClientStatus.Paused] },
    { value: ClientStatus.Ended, label: clientStatusLabels[ClientStatus.Ended] }
];

export function isClientStatus(value: unknown): value is ClientStatus {
    return clientStatusOptions.some(option => option.value === value);
}
