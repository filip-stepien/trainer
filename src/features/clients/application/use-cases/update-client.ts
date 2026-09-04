import type { ClientRepository, UpdateClientData } from '../ports/client-repository';

export type UpdateClientParams = {
    coachId: string;
    clientId: string;
    data: UpdateClientData;
};

export function updateClientFactory({ clientRepository }: { clientRepository: ClientRepository }) {
    return ({ coachId, clientId, data }: UpdateClientParams) =>
        clientRepository.updateById({
            clientId,
            data: {
                ...data,
                email: data.email.toLowerCase(),
                phone: data.phone?.trim() || null
            },
            filter: { coachId }
        });
}
