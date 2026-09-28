import Link from 'next/link';
import { ArrowLeftIcon } from 'lucide-react';

import { getClientTrainingPath } from '@/features/clients';
import {
    Button,
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    formatDateForDisplay
} from '@/shared';

import type { TrainingBlockDetails } from '../queries/get-training-block-details-or-redirect';
import { TrainingBlockStatusBadge } from './training-block-status-badge';

export function TrainingBlockProfile({ trainingBlock }: { trainingBlock: TrainingBlockDetails }) {
    return (
        <div className='flex flex-col gap-6'>
            <div>
                <Button
                    variant='ghost'
                    render={
                        <Link href={getClientTrainingPath({ clientId: trainingBlock.clientId })} />
                    }
                    nativeButton={false}
                >
                    <ArrowLeftIcon data-icon='inline-start' />
                    Plany podopiecznego
                </Button>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>{trainingBlock.name}</CardTitle>
                    <CardDescription>
                        {trainingBlock.description || 'Roboczy blok treningowy bez opisu.'}
                    </CardDescription>
                    <CardAction>
                        <TrainingBlockStatusBadge status={trainingBlock.status} />
                    </CardAction>
                </CardHeader>
                <CardContent>
                    <dl className='grid gap-3 text-sm sm:grid-cols-3'>
                        <div>
                            <dt className='text-muted-foreground'>Rozpoczęcie</dt>
                            <dd>{formatDateForDisplay({ date: trainingBlock.startDate })}</dd>
                        </div>
                        <div>
                            <dt className='text-muted-foreground'>Utworzono</dt>
                            <dd>{formatDateForDisplay({ date: trainingBlock.createdAt })}</dd>
                        </div>
                        <div>
                            <dt className='text-muted-foreground'>Planowany czas</dt>
                            <dd>
                                {trainingBlock.durationWeeks
                                    ? `${trainingBlock.durationWeeks} tyg.`
                                    : 'Nieokreślony'}
                            </dd>
                        </div>
                    </dl>
                </CardContent>
            </Card>
        </div>
    );
}
