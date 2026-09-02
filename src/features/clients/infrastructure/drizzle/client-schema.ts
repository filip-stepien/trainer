import {
    date,
    index,
    pgEnum,
    pgTable,
    primaryKey,
    text,
    timestamp,
    uniqueIndex,
    uuid,
    varchar
} from 'drizzle-orm/pg-core';

import { ClientStatus } from '../../domain/client';

export const coachClientEmailUniqueConstraint = 'coach_clients_coach_email_unique';

export const clientStatusEnum = pgEnum('client_status', [
    ClientStatus.Active,
    ClientStatus.Paused,
    ClientStatus.Ended
]);

export const clientsTable = pgTable('clients', {
    id: uuid('id').primaryKey().defaultRandom(),
    authUserId: text('auth_user_id').unique(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow()
});

export const coachClientsTable = pgTable(
    'coach_clients',
    {
        coachId: text('coach_id').notNull(),
        clientId: uuid('client_id')
            .notNull()
            .references(() => clientsTable.id, { onDelete: 'cascade' }),
        firstName: varchar('first_name', { length: 100 }).notNull(),
        lastName: varchar('last_name', { length: 100 }).notNull(),
        email: varchar('email', { length: 320 }).notNull(),
        phone: varchar('phone', { length: 50 }),
        status: clientStatusEnum('status').notNull().default(ClientStatus.Active),
        startedAt: date('started_at').notNull(),
        createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
        updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow()
    },
    table => [
        primaryKey({ columns: [table.coachId, table.clientId] }),
        uniqueIndex(coachClientEmailUniqueConstraint).on(table.coachId, table.email),
        index('coach_clients_coach_name_index').on(table.coachId, table.lastName, table.firstName)
    ]
);
