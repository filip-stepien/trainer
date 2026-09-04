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

export type SaveClientParams = {
    coachId: string;
    data: CreateClientData;
};

export type ClientFilter = {
    coachId: string;
};

export type FindClientsParams = {
    filter: ClientFilter;
};

export type FindClientByIdParams = {
    clientId: string;
    filter: ClientFilter;
};

export type UpdateClientByIdParams = {
    clientId: string;
    data: UpdateClientData;
    filter: ClientFilter;
};

export type ClientRepository = {
    save: (params: SaveClientParams) => Promise<Result<Client, ClientErrorCode>>;
    findAll: (params: FindClientsParams) => Promise<Client[]>;
    findById: (params: FindClientByIdParams) => Promise<Client | null>;
    updateById: (params: UpdateClientByIdParams) => Promise<Result<Client, ClientErrorCode>>;
};
