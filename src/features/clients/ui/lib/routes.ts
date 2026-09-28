const clientListPath = '/dashboard/clients';

export function getClientListPath() {
    return clientListPath;
}

export function getNewClientPath() {
    return `${clientListPath}/new`;
}

export function getClientPath({ clientId }: { clientId: string }) {
    return `${clientListPath}/${clientId}`;
}

export function getClientTrainingPath({ clientId }: { clientId: string }) {
    return `${getClientPath({ clientId })}/training`;
}
