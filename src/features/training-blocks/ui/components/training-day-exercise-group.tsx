'use client';

import { ArrowDownIcon, ArrowUpIcon, Link2Icon } from 'lucide-react';

import { Button } from '@/shared';

import { useTrainingDayExerciseGroupActions } from '../hooks/use-training-day-exercise-group-actions';
import type { ExerciseGroup } from '../lib/exercise-groups';
import { TrainingDayExerciseTile } from './training-day-exercise-tile';

export function TrainingDayExerciseGroup({
    trainingBlockId,
    trainingDayId,
    group
}: {
    trainingBlockId: string;
    trainingDayId: string;
    group: ExerciseGroup;
}) {
    const { isPending, moveEarlier, moveLater } = useTrainingDayExerciseGroupActions({
        trainingBlockId,
        trainingDayId,
        trainingDayExerciseId: group.id
    });
    const tiles = group.items.map(item => (
        <TrainingDayExerciseTile
            key={item.exercise.id}
            trainingBlockId={trainingBlockId}
            trainingDayId={trainingDayId}
            item={item}
        />
    ));

    if (!group.isLinked) {
        return tiles;
    }

    return (
        <div className='-mx-3 flex flex-col gap-4 rounded-xl border border-dashed p-3'>
            <div className='flex items-center justify-between gap-2'>
                <span className='flex items-center gap-3 text-sm font-medium'>
                    <span className='flex size-7 shrink-0 items-center justify-center'>
                        <Link2Icon className='size-4' />
                    </span>
                    Ćwiczenia łączone
                </span>
                <div className='flex items-center gap-0.5'>
                    <Button
                        variant='ghost'
                        size='icon-sm'
                        aria-label='Przenieś grupę wcześniej'
                        disabled={group.isFirst || isPending}
                        onClick={moveEarlier}
                    >
                        <ArrowUpIcon />
                    </Button>
                    <Button
                        variant='ghost'
                        size='icon-sm'
                        aria-label='Przenieś grupę później'
                        disabled={group.isLast || isPending}
                        onClick={moveLater}
                    >
                        <ArrowDownIcon />
                    </Button>
                </div>
            </div>
            {tiles}
        </div>
    );
}
