'use client';

import { useState } from 'react';
import { CalendarDaysIcon, PlusIcon } from 'lucide-react';

import {
    AddTile,
    Button,
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
    PageSection,
    cn
} from '@/shared';

import type { TrainingDayExerciseSection } from '../../domain/training-day-exercise';
import { useTrainingDaySelection } from '../hooks/use-training-day-selection';
import { formatExerciseCount } from '../lib/format';
import type {
    TrainingBlockDetails,
    TrainingDayDetails
} from '../queries/get-training-block-details-or-redirect';
import { CreateTrainingDayDialog } from './training-day-dialogs';
import { TrainingDayPanel } from './training-day-panel';

function TrainingDayTile({
    trainingDay,
    isSelected,
    onSelect
}: {
    trainingDay: TrainingDayDetails;
    isSelected: boolean;
    onSelect: () => void;
}) {
    return (
        <button
            type='button'
            onClick={onSelect}
            aria-pressed={isSelected}
            className={cn(
                'bg-card ring-foreground/10 hover:ring-foreground/25 focus-visible:ring-ring/50 flex flex-col justify-center gap-1 rounded-xl px-4 py-3 text-left ring-1 transition-shadow outline-none focus-visible:ring-3',
                isSelected && 'ring-primary hover:ring-primary shadow-sm ring-2'
            )}
        >
            <span className='line-clamp-2 font-medium'>{trainingDay.name}</span>
            <span className='text-muted-foreground text-sm'>
                {formatExerciseCount({ count: trainingDay.exercises.length })}
            </span>
        </button>
    );
}

function TrainingDaysEmpty({ onCreate }: { onCreate: () => void }) {
    return (
        <Empty className='border'>
            <EmptyHeader>
                <EmptyMedia variant='icon'>
                    <CalendarDaysIcon />
                </EmptyMedia>
                <EmptyTitle>Zacznij od dni treningowych</EmptyTitle>
                <EmptyDescription>
                    Dodaj pierwszy dzień, np. „Trening A — góra ciała”. Potem wypełnisz go
                    rozgrzewką i częścią główną.
                </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
                <Button onClick={onCreate}>
                    <PlusIcon data-icon='inline-start' />
                    Dodaj pierwszy dzień
                </Button>
            </EmptyContent>
        </Empty>
    );
}

export function TrainingBlockEditor({
    trainingBlock,
    initialDayId,
    initialAddSection
}: {
    trainingBlock: TrainingBlockDetails;
    initialDayId?: string;
    initialAddSection?: TrainingDayExerciseSection;
}) {
    const trainingDays = trainingBlock.trainingDays;
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const { selectedDay, selectedIndex, pendingAddSection, selectDay } = useTrainingDaySelection({
        trainingDays,
        initialDayId,
        initialAddSection
    });
    const createDialog = (
        <CreateTrainingDayDialog
            open={isCreateOpen}
            onOpenChange={setIsCreateOpen}
            trainingBlockId={trainingBlock.id}
        />
    );

    if (!selectedDay) {
        return (
            <>
                <TrainingDaysEmpty onCreate={() => setIsCreateOpen(true)} />
                {createDialog}
            </>
        );
    }

    return (
        <div className='flex flex-col gap-6'>
            <PageSection
                title='Dni treningowe'
                description='Wybierz dzień, aby ułożyć w nim rozgrzewkę i część główną.'
            >
                <div className='grid gap-3 sm:grid-cols-2 lg:grid-cols-4'>
                    {trainingDays.map((trainingDay, index) => (
                        <TrainingDayTile
                            key={trainingDay.id}
                            trainingDay={trainingDay}
                            isSelected={index === selectedIndex}
                            onSelect={() => selectDay(trainingDay.id)}
                        />
                    ))}
                    <AddTile className='min-h-16 flex-row' onClick={() => setIsCreateOpen(true)}>
                        <PlusIcon />
                        Dodaj dzień
                    </AddTile>
                </div>
            </PageSection>
            <TrainingDayPanel
                key={selectedDay.id}
                trainingBlockId={trainingBlock.id}
                trainingDay={selectedDay}
                dayNumber={selectedIndex + 1}
                dayCount={trainingDays.length}
                exerciseOptions={trainingBlock.exerciseOptions}
                initialAddSection={pendingAddSection}
            />
            {createDialog}
        </div>
    );
}
