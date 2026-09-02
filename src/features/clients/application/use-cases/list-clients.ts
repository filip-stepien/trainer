import type { ClientRepository, FindClientsByCoachParams } from '../ports/client-repository';

export function listClientsFactory({ clientRepository }: { clientRepository: ClientRepository }) {
    return ({ coachId }: FindClientsByCoachParams) => clientRepository.findAllByCoach({ coachId });
}
