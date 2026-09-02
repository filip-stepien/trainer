import type { ClientRepository, UpdateClientParams } from '../ports/client-repository';

export function updateClientFactory({ clientRepository }: { clientRepository: ClientRepository }) {
    return ({ coachId, clientId, data }: UpdateClientParams) =>
        clientRepository.update({
            coachId,
            clientId,
            data: {
                ...data,
                email: data.email.toLowerCase(),
                phone: data.phone?.trim() || null
            }
        });
}
