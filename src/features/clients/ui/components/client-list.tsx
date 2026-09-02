import Link from 'next/link';
import { PlusIcon, UsersIcon } from 'lucide-react';

import {
    Button,
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/shared';

import { formatDateForDisplay } from '../lib/date';
import { getClientPath, getNewClientPath } from '../lib/routes';
import type { ClientListItem } from '../queries/get-client-list-or-redirect';
import { ClientStatusBadge } from './client-status-badge';

export function ClientList({ clients }: { clients: ClientListItem[] }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Podopieczni</CardTitle>
                <CardDescription>
                    Zarządzaj danymi kontaktowymi i statusem współpracy.
                </CardDescription>
                <CardAction>
                    <Button render={<Link href={getNewClientPath()} />} nativeButton={false}>
                        <PlusIcon data-icon='inline-start' />
                        Dodaj podopiecznego
                    </Button>
                </CardAction>
            </CardHeader>
            <CardContent>
                {clients.length === 0 ? (
                    <Empty>
                        <EmptyHeader>
                            <EmptyMedia variant='icon'>
                                <UsersIcon />
                            </EmptyMedia>
                            <EmptyTitle>Nie masz jeszcze podopiecznych</EmptyTitle>
                            <EmptyDescription>
                                Dodaj pierwszą osobę, aby rozpocząć prowadzenie współpracy.
                            </EmptyDescription>
                        </EmptyHeader>
                        <EmptyContent>
                            <Button
                                render={<Link href={getNewClientPath()} />}
                                nativeButton={false}
                            >
                                <PlusIcon data-icon='inline-start' />
                                Dodaj podopiecznego
                            </Button>
                        </EmptyContent>
                    </Empty>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Podopieczny</TableHead>
                                <TableHead>Kontakt</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Początek współpracy</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {clients.map(client => (
                                <TableRow key={client.id}>
                                    <TableCell>
                                        <Button
                                            variant='link'
                                            render={
                                                <Link
                                                    href={getClientPath({ clientId: client.id })}
                                                />
                                            }
                                            nativeButton={false}
                                        >
                                            {client.firstName} {client.lastName}
                                        </Button>
                                    </TableCell>
                                    <TableCell>
                                        <div className='flex flex-col'>
                                            <span>{client.email}</span>
                                            {client.phone ? (
                                                <span className='text-muted-foreground'>
                                                    {client.phone}
                                                </span>
                                            ) : null}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <ClientStatusBadge status={client.status} />
                                    </TableCell>
                                    <TableCell>
                                        {formatDateForDisplay({ date: client.startedAt })}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </CardContent>
        </Card>
    );
}
