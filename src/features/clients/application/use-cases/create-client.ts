import type { ClientRepository, CreateClientData } from '../ports/client-repository';

export type CreateClientParams = {
    coachId: string;
    data: CreateClientData;
};

export function createClientFactory({ clientRepository }: { clientRepository: ClientRepository }) {
    return ({ coachId, data }: CreateClientParams) =>
        clientRepository.save({
            coachId,
            data: {
                ...data,
                email: data.email.toLowerCase(),
                phone: data.phone?.trim() || null
            }
        });
}
