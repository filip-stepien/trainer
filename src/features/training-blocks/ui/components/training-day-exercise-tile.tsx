'use client';

import { useState } from 'react';
import { ExternalLinkIcon } from 'lucide-react';

import { ConfirmDialog, cn } from '@/shared';

import { useTrainingDayExerciseActions } from '../hooks/use-training-day-exercise-actions';
import type { ExerciseGroupItem } from '../lib/exercise-groups';
import { getPrescriptionItems, getSetTable } from '../lib/format';
import { EditTrainingDayExerciseDialog } from './edit-training-day-exercise-dialog';
import { ReorderActionsMenu } from './reorder-actions-menu';

function SetCell({ value }: { value: string | null }) {
    return (
        <td className={cn('truncate py-1', value ? 'font-medium' : 'text-muted-foreground')}>
            {value ?? '—'}
        </td>
    );
}

export function TrainingDayExerciseTile({
    trainingBlockId,
    trainingDayId,
    item
}: {
    trainingBlockId: string;
    trainingDayId: string;
    item: ExerciseGroupItem;
}) {
    const { exercise, label, restLabel, isFirst, isLast, canLinkToPrevious, isLinkedToNext } = item;
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const { isPending, moveEarlier, moveLater, deleteExercise, toggleLink } =
        useTrainingDayExerciseActions({
            trainingBlockId,
            trainingDayId,
            trainingDayExerciseId: exercise.id,
            isLinkedToPrevious: exercise.isLinkedToPrevious
        });
    const prescription = getPrescriptionItems({ exercise, restLabel });
    const setTable = getSetTable({ exercise });

    return (
        <div className={cn('flex items-start gap-3 transition-opacity', isPending && 'opacity-60')}>
            <div className='flex shrink-0 flex-col items-center self-stretch'>
                <span className='bg-muted mt-3 flex size-7 items-center justify-center rounded-full text-xs font-medium'>
                    {label}
                </span>
                {isLinkedToNext ? (
                    <span aria-hidden='true' className='bg-border -mb-7 w-0.5 flex-1' />
                ) : null}
            </div>
            <div className='bg-card ring-foreground/10 flex max-w-xl min-w-0 flex-1 flex-col rounded-xl ring-1'>
                <div className='bg-muted/50 flex items-center justify-between gap-3 rounded-t-xl border-b px-4 py-3'>
                    <div className='flex min-w-0 flex-col gap-0.5'>
                        <span className='leading-tight font-medium'>{exercise.name}</span>
                        {exercise.videoUrl ? (
                            <a
                                href={exercise.videoUrl}
                                target='_blank'
                                rel='noreferrer'
                                className='text-muted-foreground hover:text-foreground flex items-center gap-1 self-start text-xs'
                            >
                                Film instruktażowy
                                <ExternalLinkIcon className='size-3' />
                            </a>
                        ) : null}
                    </div>
                    <div className='-mr-1.5 flex shrink-0 items-center gap-0.5'>
                        <ReorderActionsMenu
                            label={`Akcje ćwiczenia: ${exercise.name}`}
                            editLabel='Edytuj zalecenia'
                            deleteLabel='Usuń z dnia'
                            isFirst={isFirst}
                            isLast={isLast}
                            isPending={isPending}
                            link={{
                                isLinked: exercise.isLinkedToPrevious,
                                canLink: canLinkToPrevious,
                                onToggle: toggleLink
                            }}
                            onEdit={() => setIsEditOpen(true)}
                            onMoveEarlier={moveEarlier}
                            onMoveLater={moveLater}
                            onDelete={() => setIsDeleteOpen(true)}
                        />
                    </div>
                </div>
                <div className='flex flex-col gap-3 px-4 py-3 text-sm'>
                    <table className='w-full table-fixed text-left'>
                        <thead>
                            <tr className='text-muted-foreground text-xs'>
                                <th className='w-12 pb-1 font-normal'>Seria</th>
                                <th className='pb-1 font-normal'>{setTable.targetLabel}</th>
                                <th className='pb-1 font-normal'>Obciążenie</th>
                                <th className='w-16 pb-1 font-normal'>RIR</th>
                            </tr>
                        </thead>
                        <tbody>
                            {setTable.rows.map((row, index) => (
                                <tr key={index} className='border-t'>
                                    <td className='text-muted-foreground py-1 tabular-nums'>
                                        {row.number ?? '—'}
                                    </td>
                                    <SetCell value={row.target} />
                                    <SetCell value={row.load} />
                                    <SetCell value={row.rir} />
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <dl className='grid grid-cols-2 gap-x-8 border-t pt-3'>
                        {prescription.map(prescriptionItem => (
                            <div key={prescriptionItem.label} className='flex items-center gap-x-3'>
                                <dt className='text-muted-foreground flex items-center gap-1.5'>
                                    <prescriptionItem.icon className='size-4 shrink-0' />
                                    {prescriptionItem.label}
                                </dt>
                                <dd
                                    className={
                                        prescriptionItem.value
                                            ? 'font-medium'
                                            : 'text-muted-foreground'
                                    }
                                >
                                    {prescriptionItem.value ?? '—'}
                                </dd>
                            </div>
                        ))}
                    </dl>
                </div>
                {exercise.notes ? (
                    <p className='text-muted-foreground line-clamp-2 border-t px-4 py-3 text-sm whitespace-pre-line'>
                        {exercise.notes}
                    </p>
                ) : null}
            </div>
            <EditTrainingDayExerciseDialog
                open={isEditOpen}
                onOpenChange={setIsEditOpen}
                trainingBlockId={trainingBlockId}
                trainingDayId={trainingDayId}
                exercise={exercise}
            />
            <ConfirmDialog
                open={isDeleteOpen}
                onOpenChange={setIsDeleteOpen}
                title='Usunąć ćwiczenie z dnia?'
                description={`„${exercise.name}” zniknie z tego dnia treningowego. Biblioteka ćwiczeń pozostanie bez zmian.`}
                confirmLabel='Usuń ćwiczenie'
                onConfirm={deleteExercise}
            />
        </div>
    );
}
