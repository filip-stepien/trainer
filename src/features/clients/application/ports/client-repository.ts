import type { Result } from '@/shared';

import type { Client, ClientStatus } from '../../domain/client';
import type { ClientErrorCode } from '../../domain/errors';

export type CreateClientData = {
    firstName: string;
    lastName: string;
    email: string;
    phone: string | null;
    startedAt: string;
};

export type UpdateClientData = CreateClientData & {
    status: ClientStatus;
};

export type CreateClientParams = {
    coachId: string;
    data: CreateClientData;
};

export type FindClientsByCoachParams = {
    coachId: string;
};

export type FindClientByIdParams = {
    coachId: string;
    clientId: string;
};

export type UpdateClientParams = {
    coachId: string;
    clientId: string;
    data: UpdateClientData;
};

export type ClientRepository = {
    create: (params: CreateClientParams) => Promise<Result<Client, ClientErrorCode>>;
    findAllByCoach: (params: FindClientsByCoachParams) => Promise<Client[]>;
    findById: (params: FindClientByIdParams) => Promise<Client | null>;
    update: (params: UpdateClientParams) => Promise<Result<Client, ClientErrorCode>>;
};
