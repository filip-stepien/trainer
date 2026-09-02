import 'server-only';

import { createNeonDrizzleDatabase } from '@/shared/server';

import { createClientFactory } from './application/use-cases/create-client';
import { getClientFactory } from './application/use-cases/get-client';
import { listClientsFactory } from './application/use-cases/list-clients';
import { updateClientFactory } from './application/use-cases/update-client';
import { createDrizzleClientRepository } from './infrastructure/drizzle/client-repository';

const clientRepository = createDrizzleClientRepository({ database: createNeonDrizzleDatabase() });

export const createClient = createClientFactory({ clientRepository });
export const updateClient = updateClientFactory({ clientRepository });
export const getClient = getClientFactory({ clientRepository });
export const listClients = listClientsFactory({ clientRepository });
