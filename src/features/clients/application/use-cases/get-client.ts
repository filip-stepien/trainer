import { err, ok } from '@/shared';

import { ClientErrorCode } from '../../domain/errors';
import type { ClientRepository, FindClientByIdParams } from '../ports/client-repository';

export function getClientFactory({ clientRepository }: { clientRepository: ClientRepository }) {
    return async ({ coachId, clientId }: FindClientByIdParams) => {
        const client = await clientRepository.findById({ coachId, clientId });
        return client ? ok(client) : err(ClientErrorCode.NotFound);
    };
}
