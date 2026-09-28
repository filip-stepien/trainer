import Link from 'next/link';
import { ClipboardListIcon, PlusIcon } from 'lucide-react';

import { getClientPath } from '@/features/clients';
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
    buttonVariants,
    formatDateForDisplay
} from '@/shared';

import { getNewTrainingBlockPath, getTrainingBlockPath } from '../lib/routes';
import type { TrainingBlockListItem } from '../queries/get-training-block-list-or-redirect';
import { TrainingBlockStatusBadge } from './training-block-status-badge';

export function TrainingBlockList({
    clientId,
    clientName,
    trainingBlocks
}: {
    clientId: string;
    clientName: string;
    trainingBlocks: TrainingBlockListItem[];
}) {
    return (
        <div className='flex flex-col gap-6'>
            <div className='flex flex-wrap items-center justify-between gap-3'>
                <div className='flex flex-col gap-1'>
                    <h1 className='text-2xl font-semibold tracking-tight'>Plany treningowe</h1>
                    <p className='text-muted-foreground text-sm'>{clientName}</p>
                </div>
                <div className='flex items-center gap-2'>
                    <Button
                        variant='outline'
                        render={<Link href={getClientPath({ clientId })} />}
                        nativeButton={false}
                    >
                        Profil
                    </Button>
                    <Button
                        render={<Link href={getNewTrainingBlockPath({ clientId })} />}
                        nativeButton={false}
                    >
                        <PlusIcon data-icon='inline-start' />
                        Nowy blok
                    </Button>
                </div>
            </div>

            {trainingBlocks.length ? (
                <div className='grid gap-4'>
                    {trainingBlocks.map(trainingBlock => (
                        <Card key={trainingBlock.id}>
                            <CardHeader>
                                <CardTitle>{trainingBlock.name}</CardTitle>
                                <CardDescription>
                                    {trainingBlock.description || 'Brak opisu bloku.'}
                                </CardDescription>
                                <CardAction>
                                    <TrainingBlockStatusBadge status={trainingBlock.status} />
                                </CardAction>
                            </CardHeader>
                            <CardContent className='flex flex-wrap items-center justify-between gap-3'>
                                <p className='text-muted-foreground text-sm'>
                                    {trainingBlock.durationWeeks
                                        ? `${trainingBlock.durationWeeks} tyg.`
                                        : 'Czas trwania nieokreślony'}
                                    {' · '}
                                    {trainingBlock.hasDraft
                                        ? 'Wersja robocza'
                                        : 'Brak wersji roboczej'}
                                    {' · '}
                                    Start: {formatDateForDisplay({ date: trainingBlock.startDate })}
                                    {' · '}
                                    Utworzono:{' '}
                                    {formatDateForDisplay({ date: trainingBlock.createdAt })}
                                </p>
                                <Link
                                    href={getTrainingBlockPath({
                                        trainingBlockId: trainingBlock.id
                                    })}
                                    className={buttonVariants({ variant: 'outline' })}
                                >
                                    Otwórz
                                </Link>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <Card>
                    <CardContent>
                        <Empty>
                            <EmptyHeader>
                                <EmptyMedia variant='icon'>
                                    <ClipboardListIcon />
                                </EmptyMedia>
                                <EmptyTitle>Brak bloków treningowych</EmptyTitle>
                                <EmptyDescription>
                                    Utwórz pierwszy szkic planu dla tego podopiecznego.
                                </EmptyDescription>
                            </EmptyHeader>
                            <EmptyContent>
                                <Button
                                    render={<Link href={getNewTrainingBlockPath({ clientId })} />}
                                    nativeButton={false}
                                >
                                    <PlusIcon data-icon='inline-start' />
                                    Utwórz blok
                                </Button>
                            </EmptyContent>
                        </Empty>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
