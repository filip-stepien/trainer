'use client';

import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';

import {
    Button,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
    PageSection,
    Tile,
    TileGrid,
    TileLink,
    formatDateForDisplay
} from '@/shared';
import { usePagination } from '@/shared/client';

import { getTrainingBlockPath } from '../lib/routes';
import { groupTrainingBlocksByStatus } from '../lib/status';
import type { TrainingBlockListItem } from '../queries/get-training-block-list-or-redirect';
import { CreateTrainingBlockDialog } from './create-training-block-dialog';
import { TrainingBlockMeta } from './training-block-meta';
import { TrainingBlockStatusBadge } from './training-block-status-badge';

const trainingBlocksPerPage = 3;

function TrainingBlockTile({ trainingBlock }: { trainingBlock: TrainingBlockListItem }) {
    return (
        <Tile interactive={trainingBlock.hasDraft}>
            <CardHeader>
                <CardTitle className='line-clamp-1'>
                    {trainingBlock.hasDraft ? (
                        <TileLink
                            href={getTrainingBlockPath({ trainingBlockId: trainingBlock.id })}
                        >
                            {trainingBlock.name}
                        </TileLink>
                    ) : (
                        trainingBlock.name
                    )}
                </CardTitle>
                <CardDescription className='line-clamp-2'>
                    {trainingBlock.description || 'Brak opisu celu bloku.'}
                </CardDescription>
                <CardAction>
                    <TrainingBlockStatusBadge status={trainingBlock.status} />
                </CardAction>
            </CardHeader>
            <CardContent>
                <TrainingBlockMeta
                    startDate={trainingBlock.startDate}
                    durationWeeks={trainingBlock.durationWeeks}
                    className='text-muted-foreground flex-col items-start gap-y-2 text-sm'
                />
            </CardContent>
            <CardFooter className='mt-auto justify-between gap-2'>
                <span className='text-muted-foreground text-xs'>
                    Utworzono {formatDateForDisplay({ date: trainingBlock.createdAt })}
                </span>
                {trainingBlock.hasDraft ? null : (
                    <span className='text-muted-foreground text-xs'>Brak wersji roboczej</span>
                )}
            </CardFooter>
        </Tile>
    );
}

function SectionPagination({
    title,
    firstItemNumber,
    lastItemNumber,
    itemCount,
    hasPreviousPage,
    hasNextPage,
    onPreviousPage,
    onNextPage
}: {
    title: string;
    firstItemNumber: number;
    lastItemNumber: number;
    itemCount: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
    onPreviousPage: () => void;
    onNextPage: () => void;
}) {
    return (
        <nav className='flex items-center gap-1' aria-label={`Strony sekcji: ${title}`}>
            <span className='text-muted-foreground mr-1 text-xs tabular-nums'>
                {firstItemNumber}–{lastItemNumber} z {itemCount}
            </span>
            <Button
                variant='outline'
                size='icon-sm'
                aria-label='Poprzednie bloki'
                disabled={!hasPreviousPage}
                onClick={onPreviousPage}
            >
                <ChevronLeftIcon />
            </Button>
            <Button
                variant='outline'
                size='icon-sm'
                aria-label='Następne bloki'
                disabled={!hasNextPage}
                onClick={onNextPage}
            >
                <ChevronRightIcon />
            </Button>
        </nav>
    );
}

function TrainingBlockStatusSection({
    title,
    emptyLabel,
    trainingBlocks
}: {
    title: string;
    emptyLabel: string;
    trainingBlocks: TrainingBlockListItem[];
}) {
    const pagination = usePagination({ items: trainingBlocks, pageSize: trainingBlocksPerPage });

    return (
        <section className='flex flex-col gap-3'>
            <div className='flex min-h-7 items-center justify-between gap-2'>
                <h3 className='text-muted-foreground text-sm font-medium'>{title}</h3>
                {pagination.pageCount > 1 ? (
                    <SectionPagination
                        title={title}
                        firstItemNumber={pagination.firstItemNumber}
                        lastItemNumber={pagination.lastItemNumber}
                        itemCount={pagination.itemCount}
                        hasPreviousPage={pagination.hasPreviousPage}
                        hasNextPage={pagination.hasNextPage}
                        onPreviousPage={pagination.goToPreviousPage}
                        onNextPage={pagination.goToNextPage}
                    />
                ) : null}
            </div>
            {pagination.visibleItems.length ? (
                <TileGrid>
                    {pagination.visibleItems.map(trainingBlock => (
                        <TrainingBlockTile key={trainingBlock.id} trainingBlock={trainingBlock} />
                    ))}
                </TileGrid>
            ) : (
                <p className='text-muted-foreground rounded-xl border border-dashed px-4 py-6 text-center text-sm'>
                    {emptyLabel}
                </p>
            )}
        </section>
    );
}

export function TrainingBlockList({
    clientId,
    startDate,
    trainingBlocks
}: {
    clientId: string;
    startDate: string;
    trainingBlocks: TrainingBlockListItem[];
}) {
    return (
        <PageSection
            title='Bloki treningowe'
            actions={<CreateTrainingBlockDialog clientId={clientId} startDate={startDate} />}
        >
            <div className='flex flex-col gap-6'>
                {groupTrainingBlocksByStatus({ trainingBlocks }).map(group => (
                    <TrainingBlockStatusSection
                        key={group.status}
                        title={group.title}
                        emptyLabel={group.emptyLabel}
                        trainingBlocks={group.trainingBlocks}
                    />
                ))}
            </div>
        </PageSection>
    );
}
