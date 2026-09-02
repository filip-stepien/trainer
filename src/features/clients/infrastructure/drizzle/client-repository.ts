import { and, asc, eq, sql } from 'drizzle-orm';

import { err, isDrizzleError, ok, type DrizzleDatabase } from '@/shared/server';

import { ClientStatus, type Client } from '../../domain/client';
import { ClientErrorCode } from '../../domain/errors';
import type { ClientRepository } from '../../application/ports/client-repository';
import { clientsTable, coachClientEmailUniqueConstraint, coachClientsTable } from './client-schema';

const clientSelection = {
    id: coachClientsTable.clientId,
    firstName: coachClientsTable.firstName,
    lastName: coachClientsTable.lastName,
    email: coachClientsTable.email,
    phone: coachClientsTable.phone,
    status: coachClientsTable.status,
    startedAt: coachClientsTable.startedAt,
    createdAt: coachClientsTable.createdAt,
    updatedAt: coachClientsTable.updatedAt
};

type ClientRow = {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string | null;
    status: ClientStatus;
    startedAt: string;
    createdAt: Date;
    updatedAt: Date;
};

function toClient(row: ClientRow): Client {
    return {
        ...row,
        createdAt: row.createdAt.toISOString(),
        updatedAt: row.updatedAt.toISOString()
    };
}

function isEmailAlreadyInUse(error: unknown): boolean {
    if (!isDrizzleError(error)) {
        return false;
    }

    return error.cause.constraint === coachClientEmailUniqueConstraint;
}

export function createDrizzleClientRepository({
    database
}: {
    database: DrizzleDatabase;
}): ClientRepository {
    return {
        async create({ coachId, data }) {
            try {
                const createdClient = database
                    .$with('created_client')
                    .as(
                        database.insert(clientsTable).values({}).returning({ id: clientsTable.id })
                    );

                const rows = await database
                    .with(createdClient)
                    .insert(coachClientsTable)
                    .values({
                        coachId,
                        clientId: sql`(select ${createdClient.id} from ${createdClient})`,
                        ...data
                    })
                    .returning(clientSelection);

                const row = rows[0];
                if (!row) {
                    throw new Error('Client insert did not return a row.');
                }

                return ok(toClient(row));
            } catch (error) {
                if (isEmailAlreadyInUse(error)) {
                    return err(ClientErrorCode.EmailAlreadyInUse);
                }
                throw error;
            }
        },

        async findAllByCoach({ coachId }) {
            const rows = await database
                .select(clientSelection)
                .from(coachClientsTable)
                .where(eq(coachClientsTable.coachId, coachId))
                .orderBy(asc(coachClientsTable.lastName), asc(coachClientsTable.firstName));

            return rows.map(toClient);
        },

        async findById({ coachId, clientId }) {
            const rows = await database
                .select(clientSelection)
                .from(coachClientsTable)
                .where(
                    and(
                        eq(coachClientsTable.coachId, coachId),
                        eq(coachClientsTable.clientId, clientId)
                    )
                )
                .limit(1);

            return rows[0] ? toClient(rows[0]) : null;
        },

        async update({ coachId, clientId, data }) {
            try {
                const rows = await database
                    .update(coachClientsTable)
                    .set({ ...data, updatedAt: new Date() })
                    .where(
                        and(
                            eq(coachClientsTable.coachId, coachId),
                            eq(coachClientsTable.clientId, clientId)
                        )
                    )
                    .returning(clientSelection);

                return rows[0] ? ok(toClient(rows[0])) : err(ClientErrorCode.NotFound);
            } catch (error) {
                if (isEmailAlreadyInUse(error)) {
                    return err(ClientErrorCode.EmailAlreadyInUse);
                }
                throw error;
            }
        }
    };
}
