import type { ClientRepository } from '../ports/client-repository';

export type ListClientsParams = {
    coachId: string;
};

export function listClientsFactory({ clientRepository }: { clientRepository: ClientRepository }) {
    return ({ coachId }: ListClientsParams) => clientRepository.findAll({ filter: { coachId } });
}
