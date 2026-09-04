import { err, ok } from '@/shared';

import { ClientErrorCode } from '../../domain/errors';
import type { ClientRepository } from '../ports/client-repository';

export type GetClientParams = {
    coachId: string;
    clientId: string;
};

export function getClientFactory({ clientRepository }: { clientRepository: ClientRepository }) {
    return async ({ coachId, clientId }: GetClientParams) => {
        const client = await clientRepository.findById({ clientId, filter: { coachId } });
        return client ? ok(client) : err(ClientErrorCode.NotFound);
    };
}
