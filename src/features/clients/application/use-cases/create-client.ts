import type { ClientRepository, CreateClientParams } from '../ports/client-repository';

export function createClientFactory({ clientRepository }: { clientRepository: ClientRepository }) {
    return ({ coachId, data }: CreateClientParams) =>
        clientRepository.create({
            coachId,
            data: {
                ...data,
                email: data.email.toLowerCase(),
                phone: data.phone?.trim() || null
            }
        });
}
