'use client';

import { useId, useState } from 'react';
import { ChevronDownIcon, PlusIcon } from 'lucide-react';

import {
    AddTile,
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    ConfirmDialog,
    cn
} from '@/shared';

import { TrainingDayExerciseSection } from '../../domain/training-day-exercise';
import { useTrainingDayActions } from '../hooks/use-training-day-actions';
import { getSectionExerciseGroups } from '../lib/exercise-groups';
import { formatExerciseCount, trainingDayExerciseSectionLabels } from '../lib/format';
import type {
    ExerciseOption,
    TrainingDayDetails
} from '../queries/get-training-block-details-or-redirect';
import { AddTrainingDayExerciseDialog } from './add-training-day-exercise-dialog';
import { ReorderActionsMenu } from './reorder-actions-menu';
import { EditTrainingDayDialog } from './training-day-dialogs';
import { TrainingDayExerciseGroup } from './training-day-exercise-group';

const emptySectionLabels: Record<TrainingDayExerciseSection, string> = {
    [TrainingDayExerciseSection.Warmup]: 'Dodaj ćwiczenie rozgrzewki',
    [TrainingDayExerciseSection.Main]: 'Dodaj pierwsze ćwiczenie części głównej'
};

function ExerciseSection({
    section,
    trainingBlockId,
    trainingDay,
    exerciseOptions,
    isAddInitiallyOpen
}: {
    section: TrainingDayExerciseSection;
    trainingBlockId: string;
    trainingDay: TrainingDayDetails;
    exerciseOptions: ExerciseOption[];
    isAddInitiallyOpen: boolean;
}) {
    const [isAddOpen, setIsAddOpen] = useState(isAddInitiallyOpen);
    const [isExpanded, setIsExpanded] = useState(true);
    const contentId = useId();
    const { exerciseCount, groups } = getSectionExerciseGroups({
        exercises: trainingDay.exercises,
        section
    });

    return (
        <section className='flex flex-col gap-3'>
            <div className='-mx-2'>
                <button
                    type='button'
                    onClick={() => setIsExpanded(!isExpanded)}
                    aria-expanded={isExpanded}
                    aria-controls={contentId}
                    className='hover:bg-muted focus-visible:ring-ring/50 flex w-full cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-left outline-none focus-visible:ring-3'
                >
                    <ChevronDownIcon
                        className={cn(
                            'text-muted-foreground size-4 shrink-0 transition-transform',
                            !isExpanded && '-rotate-90'
                        )}
                    />
                    <span className='flex flex-col'>
                        <span className='font-medium'>
                            {trainingDayExerciseSectionLabels[section]}
                        </span>
                        <span className='text-muted-foreground text-sm'>
                            {formatExerciseCount({ count: exerciseCount })}
                        </span>
                    </span>
                </button>
            </div>
            <div id={contentId} hidden={!isExpanded} className='pb-4'>
                {groups.length ? (
                    <div className='flex flex-col gap-4 px-3'>
                        {groups.map(group => (
                            <TrainingDayExerciseGroup
                                key={group.id}
                                trainingBlockId={trainingBlockId}
                                trainingDayId={trainingDay.id}
                                group={group}
                            />
                        ))}
                        <AddTile
                            className='ml-10 min-h-14 max-w-xl flex-row'
                            onClick={() => setIsAddOpen(true)}
                        >
                            <PlusIcon />
                            Dodaj ćwiczenie
                        </AddTile>
                    </div>
                ) : (
                    <AddTile className='min-h-20 w-full' onClick={() => setIsAddOpen(true)}>
                        <PlusIcon />
                        {emptySectionLabels[section]}
                    </AddTile>
                )}
            </div>
            <AddTrainingDayExerciseDialog
                open={isAddOpen}
                onOpenChange={setIsAddOpen}
                trainingBlockId={trainingBlockId}
                trainingDay={trainingDay}
                section={section}
                exerciseOptions={exerciseOptions}
            />
        </section>
    );
}

export function TrainingDayPanel({
    trainingBlockId,
    trainingDay,
    dayNumber,
    dayCount,
    exerciseOptions,
    initialAddSection
}: {
    trainingBlockId: string;
    trainingDay: TrainingDayDetails;
    dayNumber: number;
    dayCount: number;
    exerciseOptions: ExerciseOption[];
    initialAddSection?: TrainingDayExerciseSection;
}) {
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const { isPending, moveEarlier, moveLater, deleteDay } = useTrainingDayActions({
        trainingBlockId,
        trainingDayId: trainingDay.id
    });

    return (
        <Card className='pt-0'>
            <CardHeader className='bg-muted/50 flex items-center justify-between gap-4 border-b pt-4'>
                <div className='flex min-w-0 flex-col gap-1'>
                    <CardTitle className='text-lg'>{trainingDay.name}</CardTitle>
                    {trainingDay.description ? (
                        <CardDescription className='whitespace-pre-line'>
                            {trainingDay.description}
                        </CardDescription>
                    ) : null}
                </div>
                <CardAction className='self-center'>
                    <ReorderActionsMenu
                        label={`Akcje dnia: ${trainingDay.name}`}
                        editLabel='Edytuj dzień'
                        deleteLabel='Usuń dzień'
                        isFirst={dayNumber === 1}
                        isLast={dayNumber === dayCount}
                        isPending={isPending}
                        onEdit={() => setIsEditOpen(true)}
                        onMoveEarlier={moveEarlier}
                        onMoveLater={moveLater}
                        onDelete={() => setIsDeleteOpen(true)}
                    />
                </CardAction>
            </CardHeader>
            <CardContent className='flex flex-col gap-2'>
                <ExerciseSection
                    section={TrainingDayExerciseSection.Warmup}
                    trainingBlockId={trainingBlockId}
                    trainingDay={trainingDay}
                    exerciseOptions={exerciseOptions}
                    isAddInitiallyOpen={initialAddSection === TrainingDayExerciseSection.Warmup}
                />
                <ExerciseSection
                    section={TrainingDayExerciseSection.Main}
                    trainingBlockId={trainingBlockId}
                    trainingDay={trainingDay}
                    exerciseOptions={exerciseOptions}
                    isAddInitiallyOpen={initialAddSection === TrainingDayExerciseSection.Main}
                />
            </CardContent>
            <EditTrainingDayDialog
                open={isEditOpen}
                onOpenChange={setIsEditOpen}
                trainingBlockId={trainingBlockId}
                trainingDay={trainingDay}
            />
            <ConfirmDialog
                open={isDeleteOpen}
                onOpenChange={setIsDeleteOpen}
                title='Usunąć dzień treningowy?'
                description={`„${trainingDay.name}” zostanie usunięty razem ze wszystkimi ćwiczeniami tego dnia.`}
                confirmLabel='Usuń dzień'
                onConfirm={deleteDay}
            />
        </Card>
    );
}
